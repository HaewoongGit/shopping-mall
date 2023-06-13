import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { CategoryName, ProductCategory } from "./entities/productCategory.entity";
import { IProductCategoryServiceCreate, IProductCategoryServiceUpdate } from "./interfaces/product-category-service.interface";

@Injectable()
export class ProductCategoryService {
    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>
    ) {}

    findOne(categoryName: CategoryName): Promise<ProductCategory> {
        return this.productCategoryRepository.findOne({
            where: { categoryName },
        });
    }

    async create({ categoryName }: IProductCategoryServiceCreate, queryRunner: QueryRunner): Promise<ProductCategory> {
        return await queryRunner.manager.getRepository(ProductCategory).save({ categoryName });
    }

    async update({ productCategoryId, categoryName }: IProductCategoryServiceUpdate, queryRunner: QueryRunner): Promise<ProductCategory> {
        return await queryRunner.manager.getRepository(ProductCategory).save({
            productCategoryId,
            categoryName,
        });
    }
}
