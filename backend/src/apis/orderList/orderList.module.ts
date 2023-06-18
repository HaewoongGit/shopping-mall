// payments.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderList } from "./entities/orderList.entity";
import { OrderListResolver } from "./orderList.resolver";
import { OrderListService } from "./orderList.service";

@Module({
    imports: [TypeOrmModule.forFeature([OrderList])],
    providers: [OrderListResolver, OrderListService],
    exports: [OrderListService],
})
export class OrderListModule {}
