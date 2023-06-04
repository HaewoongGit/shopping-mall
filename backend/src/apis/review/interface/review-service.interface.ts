import { CreateReviewInput } from '../dto/createReview.input';
import { DeleteReviewInput } from '../dto/deleteReview.input';
import { FindOneReviewInput } from '../dto/findOneReview.input';
import { FindReviewInput } from '../dto/findReview.input';
import { UpdateReviewInput } from '../dto/updateReview.input';

export interface IReviewServiceCreate {
    createReviewInput: CreateReviewInput;
}

export interface IReviewServiceDelete {
    deleteReviewInput: DeleteReviewInput;
}

export interface IReviewServiceFind {
    findReviewInput: FindReviewInput;
}

export interface IReviewServiceFindOne {
    findOneReviewInput: FindOneReviewInput;
}

export interface IReviewServiceUpdate {
    updateReviewInput: UpdateReviewInput;
}
