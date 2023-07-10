import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FindProductsInput {
    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    categoryName?: string;

    @Field(() => String, { nullable: true })
    keyword?: string;

    @Field(() => Int)
    page: number;
}
