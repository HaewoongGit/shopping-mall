import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { Cart } from "./entities/cart.entity";
import { CreateCartInput } from "./dto/createCart.input";
import { DeleteCartInput } from "./dto/deleteCart.input";
import { FindCartInput } from "./dto/findCart.input";
import { UpdateCartInput } from "./dto/updateCart.input";
import { FindOneCartInput } from "./dto/findOneCart.input";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { IContext } from "src/commons/interfaces/context";

@Resolver()
export class CartResolver {
    constructor(private readonly cartService: CartService) {}

    @Query(() => Cart)
    fetchCart(@Args("findOneCartInput") findOneCartInput: FindOneCartInput): Promise<Cart> {
        return this.cartService.findOne(findOneCartInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => [Cart])
    fetchCarts(@Args("productId") productId: string, @Context() context: IContext): Promise<Cart[]> {
        return this.cartService.find(productId, context);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Cart)
    createCart(@Args("createCartInput") createCartInput: CreateCartInput, @Context() context: IContext): Promise<Cart> {
        return this.cartService.create(createCartInput, context);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Cart)
    updateCart(@Args("updateCartInput") updateCartInput: UpdateCartInput, @Context() context: IContext): Promise<Cart> {
        return this.cartService.update(updateCartInput, context);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Boolean)
    deleteCart(@Args("productId") productId: string, @Context() context: IContext): Promise<boolean> {
        return this.cartService.delete(productId, context);
    }
}
