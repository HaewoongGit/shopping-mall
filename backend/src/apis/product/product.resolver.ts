import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { UpdateProductInput } from "./dto/updateProduct.input";
import { Product } from "./entities/product.entity";
import { CreateProductInput } from "./dto/createProduct.input";
import { FindProductsInput } from "./dto/findProducts.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { IContext } from "src/commons/interfaces/context";
import { CountProductsInput } from "./dto/countProducts.input";

@Resolver()
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Product)
    createProduct(
        @Args("createProductInput")
        createProductInput: CreateProductInput,
        @Context() context: IContext
    ): Promise<Product> {
        return this.productService.create(createProductInput, context.req.user.email);
    }

    @Query(() => Product)
    fetchProduct(@Args("productId") productId: string): Promise<Product> {
        return this.productService.findOne(productId);
    }

    @Query(() => [Product])
    fetchProducts(@Args("findProductsInput") findProductsInput: FindProductsInput): Promise<Product[]> {
        return this.productService.findAll(findProductsInput);
    }

    @Query(() => Number)
    countProducts(@Args("countProductsInput") countProductsInput: CountProductsInput): Promise<number> {
        return this.productService.count(countProductsInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Product)
    updateProduct(
        @Args("productId") productId: string,
        @Args("updateProductInput")
        updateProductInput: UpdateProductInput
    ): Promise<Product> {
        return this.productService.update({
            productId,
            updateProductInput,
        });
    }

    @Mutation(() => Product)
    increaseHits(@Args("productId") productId: string): Promise<Product> {
        return this.productService.increaseHits(productId);
    }

    @Mutation(() => Boolean)
    deleteProduct(@Args("productId") productId: string): Promise<boolean> {
        return this.productService.delete(productId);
    }
}
