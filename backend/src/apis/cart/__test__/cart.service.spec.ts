import { Test, TestingModule } from "@nestjs/testing";
import { CartService } from "../cart.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Cart } from "../entities/cart.entity";
import { ProductService } from "../../product/product.service";
import { Repository } from "typeorm";
import { response as mockResponse } from "jest-mock-express";

describe("CartService", () => {
    let service: CartService;
    let cartRepo: Repository<Cart>;

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

    const result = {
        product: { productId: "testProductId" },
        user: { userId: "testUserId" },
        quantity: 1,
        deletedAt: null,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: getRepositoryToken(Cart),
                    useValue: {
                        save: jest.fn(),
                        delete: jest.fn(),
                        find: jest.fn(),
                        createQueryBuilder: jest.fn(() => ({
                            leftJoinAndSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            getOne: jest.fn(),
                            getMany: jest.fn(),
                        })),
                    },
                },
                {
                    provide: ProductService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CartService>(CartService);
        cartRepo = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    });

    it("CartService init", () => {
        expect(service).toBeDefined();
    });

    it("cartService create", async () => {
        const createCartInput = {
            productId: "testProductId",
            quantity: 1,
        };

        jest.spyOn(cartRepo, "save").mockResolvedValue(result as any);
        jest.spyOn(service, "findOne").mockResolvedValue(result as any);

        expect(await service.create(createCartInput, context)).toEqual(result);
        expect(cartRepo.save).toHaveBeenCalledWith({
            product: { productId: "testProductId" },
            user: { userId: "testUserId" },
            quantity: 1,
            deletedAt: null,
        });
        expect(service.findOne).toHaveBeenCalledWith({
            productId: "testProductId",
            userId: "testUserId",
        });
    });

    it("cartService findOne", async () => {
        const findOneCartInput = {
            productId: "testProductId",
            userId: "testUserId",
        };

        const expectedCart = {
            product: { productId: "testProductId" },
            user: { userId: "testUserId" },
            quantity: 1,
            createdAt: new Date(),
            deletedAt: null,
        };

        const queryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(expectedCart),
        };

        jest.spyOn(cartRepo, "createQueryBuilder").mockReturnValue(queryBuilder as any);

        const result = await service.findOne(findOneCartInput);

        expect(result).toEqual(expectedCart);
        expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(3);
        expect(queryBuilder.where).toHaveBeenCalledWith("cartProduct.productId = :productId", { productId: findOneCartInput.productId });
        expect(queryBuilder.andWhere).toHaveBeenCalledWith("cartUser.userId = :userId", { userId: findOneCartInput.userId });
        expect(queryBuilder.getOne).toHaveBeenCalled();
    });

    it("cartService find", async () => {
        const productId = "testProductId";
        const expectedCarts = [
            {
                product: { productId: "testProductId1", productName: "Product 1", price: 100, description: "This is product 1" },
                user: {
                    userId: "testUserId1",
                    email: "testEmail1@example.com",
                    password: "testPassword1",
                    phoneNumber: "1234567890",
                    userName: "Test User 1",
                    age: 30,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                quantity: 1,
                createdAt: new Date(),
                deletedAt: null,
            },
            {
                product: { productId: "testProductId2", productName: "Product 2", price: 200, description: "This is product 2" },
                user: {
                    userId: "testUserId2",
                    email: "testEmail2@example.com",
                    password: "testPassword2",
                    phoneNumber: "0987654321",
                    userName: "Test User 2",
                    age: 25,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                quantity: 2,
                createdAt: new Date(),
                deletedAt: null,
            },
        ];

        const queryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
            getMany: jest.fn().mockResolvedValue(expectedCarts),
        };

        jest.spyOn(cartRepo, "createQueryBuilder").mockReturnValue(queryBuilder);
        jest.spyOn(cartRepo, "find").mockResolvedValue(expectedCarts as any);

        const resultWithProductIdAndUserId = await service.find(context, productId);
        expect(resultWithProductIdAndUserId).toEqual(expectedCarts);
        expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(3);
        expect(queryBuilder.where).toHaveBeenCalledWith("cartProduct.productId = :productId", { productId });
        expect(queryBuilder.andWhere).toHaveBeenCalledWith("cartUser.userId = :userId", { userId: context.req.user.userId });
        expect(queryBuilder.getMany).toHaveBeenCalled();

        const resultWithProductIdOnly = await service.find({ req: { headers: {} } }, productId);
        expect(resultWithProductIdOnly).toEqual(expectedCarts);
        expect(queryBuilder.where).toHaveBeenCalledWith("cartProduct.productId = :productId", { productId });

        const resultWithUserIdOnly = await service.find(context);
        expect(resultWithUserIdOnly).toEqual(expectedCarts);
        expect(queryBuilder.where).toHaveBeenCalledWith("cartUser.userId = :userId", { userId: context.req.user.userId });

        const resultWithNoProductIdAndUserId = await service.find({ req: { headers: {} } });
        expect(resultWithNoProductIdAndUserId).toEqual(expectedCarts);
        expect(cartRepo.find).toHaveBeenCalledWith({
            relations: ["product", "product.files", "user"],
        });
    });
});
