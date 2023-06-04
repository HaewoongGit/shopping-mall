import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductTagService } from './productTag.service';
import { ProductTag } from './entities/productTag.entity';

@Resolver()
export class ProductTagResolver {
    constructor(private readonly productTagService: ProductTagService) {}

    @Query(() => ProductTag)
    fetchProductTag(
        @Args('productTagId') productTagId: string,
    ): Promise<ProductTag> {
        return this.productTagService.findOne(productTagId);
    }

    @Query(() => [ProductTag])
    fetchProductTags(): Promise<ProductTag[]> {
        return this.productTagService.findAll();
    }

    @Mutation(() => ProductTag)
    updateProductTag(
        @Args('productTagId') productTagId: string,
    ): Promise<ProductTag> {
        return this.productTagService.update(productTagId);
    }

    @Mutation(() => Boolean)
    deleteProductTag(
        @Args('productTagId') productTagId: string,
    ): Promise<boolean> {
        return this.productTagService.delete(productTagId);
    }
}
