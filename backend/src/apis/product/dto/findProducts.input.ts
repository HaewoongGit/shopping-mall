import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindProductsInput {
    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    categoryName?: string;
}
