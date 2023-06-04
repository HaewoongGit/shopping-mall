import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
    @Field()
    productName: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    price: number;

    @Field(() => String)
    email: string;

    @Field(() => String)
    categoryName: string;

    @Field(() => [String], { nullable: true })
    productTags?: string[];
}
