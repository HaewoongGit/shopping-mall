// payments.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";
import { Cart } from "../cart/entities/cart.entity";
import { CartModule } from "../cart/cart.module";
import { OrderList } from "../orderList/entities/orderList.entity";
import { OrderListModule } from "../orderList/orderList.module";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Cart, OrderList]), CartModule, OrderListModule, ProductModule],
    providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
