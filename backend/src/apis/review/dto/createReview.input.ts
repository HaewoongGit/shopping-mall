import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    reviewContent: string;

    @Field(() => Int)
    grade: number;
}
