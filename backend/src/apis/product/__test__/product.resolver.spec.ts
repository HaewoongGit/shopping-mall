import { Test, TestingModule } from "@nestjs/testing";
import { Readable } from "stream";
import { Product } from "../entities/product.entity";
import { ProductResolver } from "../product.resolver";
import { ProductService } from "../product.service";
import { CreateProductInput } from "../dto/createProduct.input";
import { response as mockResponse } from "jest-mock-express";
import { CategoryName } from "src/apis/productCategory/entities/productCategory.entity";
import { FindProductsInput } from "../dto/findProducts.input";
import { CountProductsInput } from "../dto/countProducts.input";
import { UpdateProductInput } from "../dto/updateProduct.input";

describe("ProductResolver", () => {
    let resolver: ProductResolver;
    let service: ProductService;

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

    const productId = "testProductId";

    let result = new Product();

    const createProductInput: CreateProductInput = {
        productName: "Test Product",
        description: "This is a test product",
        price: 100,
        categoryName: CategoryName.Household,
        productTags: ["tag1", "tag2"],
        file: {
            filename: "test.jpg",
            mimetype: "image/jpeg",
            encoding: "7bit",
            createReadStream: () => {
                const mockStream = new Readable();
                mockStream.push("mock file data");
                mockStream.push(null);
                return mockStream;
            },
        },
    };

    const findProductsInput: FindProductsInput = {
        userId: "testUserId",
        categoryName: CategoryName.Household,
        keyword: "Test",
        page: 1,
    };

    const countProductsInput: CountProductsInput = {
        userId: "testUserId",
        categoryName: CategoryName.Household,
        keyword: "Test",
    };

    const updateProductInput: UpdateProductInput = {
        productName: "Updated Test Product",
        description: "This is an updated test product",
        price: 200,
        categoryName: CategoryName.Household,
        productTags: ["tag3", "tag4"],
        file: {
            filename: "updated_test.jpg",
            mimetype: "image/jpeg",
            encoding: "7bit",
            createReadStream: () => {
                const mockStream = new Readable();
                mockStream.push("updated mock file data");
                mockStream.push(null);
                return mockStream;
            },
        },
        isSoldOut: false,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductResolver,
                {
                    provide: ProductService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        findAll: jest.fn(),
                        count: jest.fn(),
                        update: jest.fn(),
                        increaseHits: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<ProductResolver>(ProductResolver);
        service = module.get<ProductService>(ProductService);
    });

    it("productResolver init", () => {
        expect(resolver).toBeDefined();
    });

    describe("createProduct", () => {
        it("", async () => {
            jest.spyOn(service, "create").mockResolvedValue(result);
            expect(await resolver.createProduct(createProductInput, context)).toBe(result);
        });
    });

    describe("fetchProduct", () => {
        it("", async () => {
            jest.spyOn(service, "findOne").mockResolvedValue(result);
            expect(await resolver.fetchProduct(productId)).toBe(result);
        });
    });

    describe("fetchProducts", () => {
        it("", async () => {
            const result = [new Product()];
            jest.spyOn(service, "findAll").mockResolvedValue(result);
            expect(await resolver.fetchProducts(findProductsInput)).toEqual(result);
        });
    });

    describe("countProducts", () => {
        it("", async () => {
            const result = 10;
            jest.spyOn(service, "count").mockResolvedValue(result);
            expect(await resolver.countProducts(countProductsInput)).toBe(result);
        });
    });

    describe("updateProduct", () => {
        it("", async () => {
            jest.spyOn(service, "update").mockResolvedValue(result);
            expect(await resolver.updateProduct(productId, updateProductInput)).toBe(result);
        });
    });

    describe("increaseHits", () => {
        it("", async () => {
            jest.spyOn(service, "increaseHits").mockResolvedValue(result);
            expect(await resolver.increaseHits(productId)).toBe(result);
        });
    });

    describe("deleteProduct", () => {
        it("", async () => {
            const result = true;
            jest.spyOn(service, "delete").mockResolvedValue(result);
            expect(await resolver.deleteProduct(productId)).toBe(result);
        });
    });
});
