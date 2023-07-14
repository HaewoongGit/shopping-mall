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
        headers: {},
    };

    const context = {
        req: res.req,
        res,
    };
    res.req.headers["x-custom-header"] = "custom value";

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

        expect(service.create).toHaveBeenCalledWith(
            createCartInput,
            expect.objectContaining({
                req: expect.objectContaining({
                    headers: expect.objectContaining({
                        "x-custom-header": "custom value",
                    }),
                }),
            })
        );
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

        expect(service.find).toHaveBeenCalledWith(context, productId);
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

        expect(service.update).toHaveBeenCalledWith(
            updateCartInput,
            expect.objectContaining({
                req: expect.objectContaining({
                    headers: expect.objectContaining({
                        "x-custom-header": "custom value",
                    }),
                }),
            })
        );
    });

    it("deleteCart", async () => {
        expect(await resolver.deleteCart(productId, context)).toEqual(true);

        expect(service.delete).toHaveBeenCalledWith(
            productId,
            expect.objectContaining({
                req: expect.objectContaining({
                    headers: expect.objectContaining({
                        "x-custom-header": "custom value",
                    }),
                }),
            })
        );
    });
});
