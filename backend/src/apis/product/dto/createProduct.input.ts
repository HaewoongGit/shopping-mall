import { Field, InputType, Int } from "@nestjs/graphql";
import { CategoryName } from "src/apis/productCategory/entities/productCategory.entity";

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
    categoryName: CategoryName;

    @Field(() => [String], { nullable: true })
    productTags?: string[];
}
