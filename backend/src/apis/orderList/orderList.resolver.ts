import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IContext } from "src/commons/interfaces/context";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { OrderListService } from "./orderList.service";
import { OrderList } from "./entities/orderList.entity";
import { CreateOrderListInput } from "./dto/createOrderList.input";

@Resolver()
export class OrderListResolver {
    constructor(private readonly orderListService: OrderListService) {}

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => [OrderList])
    fetchOrderList(@Context() context: IContext): Promise<OrderList[]> {
        return this.orderListService.find(context.req.user.userId);
    }
}
