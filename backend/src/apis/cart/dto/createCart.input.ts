import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateCartInput {
    @Field(() => String)
    productId: string;

    @Field(() => Int)
    quantity: number;
}
