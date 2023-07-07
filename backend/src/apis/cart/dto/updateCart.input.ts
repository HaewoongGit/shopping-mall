import { Field, InputType, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

@InputType()
export class UpdateCartInput {
    @Field(() => String)
    productId: string;

    @Field(() => Int)
    @Min(1, { message: "개수는 1 이상이어야 합니다." })
    quantity: number;
}
