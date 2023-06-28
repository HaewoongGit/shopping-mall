import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { IProductServiceUpdate } from "./interface/product-service.interface";
import { CreateProductInput } from "./dto/createProduct.input";
import { UserService } from "../user/users.service";
import { ProductTagService } from "../productTag/productTag.service";
import { ProductCategoryService } from "../productCategory/productCategory.service";
import { FindProductsInput } from "./dto/findProducts.input";
import { ProductCategory } from "../productCategory/entities/productCategory.entity";
import { FileService } from "../file/file.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        private readonly productTagService: ProductTagService,
        private readonly userService: UserService,
        private readonly productCategoryService: ProductCategoryService,
        private readonly fileService: FileService,

        private readonly dataSource: DataSource
    ) {}

    async create(createProductInput: CreateProductInput, email): Promise<Product> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction("READ COMMITTED");

        const { categoryName, productTags, file, ...product } = createProductInput;

        console.log(file);

        try {
            const user = await this.userService.findOneByEmail({ email });

            if (user == undefined) throw new NotFoundException("등록된 회원이 아닙니다.");

            let productCategory = await this.productCategoryService.findOne(categoryName);

            if (!productCategory) {
                productCategory = await this.productCategoryService.create(
                    {
                        categoryName,
                    },
                    queryRunner
                );
            }

            const tagNames = productTags.map((elem) => elem.replace("#", ""));
            const prevTags = await this.productTagService.findByNames(tagNames);

            const temp = [];
            tagNames.forEach((elem) => {
                const exists = prevTags.find((prevEl) => elem === prevEl.tagName);
                if (!exists) temp.push({ tagName: elem });
            });

            const newTags = await this.productTagService.bulkInsert(
                {
                    names: temp,
                },
                queryRunner
            );

            const tags = [...prevTags, ...newTags.identifiers];

            const result = await queryRunner.manager.save(Product, {
                ...product,
                user,
                productCategory,
                productTags: tags,
            });

            await this.fileService.uploadFileForTransaction({ file, email, productId: result.productId, userId: user.userId }, queryRunner);

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await this.fileService.deleteFile(file.filename);
            if (error instanceof NotFoundException) {
                throw error;
            }
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(productId): Promise<Product> {
        const result = await this.productRepository.findOne({
            where: { productId },
            relations: ["productCategory", "user", "productTags", "files"],
        });

        return result;
    }

    async findAll(findProductsInput: FindProductsInput): Promise<Product[]> {
        const { userId, categoryName } = findProductsInput;

        const where = {};
        if (userId) {
            where["user"] = { userId };
        }
        if (categoryName) {
            where["productCategory"] = { categoryName };
        }

        return await this.productRepository.find({
            where,
            relations: ["productCategory", "user", "productTags", "files"],
        });
    }

    async increaseHits(productId: string): Promise<Product> {
        const foundProduct = await this.findOne(productId);
        foundProduct.hits++;
        return await this.productRepository.save({ ...foundProduct });
    }

    async update({ productId, updateProductInput }: IProductServiceUpdate): Promise<Product> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction("READ COMMITTED");

        try {
            const foundProduct = await this.productRepository.findOne({
                where: { productId },
                relations: ["productCategory", "productTags", "user"],
            });

            if (foundProduct == undefined) throw new NotFoundException("등록된 상품이 아닙니다.");

            const { categoryName, productTags, ...product } = updateProductInput;

            let productCategoryResult = {};
            if (categoryName != undefined) {
                const productCategory = await this.productCategoryService.findOne(foundProduct.productCategory.categoryName);

                if (!productCategory) {
                    productCategoryResult = await this.productCategoryService.create(
                        {
                            categoryName,
                        },
                        queryRunner
                    );
                } else {
                    productCategoryResult = await this.productCategoryService.update(
                        {
                            productCategoryId: productCategory.productCategoryId,
                            categoryName,
                        },
                        queryRunner
                    );
                }
            }

            let tags = [];

            if (productTags != undefined) {
                const tagNames = productTags.map((elem) => elem.replace("#", ""));
                const prevTags = await this.productTagService.findByNames(tagNames);

                const temp = [];
                tagNames.forEach((elem) => {
                    const exists = prevTags.find((prevEl) => elem === prevEl.tagName);
                    if (!exists) temp.push({ tagName: elem });
                });

                const newTags = await this.productTagService.bulkInsert(
                    {
                        names: temp,
                    },
                    queryRunner
                );

                tags = [...prevTags, ...newTags.identifiers];
            } else {
                tags = foundProduct.productTags;
            }

            const result = await queryRunner.manager.save(Product, {
                ...foundProduct,
                ...product,
                user: foundProduct.user,
                productTags: tags,
            });

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof NotFoundException) {
                throw error;
            }
        } finally {
            await queryRunner.release();
        }
    }

    async delete(productId: string): Promise<boolean> {
        const result = await this.productRepository.softRemove({
            productId,
        });

        return result.deletedAt ? true : false;
    }
}
