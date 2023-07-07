import { Field, InputType, OmitType } from "@nestjs/graphql";

@InputType()
export class UpdateDibsInput {
    @Field(() => String)
    productId: string;

    @Field(() => Boolean)
    isDibs: boolean;
}
