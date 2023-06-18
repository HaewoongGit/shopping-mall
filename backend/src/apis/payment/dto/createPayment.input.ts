import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsPositive } from "class-validator";

@InputType()
export class PurchaseItem {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    productName: string;

    @Field(() => Int)
    @IsPositive()
    quantity: number;

    @Field(() => Int)
    @IsPositive()
    price: number;

    @Field(() => Boolean, { nullable: true })
    isCart: boolean;
}

@InputType()
export class CreatePaymentInput {
    @Field(() => [PurchaseItem])
    waitingListForPurchase: PurchaseItem[];

    @Field(() => String)
    impUid: string;

    @Field(() => String)
    merchantUid: string;

    @Field(() => Int)
    @IsPositive()
    amount: number;

    @Field(() => String)
    deliveryAddress: string;

    @Field(() => String)
    contactNumber: string;

    @Field(() => String)
    orderInformation: string;
}
