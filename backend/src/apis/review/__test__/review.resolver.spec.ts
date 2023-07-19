import { Test, TestingModule } from "@nestjs/testing";
import { ReviewResolver } from "../review.resolver";
import { ReviewService } from "../review.service";
import { Review } from "../entities/review.entity";
import { response as mockResponse } from "jest-mock-express";

describe("ReviewResolver", () => {
    let resolver: ReviewResolver;
    let service: ReviewService;

    const res = mockResponse();
    res.req = {
        user: {
            email: "testEmail@example.com",
            userId: "testUserId",
        },
        headers: {
            "x-custom-header": "custom value",
        },
    };

    const context = {
        req: res.req,
        res,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewResolver,
                {
                    provide: ReviewService,
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<ReviewResolver>(ReviewResolver);
        service = module.get<ReviewService>(ReviewService);
    });

    describe("fetchReview", () => {
        it("", async () => {
            const result = new Review();
            jest.spyOn(service, "findOne").mockResolvedValue(result);

            expect(await resolver.fetchReview({ productId: "1", userId: "1" })).toBe(result);
        });
    });

    describe("fetchReviews", () => {
        it("", async () => {
            const result = [new Review(), new Review()];
            jest.spyOn(service, "find").mockResolvedValue(result);

            expect(await resolver.fetchReviews({})).toBe(result);
        });
    });

    describe("createReview", () => {
        it("", async () => {
            const result = new Review();
            jest.spyOn(service, "create").mockResolvedValue(result);

            expect(await resolver.createReview({ productId: "1", reviewContent: "content", rating: 5 }, context)).toBe(result);
        });
    });

    describe("updateReview", () => {
        it("", async () => {
            const result = new Review();
            jest.spyOn(service, "update").mockResolvedValue(result);

            expect(await resolver.updateReview({ reviewId: "1", reviewContent: "content", rating: 5 }, context)).toBe(result);
        });
    });

    describe("deleteReview", () => {
        it("", async () => {
            jest.spyOn(service, "delete").mockResolvedValue(true);

            expect(await resolver.deleteReview({ productId: "1" }, context)).toBe(true);
        });
    });
});
