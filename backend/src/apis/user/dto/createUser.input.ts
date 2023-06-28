import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    phoneNumber: string;

    @Field(() => String)
    userName: string;

    @Field(() => Int)
    age: number;
}
