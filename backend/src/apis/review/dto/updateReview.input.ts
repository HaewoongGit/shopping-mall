import { Field, InputType, Int, OmitType } from "@nestjs/graphql";
import { CreateReviewInput } from "./createReview.input";
import { IsIn } from "class-validator";

// @InputType()
// export class UpdateReviewInput extends OmitType(
//     CreateReviewInput,
//     [],
//     InputType,
// ) {}

@InputType()
export class UpdateReviewInput {
    @Field(() => String)
    reviewId: string;

    @Field(() => String)
    reviewContent: string;

    @Field(() => Int)
    @IsIn([1, 2, 3, 4, 5], { message: "1에서 5 사이의 정수만 입력 가능합니다." })
    rating: number;
}
