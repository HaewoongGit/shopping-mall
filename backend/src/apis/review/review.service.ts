import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { UpdateReviewInput } from "./dto/updateReview.input";
import { FindOneReviewInput } from "./dto/findOneReview.input";
import { CreateReviewInput } from "./dto/createReview.input";
import { DeleteReviewInput } from "./dto/deleteReview.input";
import { FindReviewsInput } from "./dto/findReviews.input";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {}

    async findOne(findOneReviewInput: FindOneReviewInput): Promise<Review> {
        const { productId, userId } = findOneReviewInput;
        return await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.product", "reviewProduct")
            .leftJoinAndSelect("review.user", "reviewUser")
            .where("reviewProduct.productId = :productId", { productId })
            .andWhere("reviewuser.userId = :userId", { userId })
            .getOne();
    }

    async find(findReviewsInput: FindReviewsInput): Promise<Review[]> {
        const { productId, userId } = findReviewsInput;
        let result = [];

        if (productId && userId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("reviewProduct.files", "productFiles")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewProduct.productId = :productId", { productId })
                .andWhere("reviewuser.userId = :userId", { userId })
                .getMany();
        } else if (productId && !userId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("reviewProduct.files", "productFiles")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewProduct.productId = :productId", { productId })
                .getMany();
        } else if (userId && !productId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("reviewProduct.files", "productFiles")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewUser.userId = :userId", { userId })
                .getMany();
        } else {
            result = await this.reviewRepository.find({
                relations: ["product", "user", "product.files"],
            });
        }
        return result;
    }

    async create(createReviewInput: CreateReviewInput, userId: string): Promise<Review> {
        const { productId, reviewContent, rating } = createReviewInput;
        const isData = await this.findOne({
            productId,
            userId,
        });

        if (isData) throw new ConflictException("이미 해당 상품의 리뷰가 존재합니다.");

        await this.reviewRepository.save({
            product: { productId },
            user: { userId },
            reviewContent,
            rating,
        });

        const result = await this.findOne({
            productId,
            userId,
        });

        return result;
    }

    async update(updateReviewInput: UpdateReviewInput, userId: string): Promise<Review> {
        const { productId, reviewContent, rating } = updateReviewInput;
        const findData = await this.findOne({
            productId,
            userId,
        });

        if (!findData) throw new NotFoundException("해당하는 리뷰를 찾을 수 없습니다.");

        const result = await this.reviewRepository.save({
            product: { productId },
            user: { userId },
            reviewContent,
            rating,
        });

        return result;
    }

    async delete(deleteReviewInput: DeleteReviewInput, userId: string): Promise<boolean> {
        const { productId } = deleteReviewInput;
        const result = await this.reviewRepository.softDelete({
            product: { productId },
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
