// payments.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { User } from "../user/entities/user.entity";
import { PaymentTransactionsResolver } from "./payment.resolver";
import { PaymentTransactionsService } from "./payment.service";

@Module({
    imports: [TypeOrmModule.forFeature([Payment, User])],
    providers: [PaymentTransactionsResolver, PaymentTransactionsService],
})
export class PaymentModule {}
