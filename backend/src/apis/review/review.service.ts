import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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

    async findOne(findOneReviewInput: FindOneReviewInput): Promise<Review | null> {
        const { productId, userId } = findOneReviewInput;
        console.log(productId, userId);

        const result = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.product", "reviewProduct")
            .leftJoinAndSelect("review.user", "reviewUser")
            .where("reviewProduct.productId = :productId", { productId })
            .andWhere("reviewuser.userId = :userId", { userId })
            .getOne();

        console.log(result);

        return result;
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
            console.log("이거 실행됐음?");

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

        console.log("findReviews의 결과: ", result);

        return result;
    }

    async create(createReviewInput: CreateReviewInput, userId: string): Promise<Review> {
        console.log(createReviewInput, userId);

        const { productId, reviewContent, rating } = createReviewInput;
        const isData = await this.findOne({
            productId,
            userId,
        });

        if (isData) throw new ConflictException("이미 해당 상품의 리뷰가 존재합니다.");

        const createResult = await this.reviewRepository.save({
            product: { productId },
            user: { userId },
            reviewContent,
            rating,
        });

        if (!createResult) throw new InternalServerErrorException("리뷰 데이터 생성 실패");

        const result = await this.findOne({
            productId,
            userId,
        });

        if (!result) throw new NotFoundException("리뷰를 생성했으나 조회가 되지 않습니다.");

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
