import { Test, TestingModule } from "@nestjs/testing";
import { ProductsCategoriesResolver } from "../productCategory.resolver";
import { ProductCategoryService } from "../productCategory.service";
import { DataSource } from "typeorm";
import { ProductCategory, CategoryName } from "../entities/productCategory.entity";

describe("ProductsCategoriesResolver", () => {
    let resolver: ProductsCategoriesResolver;
    let service: ProductCategoryService;
    let dataSource: DataSource;
    let queryRunner: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsCategoriesResolver,
                {
                    provide: ProductCategoryService,
                    useValue: {
                        create: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue({
                            connect: jest.fn(),
                            startTransaction: jest.fn(),
                            commitTransaction: jest.fn(),
                            rollbackTransaction: jest.fn(),
                            release: jest.fn(),
                        }),
                    },
                },
            ],
        }).compile();

        resolver = module.get<ProductsCategoriesResolver>(ProductsCategoriesResolver);
        service = module.get<ProductCategoryService>(ProductCategoryService);
        dataSource = module.get<DataSource>(DataSource);

        queryRunner = dataSource.createQueryRunner();
    });

    describe("createProductCategory", () => {
        it("정상 작동", async () => {
            const categoryName: CategoryName = CategoryName.Electronics;
            const result: ProductCategory = { productCategoryId: "1", categoryName, createdAt: new Date() };

            jest.spyOn(service, "create").mockResolvedValue(result);

            expect(await resolver.createProductCategory(categoryName)).toEqual(result);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(service.create).toHaveBeenCalledWith({ categoryName }, queryRunner);
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });

        it("오류시 롤백", async () => {
            const categoryName: CategoryName = CategoryName.Electronics;
            const error = new Error("Error");

            jest.spyOn(service, "create").mockRejectedValue(error);

            await expect(resolver.createProductCategory(categoryName)).rejects.toThrow(error);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(service.create).toHaveBeenCalledWith({ categoryName }, queryRunner);
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });

    describe("updateProductCategory", () => {
        it("정상 작동", async () => {
            const productCategoryId = "1";
            const categoryName: CategoryName = CategoryName.Electronics;
            const result: ProductCategory = { productCategoryId, categoryName, createdAt: new Date() };

            jest.spyOn(service, "update").mockResolvedValue(result);

            expect(await resolver.updateProductCategory(productCategoryId, categoryName)).toEqual(result);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(service.update).toHaveBeenCalledWith({ productCategoryId, categoryName }, queryRunner);
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });

        it("오류시 롤백", async () => {
            const productCategoryId = "1";
            const categoryName: CategoryName = CategoryName.Electronics;
            const error = new Error("Error");

            jest.spyOn(service, "update").mockRejectedValue(error);

            await expect(resolver.updateProductCategory(productCategoryId, categoryName)).rejects.toThrow(error);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(service.update).toHaveBeenCalledWith({ productCategoryId, categoryName }, queryRunner);
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });
});
