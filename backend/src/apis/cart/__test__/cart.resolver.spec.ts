import { Test, TestingModule } from "@nestjs/testing";
import { CartResolver } from "../cart.resolver";
import { CartService } from "../cart.service";
import { response as mockResponse } from "jest-mock-express";

describe("CartResolver", () => {
    let resolver: CartResolver;
    let service: CartService;

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
                CartResolver,
                {
                    provide: CartService,
                    useValue: {
                        create: jest.fn().mockResolvedValue({
                            productId: "testProductId",
                            quantity: 1,
                        }),
                        findOne: jest.fn().mockResolvedValue({
                            productId: "testProductId",
                            userId: "testUserId",
                        }),
                        find: jest.fn().mockResolvedValue([
                            {
                                productId: "testProductId",
                                productName: "상품",
                            },
                            {
                                productId: "testProductId2",
                                productName: "상품2",
                            },
                        ]),

                        update: jest.fn().mockResolvedValue({
                            productId: "testProductId",
                            productName: "상품",
                        }),

                        delete: jest.fn().mockResolvedValue(true),
                    },
                },
            ],
        }).compile();

        resolver = module.get<CartResolver>(CartResolver);
        service = module.get<CartService>(CartService);
    });

    const productId = "testProductId";

    it("createCart", async () => {
        const createCartInput = {
            productId: "testProductId",
            quantity: 1,
        };

        expect(await resolver.createCart(createCartInput, context)).toEqual({
            productId: "testProductId",
            quantity: 1,
        });

        expect(context.req.headers["x-custom-header"]).toEqual("custom value");
        expect(service.create).toHaveBeenCalledWith(createCartInput, context.req.user.userId);
    });

    it("fetchCart", async () => {
        const findOneCartInput = {
            productId: "testProductId",
            userId: "testUserId",
        };

        expect(await resolver.fetchCart(findOneCartInput)).toEqual({
            productId: "testProductId",
            userId: "testUserId",
        });

        expect(service.findOne).toHaveBeenCalledWith(findOneCartInput);
    });

    it("fetchCarts", async () => {
        expect(await resolver.fetchCarts(context, productId)).toEqual([
            {
                productId: "testProductId",
                productName: "상품",
            },
            {
                productId: "testProductId2",
                productName: "상품2",
            },
        ]);

        expect(context.req.headers["x-custom-header"]).toEqual("custom value");
        expect(service.find).toHaveBeenCalledWith(context.req.user.userId, productId);
    });

    it("updateCart", async () => {
        const updateCartInput = {
            productId: "testProductId",
            quantity: 1,
        };

        expect(await resolver.updateCart(updateCartInput, context)).toEqual({
            productId: "testProductId",
            productName: "상품",
        });

        expect(context.req.headers["x-custom-header"]).toEqual("custom value");
        expect(service.update).toHaveBeenCalledWith(updateCartInput, context.req.user.userId);
    });

    it("deleteCart", async () => {
        expect(await resolver.deleteCart(productId, context)).toEqual(true);
        expect(context.req.headers["x-custom-header"]).toEqual("custom value");
        expect(service.delete).toHaveBeenCalledWith(productId, context.req.user.userId);
    });
});
