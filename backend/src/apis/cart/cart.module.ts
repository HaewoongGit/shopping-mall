import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartResolver } from "./cart.resolver";
import { CartService } from "./cart.service";
import { Cart } from "./entities/cart.entity";
import { Product } from "../product/entities/product.entity";
import { ProductTag } from "../productTag/entities/productTag.entity";
import { UserModule } from "../user/user.module";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Cart, Product, ProductTag, User]), UserModule],
    providers: [CartResolver, CartService],
    exports: [CartService],
})
export class CartModule {}
