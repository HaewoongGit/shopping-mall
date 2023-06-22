import { Field, InputType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class UploadFileInput {
    @Field(() => GraphQLUpload)
    file: FileUpload;

    @Field(() => String)
    email: string;

    @Field(() => String)
    productId: string;

    @Field(() => String)
    userId: string;
}
