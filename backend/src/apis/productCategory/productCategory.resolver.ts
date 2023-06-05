import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CategoryName, ProductCategory } from "./entities/productCategory.entity";
import { ProductCategoryService } from "./productCategory.service";

@Resolver()
export class ProductsCategoriesResolver {
    constructor(
        private readonly productsCategoriesService: ProductCategoryService //
    ) {}

    @Mutation(() => ProductCategory)
    createProductCategory(
        @Args("categoryName") categoryName: CategoryName //
    ): Promise<ProductCategory> {
        return this.productsCategoriesService.create({ categoryName });
    }

    @Mutation(() => ProductCategory)
    updateProductCategory(@Args("productCategoryId") productCategoryId: string, @Args("categoryName") categoryName: CategoryName): Promise<ProductCategory> {
        return this.productsCategoriesService.update({
            productCategoryId,
            categoryName,
        });
    }
}
