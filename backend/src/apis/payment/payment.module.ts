// payments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, User])],
    // providers: [PointsTransactionsResolver, PointsTransactionsService],
})
export class PaymentModule {}
