import { Field, InputType, Int } from "@nestjs/graphql";
import { CategoryName } from "src/apis/productCategory/entities/productCategory.entity";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { IsInt, Min } from "class-validator";

@InputType()
export class CreateProductInput {
    @Field()
    productName: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    @IsInt({ message: "가격은 숫자만 쓸 수 있습니다." })
    @Min(1, { message: "가격은 1 이상이어야 합니다." })
    price: number;

    @Field(() => String)
    categoryName: CategoryName;

    @Field(() => [String], { nullable: true })
    productTags?: string[];

    @Field(() => GraphQLUpload)
    file: FileUpload;
}
