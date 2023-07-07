import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { Cart } from "./entities/cart.entity";
import { FindCartInput } from "./dto/findCart.input";
import { CreateCartInput } from "./dto/createCart.input";
import { DeleteCartInput } from "./dto/deleteCart.input";
import { FindOneCartInput } from "./dto/findOneCart.input";
import { UpdateCartInput } from "./dto/updateCart.input";
import { IContext } from "src/commons/interfaces/context";
import { ProductService } from "../product/product.service";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        private readonly productService: ProductService
    ) {}

    async findOne(findOneCartInput: FindOneCartInput): Promise<Cart> {
        const { productId, userId } = findOneCartInput;

        return await this.cartRepository
            .createQueryBuilder("cart")
            .leftJoinAndSelect("cart.product", "cartProduct")
            .leftJoinAndSelect("cartProduct.files", "productFiles")
            .leftJoinAndSelect("cart.user", "cartUser")
            .where("cartProduct.productId = :productId", { productId })
            .andWhere("cartUser.userId = :userId", { userId })
            .getOne();
    }

    async find(context: IContext, productId?: string): Promise<Cart[]> {
        let result = [];
        if (productId && context.req.user.userId) {
            result = await this.cartRepository
                .createQueryBuilder("cart")
                .leftJoinAndSelect("cart.product", "cartProduct")
                .leftJoinAndSelect("cartProduct.files", "productFiles")
                .leftJoinAndSelect("cart.user", "cartUser")
                .where("cartProduct.productId = :productId", { productId })
                .andWhere("cartUser.userId = :userId", { userId: context.req.user.userId })
                .getMany();
        } else if (productId && !context.req.user.userId) {
            result = await this.cartRepository
                .createQueryBuilder("cart")
                .leftJoinAndSelect("cart.product", "cartProduct")
                .leftJoinAndSelect("cartProduct.files", "productFiles")
                .leftJoinAndSelect("cart.user", "cartUser")
                .where("cartProduct.productId = :productId", { productId })
                .getMany();
        } else if (context.req.user.userId && !productId) {
            result = await this.cartRepository
                .createQueryBuilder("cart")
                .leftJoinAndSelect("cart.product", "cartProduct")
                .leftJoinAndSelect("cartProduct.files", "productFiles")
                .leftJoinAndSelect("cart.user", "cartUser")
                .where("cartUser.userId = :userId", { userId: context.req.user.userId })
                .getMany();
        } else {
            result = await this.cartRepository.find({
                relations: ["product", "product.files", "user"],
            });
        }
        return result;
    }

    async create(createCartInput: CreateCartInput, context: IContext): Promise<Cart> {
        const { productId, quantity } = createCartInput;
        await this.cartRepository.save({
            product: { productId },
            user: { userId: context.req.user.userId },
            quantity,
            deletedAt: null,
        });

        const result = await this.findOne({ productId, userId: context.req.user.userId });

        return result;
    }

    async update(updateCartInput: UpdateCartInput, context: IContext): Promise<Cart> {
        const { productId, quantity } = updateCartInput;

        const productCheck = await this.productService.findOne(productId);

        if (!productCheck) throw new NotFoundException("해당 제품을 찾을 수 없습니다.");

        const result = await this.cartRepository.save({
            product: {
                productId,
            },
            user: {
                userId: context.req.user.userId,
            },
            quantity,
        });

        return result;
    }

    async delete(productId: string, context: IContext): Promise<boolean> {
        const result = await this.cartRepository.delete({
            product: { productId },
            user: { userId: context.req.user.userId },
        });

        return result.affected ? true : false;
    }

    async deleteForTransaction(userId: string, queryRunner: QueryRunner): Promise<boolean> {
        const result = await queryRunner.manager.getRepository(Cart).delete({
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
