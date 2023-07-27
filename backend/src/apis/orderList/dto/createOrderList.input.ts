import { Field, InputType, Int } from "@nestjs/graphql";
import { Matches, Min } from "class-validator";

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
    @Matches(/^010\d{8}$/, {
        message: "적절한 전화번호를 입력해 주십시오.",
    })
    contactNumber: string;
}
