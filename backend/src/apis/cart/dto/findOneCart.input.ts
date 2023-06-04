import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneCartInput {
    @Field()
    productId: string;

    @Field()
    userId: string;
}
