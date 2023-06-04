import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { IProductServiceUpdate } from './interface/product-service.interface';
import { CreateProductInput } from './dto/createProduct.input';
import { UserService } from '../user/users.service';
import { ProductTagService } from '../productTag/productTag.service';
import { ProductCategoryService } from '../productCategory/productCategory.service';
import { FindProductsInput } from './dto/findProducts.input';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly productTagService: ProductTagService,
        private readonly userService: UserService,
        private readonly productCategoryService: ProductCategoryService,
    ) {}

    async create(createProductInput: CreateProductInput): Promise<Product> {
        const { categoryName, productTags, email, ...product } =
            createProductInput;

        const user = await this.userService.findOneByEmail({ email });

        if (user == undefined)
            throw new NotFoundException('등록된 회원이 아닙니다.');

        let productCategory = await this.productCategoryService.findOne(
            categoryName,
        );

        if (!productCategory) {
            productCategory = await this.productCategoryService.create({
                categoryName,
            });
        }

        const tagNames = productTags.map((elem) => elem.replace('#', ''));
        const prevTags = await this.productTagService.findByNames(tagNames);

        const temp = [];
        tagNames.forEach((elem) => {
            const exists = prevTags.find((prevEl) => elem === prevEl.tagName);
            if (!exists) temp.push({ tagName: elem });
        });

        const newTags = await this.productTagService.bulkInsert({
            names: temp,
        });

        const tags = [...prevTags, ...newTags.identifiers];

        const result = await this.productRepository.save({
            ...product,
            user,
            productCategory,
            productTags: tags,
        });

        return result;
    }

    async findOne(productId): Promise<Product> {
        const result = await this.productRepository.findOne({
            where: { productId },
            relations: ['productCategory', 'user', 'productTags'],
        });

        return result;
    }

    async findAll(findProductsInput: FindProductsInput): Promise<Product[]> {
        const { userId, categoryName } = findProductsInput;

        const where = {};
        if (userId) {
            where['user'] = { userId };
        }
        if (categoryName) {
            where['productCategory'] = { categoryName };
        }

        return await this.productRepository.find({
            where,
            relations: ['productCategory', 'user', 'productTags'],
        });
    }

    async update({
        productId,
        updateProductInput,
    }: IProductServiceUpdate): Promise<Product> {
        const foundProduct = await this.productRepository.findOne({
            where: { productId },
            relations: ['productCategory', 'productTags', 'user'],
        });

        if (foundProduct == undefined)
            throw new NotFoundException('등록된 상품이 아닙니다.');

        const { categoryName, productTags, ...product } = updateProductInput;

        let productCategoryResult = {};
        if (categoryName != undefined) {
            const productCategory = await this.productCategoryService.findOne(
                foundProduct.productCategory.categoryName,
            );

            if (productCategory) {
                productCategoryResult =
                    await this.productCategoryService.update({
                        productCategoryId: productCategory.productCategoryId,
                        categoryName: productCategory.categoryName,
                    });
            } else {
                productCategoryResult =
                    await this.productCategoryService.create({
                        categoryName: productCategory.categoryName,
                    });
            }
        } else productCategoryResult = foundProduct.productCategory;

        let tags = [];

        if (productTags != undefined) {
            const tagNames = productTags.map((elem) => elem.replace('#', ''));
            const prevTags = await this.productTagService.findByNames(tagNames);

            const temp = [];
            tagNames.forEach((elem) => {
                const exists = prevTags.find(
                    (prevEl) => elem === prevEl.tagName,
                );
                if (!exists) temp.push({ tagName: elem });
            });

            const newTags = await this.productTagService.bulkInsert({
                names: temp,
            });

            tags = [...prevTags, ...newTags.identifiers];
        } else {
            tags = foundProduct.productTags;
        }
        const result = await this.productRepository.save({
            ...foundProduct,
            ...product,
            user: foundProduct.user,
            productCategory: productCategoryResult,
            productTags: tags,
        });

        return result;
    }

    async delete(productId: string): Promise<boolean> {
        const result = await this.productRepository.softRemove({
            productId,
        });

        return result.deletedAt ? true : false;
    }
}
