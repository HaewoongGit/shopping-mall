import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import {
    IReviewServiceCreate,
    IReviewServiceDelete,
    IReviewServiceFind,
    IReviewServiceFindOne,
    IReviewServiceUpdate,
} from "./interface/review-service.interface";
import { UpdateReviewInput } from "./dto/updateReview.input";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {}

    async findOne({ findOneReviewInput }: IReviewServiceFindOne): Promise<Review> {
        const { productId, userId } = findOneReviewInput;
        return await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.product", "reviewProduct")
            .leftJoinAndSelect("review.user", "reviewUser")
            .where("reviewProduct.productId = :productId", { productId })
            .andWhere("reviewuser.userId = :userId", { userId })
            .getOne();
    }

    async find({ findReviewInput }: IReviewServiceFind): Promise<Review[]> {
        const { productId, userId } = findReviewInput;
        let result = [];

        if (productId && userId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewProduct.productId = :productId", { productId })
                .andWhere("reviewuser.userId = :userId", { userId })
                .getMany();
        } else if (productId && !userId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewProduct.productId = :productId", { productId })
                .getMany();
        } else if (userId && !productId) {
            result = await this.reviewRepository
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.product", "reviewProduct")
                .leftJoinAndSelect("review.user", "reviewUser")
                .where("reviewUser.userId = :userId", { userId })
                .getMany();
        } else {
            result = await this.reviewRepository.find({
                relations: ["product", "user"],
            });
        }
        return result;
    }

    async create({ createReviewInput }: IReviewServiceCreate): Promise<Review> {
        const { productId, userId, reviewContent, grade } = createReviewInput;
        await this.reviewRepository.save({
            product: { productId },
            user: { userId },
            reviewContent,
            grade,
        });

        const result = await this.findOne({
            findOneReviewInput: {
                productId,
                userId,
            },
        });

        return result;
    }

    async update({ updateReviewInput }: IReviewServiceUpdate): Promise<Review> {
        const { productId, userId, reviewContent, grade } = updateReviewInput;
        const findData = await this.findOne({
            findOneReviewInput: {
                productId,
                userId,
            },
        });

        if (!findData) throw new NotFoundException("해당하는 리뷰를 찾을 수 없습니다.");

        const result = await this.reviewRepository.save({
            product: { productId },
            user: { userId },
            reviewContent,
            grade,
        });

        return result;
    }

    async delete({ deleteReviewInput }: IReviewServiceDelete): Promise<boolean> {
        const { productId, userId } = deleteReviewInput;
        const result = await this.reviewRepository.softDelete({
            product: { productId },
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
