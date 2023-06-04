import { Field, InputType, Int, OmitType } from '@nestjs/graphql';
import { CreateReviewInput } from './createReview.input';

// @InputType()
// export class UpdateReviewInput extends OmitType(
//     CreateReviewInput,
//     [],
//     InputType,
// ) {}

@InputType()
export class UpdateReviewInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    reviewContent: string;

    @Field(() => Int)
    grade: number;
}
