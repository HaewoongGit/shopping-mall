import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDibsInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;
}
