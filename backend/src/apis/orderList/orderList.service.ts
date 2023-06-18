import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { IContext } from "src/commons/interfaces/context";
import { OrderList } from "./entities/orderList.entity";
import { IOrderListCreate } from "./interfaces/orderList-service.interface";

@Injectable()
export class OrderListService {
    constructor(
        @InjectRepository(OrderList)
        private readonly orderListRepository: Repository<OrderList>
    ) {}

    async find(context: IContext): Promise<OrderList[]> {
        const orderList = await this.orderListRepository.find({
            withDeleted: true,
            where: { user: { userId: context.req.user.userId } },
            relations: ["product", "user", "payment"],
        });

        if (!orderList) throw new NotFoundException("구매 내역을 찾을 수 없습니다.");

        return orderList;
    }

    async createForTransaction({ createOrderListInput, user }: IOrderListCreate, queryRunner: QueryRunner): Promise<OrderList> {
        const { productId, merchantUid, orderQuantity, deliveryAddress, contactNumber, price } = createOrderListInput;

        const orderList = this.orderListRepository.create({
            product: { productId },
            user,
            payment: { merchantUid },
            orderQuantity,
            deliveryAddress,
            contactNumber,
            price,
        });

        await queryRunner.manager.getRepository(OrderList).save(orderList);

        return orderList;
    }

    async deleteForTransaction(merchantUid: string, queryRunner: QueryRunner): Promise<boolean> {
        const result = await queryRunner.manager.getRepository(OrderList).softDelete({
            payment: { merchantUid },
        });

        return result.affected ? true : false;
    }
}
