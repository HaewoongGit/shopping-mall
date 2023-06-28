import { Field, InputType, OmitType, PartialType } from "@nestjs/graphql";
import { CreateProductInput } from "./createProduct.input";

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
    @Field(() => Boolean, { nullable: true })
    isSoldOut?: boolean;

    @Field(() => [String], { nullable: true })
    productTags?: string[];
}
