import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { FindReviewInput } from './dto/findReview.input';
import { ReviewService } from './review.service';
import { CreateReviewInput } from './dto/createReview.input';
import { DeleteReviewInput } from './dto/deleteReview.input';
import { FindOneReviewInput } from './dto/findOneReview.input';
import { UpdateReviewInput } from './dto/updateReview.input';

@Resolver()
export class ReviewResolver {
    constructor(private readonly reviewService: ReviewService) {}

    @Query(() => Review)
    fetchReview(
        @Args('findOneReviewInput')
        findOneReviewInput: FindOneReviewInput,
    ): Promise<Review> {
        return this.reviewService.findOne({ findOneReviewInput });
    }

    @Query(() => [Review])
    fetchReviews(
        @Args('findReviewInput')
        findReviewInput: FindReviewInput,
    ): Promise<Review[]> {
        return this.reviewService.find({ findReviewInput });
    }

    @Mutation(() => Review)
    createReview(
        @Args('createReviewInput')
        createReviewInput: CreateReviewInput,
    ): Promise<Review> {
        return this.reviewService.create({ createReviewInput });
    }

    @Mutation(() => Review)
    updateReview(
        @Args('updateReviewInput')
        updateReviewInput: UpdateReviewInput,
    ): Promise<Review> {
        return this.reviewService.update({ updateReviewInput });
    }

    @Mutation(() => Boolean)
    deleteReview(
        @Args('deleteReviewInput')
        deleteReviewInput: DeleteReviewInput,
    ): Promise<boolean> {
        return this.reviewService.delete({ deleteReviewInput });
    }
}
