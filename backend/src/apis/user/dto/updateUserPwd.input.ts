import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

@InputType()
export class UpdateUserPwdInput extends OmitType(CreateUserInput, [
    'userName',
    'age',
]) {}
