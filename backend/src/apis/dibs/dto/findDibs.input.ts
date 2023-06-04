import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDibsInput } from './createDibs.input';

@InputType()
export class FindDibsInput extends PartialType(CreateDibsInput) {}
