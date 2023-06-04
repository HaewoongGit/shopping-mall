import { InputType, PartialType } from '@nestjs/graphql';
import { FindOneCartInput } from './findOneCart.input';

@InputType()
export class FindCartInput extends PartialType(FindOneCartInput) {}
