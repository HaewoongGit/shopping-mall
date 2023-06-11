import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment, POINT_TRANSACTION_STATUS_ENUM } from "./entities/payment.entity";
import { IPaymentTransactionsServiceCreate } from "./interfaces/payment-transactions-service.interface";
import { User } from "../user/entities/user.entity";

@Injectable()
export class PaymentTransactionsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentTransactionsRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async create({ impUid, amount, deliveryAddress, contactNumber, orderInformation, user: _user }: IPaymentTransactionsServiceCreate): Promise<Payment> {
        const payment = this.paymentTransactionsRepository.create({
            impUid,
            amount,
            deliveryAddress,
            contactNumber,
            orderInformation,
            user: _user,
            status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
        });
        await this.paymentTransactionsRepository.save(payment);

        const user = await this.usersRepository.findOne({
            where: { userId: _user.userId },
        });

        return payment;
    }
}
