import { Field, InputType, Int } from "@nestjs/graphql";
import { IsPositive, Min } from "class-validator";

@InputType()
export class CreateOrderListInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    impUid: string;

    @Field(() => Int)
    @Min(1, { message: "개수는 1 이상이어야 합니다." })
    orderQuantity: number;

    @Field(() => Int)
    @Min(1, { message: "가격은 1 이상이어야 합니다." })
    price: number;

    @Field(() => String)
    deliveryAddress: string;

    @Field(() => String)
    contactNumber: string;
}
