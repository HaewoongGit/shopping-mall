import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/createCart.input';
import { DeleteCartInput } from './dto/deleteCart.input';
import { FindCartInput } from './dto/findCart.input';
import { UpdateCartInput } from './dto/updateCart.input';
import { FindOneCartInput } from './dto/findOneCart.input';

@Resolver()
export class CartResolver {
    constructor(private readonly cartService: CartService) {}

    @Query(() => Cart)
    fetchCart(
        @Args('findOneCartInput') findOneCartInput: FindOneCartInput,
    ): Promise<Cart> {
        return this.cartService.findOne(findOneCartInput);
    }

    @Query(() => [Cart])
    fetchCarts(
        @Args('findCartInput') findCartInput: FindCartInput,
    ): Promise<Cart[]> {
        return this.cartService.find(findCartInput);
    }

    @Mutation(() => Cart)
    createCart(
        @Args('createCartInput') createCartInput: CreateCartInput,
    ): Promise<Cart> {
        return this.cartService.create(createCartInput);
    }

    @Mutation(() => Cart)
    updateCart(
        @Args('updateCartInput') updateCartInput: UpdateCartInput,
    ): Promise<Cart> {
        return this.cartService.update(updateCartInput);
    }

    @Mutation(() => Boolean)
    deleteCart(
        @Args('deleteCartInput') deleteCartInput: DeleteCartInput,
    ): Promise<boolean> {
        return this.cartService.delete(deleteCartInput);
    }
}
