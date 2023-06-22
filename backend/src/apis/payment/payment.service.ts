import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Payment, POINT_TRANSACTION_STATUS_ENUM } from "./entities/payment.entity";
import { IPaymentServiceCreate } from "./interfaces/payment-transactions-service.interface";
import { CartService } from "../cart/cart.service";
import { IContext } from "src/commons/interfaces/context";
import { OrderListService } from "../orderList/orderList.service";
import { ProductService } from "../product/product.service";

const Iamport = require("iamport");

const iamport = new Iamport({
    impKey: "8262212864876018",
    impSecret: "cUTQDxXF5i5z70FJZ9j2cwhPyFzy0SkEmpU4K4uvGM4jqmaYcKS8cXG2MZyxydX4tGYgCLhSl0B28MpP",
});

async function verifyPayment(impUid, expectedAmount) {
    const paymentData = await iamport.payment.getByImpUid({ imp_uid: impUid });

    if (paymentData.status !== "paid") {
        throw new NotFoundException("결제되지 않은 거래입니다.");
    }

    if (paymentData.amount !== expectedAmount) {
        throw new NotFoundException("결제 금액이 일치하지 않습니다.");
    }

    return paymentData;
}

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        private readonly cartservice: CartService,

        private readonly orderListService: OrderListService,

        private readonly productService: ProductService,

        private readonly dataSource: DataSource
    ) {}

    async find(context: IContext): Promise<Payment[]> {
        const payments = await this.paymentRepository.find({
            where: { user: { userId: context.req.user.userId } },
            relations: ["user"],
        });

        if (!payments) throw new NotFoundException("구매 내역을 찾을 수 없습니다.");

        return payments;
    }

    async create({ createPaymentInput, user }: IPaymentServiceCreate): Promise<Payment> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction("READ COMMITTED");

        const { waitingListForPurchase, impUid, merchantUid, amount, deliveryAddress, contactNumber, orderInformation } = createPaymentInput;

        try {
            const payment = this.paymentRepository.create({
                impUid,
                merchantUid,
                amount,
                deliveryAddress,
                contactNumber,
                orderInformation,
                user,
                status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
            });

            const createdPayment = await queryRunner.manager.save(Payment, payment);
            if (!createdPayment) throw new InternalServerErrorException("오류가 발생했습니다.");

            if (waitingListForPurchase[0].isCart !== false) {
                const cart = await this.cartservice.deleteForTransaction(user.userId, queryRunner);

                if (!cart) throw new NotFoundException("해당 유저의 장바구니 목록을 찾을 수 없습니다.");
            }

            let totalPrice: number = 0;

            for (const productList of waitingListForPurchase) {
                const product = await this.productService.findOne(productList.productId);

                if (!product) throw new NotFoundException(`${productList.productId}에 해당하는 상품을 찾을 수 없습니다.`);

                const orderList = await this.orderListService.createForTransaction(
                    {
                        createOrderListInput: {
                            productId: productList.productId,
                            impUid: createdPayment.impUid,
                            orderQuantity: productList.quantity,
                            price: productList.price,
                            deliveryAddress,
                            contactNumber,
                        },
                        user,
                    },
                    queryRunner
                );

                if (!orderList) throw new InternalServerErrorException("주문목록 생성 실패");

                totalPrice += product.price * productList.quantity;
            }

            await verifyPayment(impUid, totalPrice);

            await queryRunner.commitTransaction();

            return payment;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof NotFoundException || error instanceof InternalServerErrorException) throw error;

            iamport.payment.cancel({
                imp_uid: impUid,
                reason: "결제 검증 실패",
            });
        } finally {
            await queryRunner.release();
        }
    }

    async delete(impUid: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction("READ COMMITTED");

        try {
            const deleteOrderListResult = await this.orderListService.deleteForTransaction(impUid, queryRunner);

            if (!deleteOrderListResult) throw new InternalServerErrorException("주문목록 삭제 실패.");

            const result = await queryRunner.manager.softDelete(Payment, { impUid });

            await queryRunner.commitTransaction();

            iamport.payment.cancel({
                imp_uid: impUid,
            });

            return (await result).affected;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof InternalServerErrorException) throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
