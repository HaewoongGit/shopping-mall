import { InputType, OmitType } from '@nestjs/graphql';
import { CreateReviewInput } from './createReview.input';

@InputType()
export class DeleteReviewInput extends OmitType(
    CreateReviewInput,
    ['reviewContent', 'grade'],
    InputType,
) {}
