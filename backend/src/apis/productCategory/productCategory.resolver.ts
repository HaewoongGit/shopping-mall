import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CategoryName, ProductCategory } from "./entities/productCategory.entity";
import { ProductCategoryService } from "./productCategory.service";
import { DataSource } from "typeorm";

@Resolver()
export class ProductsCategoriesResolver {
    constructor(private readonly productsCategoriesService: ProductCategoryService, private readonly dataSource: DataSource) {}

    @Mutation(() => ProductCategory)
    async createProductCategory(
        @Args("categoryName") categoryName: CategoryName //
    ): Promise<ProductCategory> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await this.productsCategoriesService.create({ categoryName }, queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    @Mutation(() => ProductCategory)
    async updateProductCategory(
        @Args("productCategoryId") productCategoryId: string,
        @Args("categoryName") categoryName: CategoryName
    ): Promise<ProductCategory> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await this.productsCategoriesService.update({ productCategoryId, categoryName }, queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
