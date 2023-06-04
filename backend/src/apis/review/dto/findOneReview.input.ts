import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneReviewInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;
}
