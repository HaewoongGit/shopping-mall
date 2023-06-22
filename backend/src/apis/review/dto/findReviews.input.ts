import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindReviewsInput {
    @Field(() => String, { nullable: true })
    productId?: string;

    @Field(() => String, { nullable: true })
    userId?: string;
}
