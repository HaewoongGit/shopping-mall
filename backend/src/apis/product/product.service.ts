import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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
import { CountProductsInput } from "./dto/countProducts.input";

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

            try {
                const resolvedFile = await file;
                await this.fileService.uploadFileForTransaction({ file: resolvedFile, email, productId: result.productId, userId: user.userId }, queryRunner);
            } catch (error) {
                console.log("파일 업로드 오류 발생: ", error);

                throw new InternalServerErrorException("파일 업로드 오류 발생. 파일을 제대로 업로드 했는지 확인해주세요.");
            }

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async search(keyword: string): Promise<Product[]> {
        const result = this.productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.files", "productFiles")
            .leftJoinAndSelect("product.productCategory", "productCategory")
            .leftJoinAndSelect("product.productTags", "productTag")
            .where("product.productName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("productTag.tagName LIKE :keyword", { keyword: `%${keyword}%` })
            .getMany();

        return result;
    }

    async findOne(productId): Promise<Product> {
        const result = await this.productRepository.findOne({
            where: { productId },
            relations: ["productCategory", "user", "productTags", "files"],
        });

        return result;
    }

    async findAll(findProductsInput: FindProductsInput): Promise<Product[]> {
        const { userId, categoryName, page } = findProductsInput;
        const take = 10;
        const skip = (page - 1) * take;

        const where = {};
        if (userId) {
            where["user"] = { userId };
        }
        if (categoryName) {
            where["productCategory"] = { categoryName };
        }

        const result = await this.productRepository.find({
            where,
            relations: ["productCategory", "user", "productTags", "files"],
            take,
            skip,
        });

        return result;
    }

    async count(countProductsInput: CountProductsInput) {
        const { userId, categoryName } = countProductsInput;

        const where = {};

        if (userId) {
            where["user"] = { userId };
        }

        if (categoryName) {
            where["productCategory"] = { categoryName };
        }

        const result = await this.productRepository.count({
            where,
            relations: ["productCategory"],
        });

        return result;
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

        const { categoryName, productTags, file, ...product } = updateProductInput;

        try {
            const foundProduct = await this.productRepository.findOne({
                where: { productId },
                relations: ["productCategory", "productTags", "user"],
            });

            if (foundProduct == undefined) throw new NotFoundException("등록된 상품이 아닙니다.");

            let productCategory = {};
            if (categoryName != undefined) {
                productCategory = await this.productCategoryService.findOne(categoryName);

                if (!productCategory) {
                    productCategory = await this.productCategoryService.create(
                        {
                            categoryName,
                        },
                        queryRunner
                    );
                }
            }

            let tags = [];

            if (productTags !== undefined && productTags !== null) {
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
                productCategory,
                productTags: tags,
            });

            try {
                const resolvedFile = await file;
                await this.fileService.updateFileForTransaction(
                    { file: resolvedFile, email: foundProduct.user.email, productId: result.productId, userId: foundProduct.user.userId },
                    queryRunner
                );
            } catch (error) {
                if (error.name !== "BadRequestError") {
                    console.error("파일 업로드 에러 내용:", error);
                    throw new InternalServerErrorException("파일 업로드 오류 발생. 파일을 확인해주세요.");
                }
            }

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
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
