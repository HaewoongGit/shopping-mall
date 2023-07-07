import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Min } from "class-validator";

@InputType()
export class PurchaseItem {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    productName: string;

    @Field(() => Int)
    @Min(1, { message: "개수는 1 이상이어야 합니다." })
    quantity: number;

    @Field(() => Int)
    @Min(1, { message: "가격은 1 이상이어야 합니다." })
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
    @Min(1, { message: "가격은 1 이상이어야 합니다." })
    amount: number;

    @Field(() => String)
    deliveryAddress: string;

    @Field(() => String)
    contactNumber: string;

    @Field(() => String)
    orderInformation: string;
}
