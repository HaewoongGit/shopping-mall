import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Resolver } from "@nestjs/graphql";
import { IContext } from "src/commons/interfaces/context";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Payment } from "./entities/payment.entity";
import { PaymentTransactionsService } from "./payment.service";

@Resolver()
export class PaymentTransactionsResolver {
    constructor(private readonly paymentTransactionsService: PaymentTransactionsService) {}

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Payment)
    createPayment(
        @Args("impUid") impUid: string,
        @Args({ name: "amount", type: () => Int }) amount: number,
        @Args("deliveryAddress") deliveryAddress: string,
        @Args("contactNumber")
        contactNumber: string,
        @Args("orderInformation") orderInformation: string,
        @Context() context: IContext
    ): Promise<Payment> {
        return this.paymentTransactionsService.create({ impUid, amount, deliveryAddress, contactNumber, orderInformation, user: context.req.user });
    }
}
