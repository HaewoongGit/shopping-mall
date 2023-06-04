import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDibsInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;
}
