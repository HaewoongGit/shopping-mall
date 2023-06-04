import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCartInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;
}
