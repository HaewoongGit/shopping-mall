import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { FindCartInput } from './dto/findCart.input';
import { CreateCartInput } from './dto/createCart.input';
import { DeleteCartInput } from './dto/deleteCart.input';
import { FindOneCartInput } from './dto/findOneCart.input';
import { UpdateCartInput } from './dto/updateCart.input';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) {}

    async findOne(findOneCartInput: FindOneCartInput): Promise<Cart> {
        const { productId, userId } = findOneCartInput;

        return await this.cartRepository
            .createQueryBuilder('cart')
            .leftJoinAndSelect('cart.product', 'cartProduct')
            .leftJoinAndSelect('cart.user', 'cartUser')
            .where('cartProduct.productId = :productId', { productId })
            .andWhere('cartUser.userId = :userId', { userId })
            .getOne();
    }

    async find(findCartInput: FindCartInput): Promise<Cart[]> {
        const { productId, userId } = findCartInput;
        let result = [];
        if (productId && userId) {
            result = await this.cartRepository
                .createQueryBuilder('cart')
                .leftJoinAndSelect('cart.product', 'cartProduct')
                .leftJoinAndSelect('cart.user', 'cartUser')
                .where('cartProduct.productId = :productId', { productId })
                .andWhere('cartUser.userId = :userId', { userId })
                .getMany();
        } else if (productId && !userId) {
            result = await this.cartRepository
                .createQueryBuilder('cart')
                .leftJoinAndSelect('cart.product', 'cartProduct')
                .leftJoinAndSelect('cart.user', 'cartUser')
                .where('cartProduct.productId = :productId', { productId })
                .getMany();
        } else if (userId && !productId) {
            result = await this.cartRepository
                .createQueryBuilder('cart')
                .leftJoinAndSelect('cart.product', 'cartProduct')
                .leftJoinAndSelect('cart.user', 'cartUser')
                .where('cartUser.userId = :userId', { userId })
                .getMany();
        } else {
            result = await this.cartRepository.find({
                relations: ['product', 'user'],
            });
        }
        return result;
    }

    async create(createCartInput: CreateCartInput): Promise<Cart> {
        const { productId, userId, quantity } = createCartInput;
        await this.cartRepository.save({
            product: { productId },
            user: { userId },
            quantity,
        });

        const result = await this.findOne({ productId, userId });

        return result;
    }

    async update(updateCartInput: UpdateCartInput): Promise<Cart> {
        const { productId, userId, quantity } = updateCartInput;

        const result = await this.cartRepository.save({
            product: {
                productId,
            },
            user: {
                userId,
            },
            quantity,
        });

        // const result = await this.findOne({
        //     productId,
        //     userId,
        // });

        console.log('리저트: ', result);

        return result;
    }

    async delete(deleteCartInput: DeleteCartInput): Promise<boolean> {
        const { productId, userId } = deleteCartInput;
        const result = await this.cartRepository.softDelete({
            product: { productId },
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
