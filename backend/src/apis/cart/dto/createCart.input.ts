import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;

    @Field(() => Int)
    quantity: number;
}
