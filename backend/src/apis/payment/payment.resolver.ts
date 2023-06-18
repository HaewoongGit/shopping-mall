import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IContext } from "src/commons/interfaces/context";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";
import { CreatePaymentInput } from "./dto/createPayment.input";

@Resolver()
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) {}

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => [Payment])
    fetchPayments(@Context() context: IContext): Promise<Payment[]> {
        return this.paymentService.find(context);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Payment)
    createPayment(@Args("createPaymentInput") createPaymentInput: CreatePaymentInput, @Context() context: IContext): Promise<Payment> {
        return this.paymentService.create({ createPaymentInput, user: context.req.user });
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Boolean)
    deletePayment(@Args("merchantUid") merchantUid: string) {
        return this.paymentService.delete(merchantUid);
    }
}
