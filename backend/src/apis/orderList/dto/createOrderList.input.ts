import { Field, InputType, Int } from "@nestjs/graphql";
import { IsPositive } from "class-validator";

@InputType()
export class CreateOrderListInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    merchantUid: string;

    @Field(() => Int)
    @IsPositive()
    orderQuantity: number;

    @Field(() => Int)
    @IsPositive()
    price: number;

    @Field(() => String)
    deliveryAddress: string;

    @Field(() => String)
    contactNumber: string;
}
