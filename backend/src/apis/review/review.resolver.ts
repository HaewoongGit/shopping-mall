import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Review } from "./entities/review.entity";
import { ReviewService } from "./review.service";
import { CreateReviewInput } from "./dto/createReview.input";
import { DeleteReviewInput } from "./dto/deleteReview.input";
import { FindOneReviewInput } from "./dto/findOneReview.input";
import { UpdateReviewInput } from "./dto/updateReview.input";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { IContext } from "src/commons/interfaces/context";
import { FindReviewsInput } from "./dto/findReviews.input";

@Resolver()
export class ReviewResolver {
    constructor(private readonly reviewService: ReviewService) {}

    @Query(() => Review, { nullable: true })
    fetchReview(
        @Args("findOneReviewInput")
        findOneReviewInput: FindOneReviewInput
    ): Promise<Review | null> {
        return this.reviewService.findOne(findOneReviewInput);
    }

    @Query(() => [Review])
    fetchReviews(
        @Args("findReviewsInput")
        findReviewsInput: FindReviewsInput
    ): Promise<Review[]> {
        return this.reviewService.find(findReviewsInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Review)
    createReview(
        @Args("createReviewInput")
        createReviewInput: CreateReviewInput,
        @Context()
        context: IContext
    ): Promise<Review> {
        return this.reviewService.create(createReviewInput, context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Review)
    updateReview(
        @Args("updateReviewInput")
        updateReviewInput: UpdateReviewInput,
        @Context()
        context: IContext
    ): Promise<Review> {
        return this.reviewService.update(updateReviewInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Boolean)
    deleteReview(
        @Args("deleteReviewInput")
        deleteReviewInput: DeleteReviewInput,
        @Context()
        context: IContext
    ): Promise<boolean> {
        return this.reviewService.delete(deleteReviewInput, context.req.user.userId);
    }
}
