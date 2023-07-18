import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "../product.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { DataSource, Repository } from "typeorm";
import { CreateProductInput } from "../dto/createProduct.input";
import { FindProductsInput } from "../dto/findProducts.input";
import { CountProductsInput } from "../dto/countProducts.input";
import { UpdateProductInput } from "../dto/updateProduct.input";
import { ProductTagService } from "src/apis/productTag/productTag.service";
import { UserService } from "src/apis/user/users.service";
import { FileService } from "src/apis/file/file.service";
import { ProductCategoryService } from "src/apis/productCategory/productCategory.service";
import { CategoryName, ProductCategory } from "src/apis/productCategory/entities/productCategory.entity";
import { Readable } from "stream";
import { ProductTag } from "src/apis/productTag/entities/productTag.entity";
import { User } from "src/apis/user/entities/user.entity";
import { File } from "src/apis/file/entities/file.entity";

describe("ProductService", () => {
    let service: ProductService;
    let repo: Repository<Product>;

    const productId = "testProductId";

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

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: getRepositoryToken(Product), useClass: Repository },
                ProductTagService,
                UserService,
                ProductCategoryService,
                FileService,
                { provide: DataSource, useValue: mockDataSource },
                { provide: getRepositoryToken(ProductTag), useClass: Repository },
                { provide: getRepositoryToken(User), useClass: Repository },
                { provide: getRepositoryToken(ProductCategory), useClass: Repository },
                { provide: getRepositoryToken(File), useClass: Repository },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        repo = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it("productService init", () => {
        expect(service).toBeDefined();
        expect(repo).toBeDefined();
    });

    describe("create", () => {
        it("", async () => {
            const result = new Product();
            jest.spyOn(service, "create").mockResolvedValue(result);
            expect(await service.create(createProductInput, "testEmail@example.com")).toEqual(result);
        });
    });

    describe("findOne", () => {
        it("", async () => {
            const result = new Product();
            jest.spyOn(service, "findOne").mockResolvedValue(result);
            expect(await service.findOne(productId)).toEqual(result);
        });
    });

    describe("findAll", () => {
        it("", async () => {
            const result = [new Product()];
            jest.spyOn(service, "findAll").mockResolvedValue(result);
            expect(await service.findAll(findProductsInput)).toEqual(result);
        });
    });

    describe("count", () => {
        it("", async () => {
            const result = 10;
            jest.spyOn(service, "count").mockResolvedValue(result);
            expect(await service.count(countProductsInput)).toEqual(result);
        });
    });

    describe("update", () => {
        it("", async () => {
            const result = new Product();
            jest.spyOn(service, "update").mockResolvedValue(result);
            expect(await service.update({ productId, updateProductInput })).toEqual(result);
        });
    });

    describe("increaseHits", () => {
        it("", async () => {
            const result = new Product();
            jest.spyOn(service, "increaseHits").mockResolvedValue(result);
            expect(await service.increaseHits(productId)).toEqual(result);
        });
    });

    describe("delete", () => {
        it("", async () => {
            const result = true;
            jest.spyOn(service, "delete").mockResolvedValue(result);
            expect(await service.delete(productId)).toEqual(result);
        });
    });
});
