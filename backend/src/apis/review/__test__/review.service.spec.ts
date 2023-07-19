import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ReviewService } from "../review.service";
import { Review } from "../entities/review.entity";
import { Repository } from "typeorm";

describe("ReviewService", () => {
    let service: ReviewService;
    let repo: Repository<Review>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: getRepositoryToken(Review),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
        repo = module.get<Repository<Review>>(getRepositoryToken(Review));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("", async () => {
            const review = new Review();
            const findOneReviewInput = { productId: "1", userId: "1" };

            jest.spyOn(repo, "createQueryBuilder").mockImplementation(
                () =>
                    ({
                        leftJoinAndSelect: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        andWhere: jest.fn().mockReturnThis(),
                        getOne: jest.fn().mockResolvedValue(review),
                    } as any)
            );

            expect(await service.findOne(findOneReviewInput)).toEqual(review);
        });
    });

    describe("find", () => {
        it("", async () => {
            const review = new Review();
            const findReviewsInput = { productId: "1", userId: "1" };

            jest.spyOn(repo, "createQueryBuilder").mockImplementation(
                () =>
                    ({
                        leftJoinAndSelect: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        andWhere: jest.fn().mockReturnThis(),
                        getMany: jest.fn().mockResolvedValue([review]),
                    } as any)
            );

            expect(await service.find(findReviewsInput)).toEqual([review]);
        });
    });

    describe("create", () => {
        it("", async () => {
            const review = new Review();
            const createReviewInput = { productId: "1", reviewContent: "Great!", rating: 5 };
            const userId = "1";

            jest.spyOn(service, "findOne").mockResolvedValue(null);
            jest.spyOn(repo, "save").mockResolvedValue(review);

            expect(await service.create(createReviewInput, userId)).toEqual(review);
        });
    });

    describe("update", () => {
        it("", async () => {
            const review = new Review();
            const updateReviewInput = { reviewId: "1", reviewContent: "Great!", rating: 5 };

            jest.spyOn(repo, "findOne").mockResolvedValue(review);
            jest.spyOn(repo, "save").mockResolvedValue(review);

            expect(await service.update(updateReviewInput)).toEqual(review);
        });
    });

    describe("delete", () => {
        it("", async () => {
            const deleteReviewInput = { productId: "1" };
            const userId = "1";

            jest.spyOn(repo, "softDelete").mockResolvedValue({ affected: 1 } as any);

            expect(await service.delete(deleteReviewInput, userId)).toEqual(true);
        });
    });
});
