import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { UpdateProductInput } from "./dto/updateProduct.input";
import { Product } from "./entities/product.entity";
import { CreateProductInput } from "./dto/createProduct.input";
import { FindProductsInput } from "./dto/findProducts.input";

@Resolver()
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    @Mutation(() => Product)
    createProduct(
        @Args("createProductInput")
        createProductInput: CreateProductInput
    ): Promise<Product> {
        return this.productService.create(createProductInput);
    }

    @Query(() => Product)
    fetchProduct(@Args("productId") productId: string): Promise<Product> {
        return this.productService.findOne(productId);
    }

    @Query(() => [Product])
    fetchProducts(@Args("findProductsInput") findProductsInput: FindProductsInput): Promise<Product[]> {
        return this.productService.findAll(findProductsInput);
    }

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
