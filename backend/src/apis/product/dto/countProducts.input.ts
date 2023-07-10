import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CountProductsInput {
    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    categoryName?: string;

    @Field(() => String, { nullable: true })
    keyword?: string;
}
