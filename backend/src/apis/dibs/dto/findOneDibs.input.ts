import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneDibsInput {
    @Field()
    productId: string;

    @Field()
    userId: string;
}
