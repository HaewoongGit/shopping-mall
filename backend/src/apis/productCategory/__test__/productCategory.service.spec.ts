import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, EntityManager, QueryRunner } from "typeorm";
import { ProductCategory, CategoryName } from "../entities/productCategory.entity";
import { ProductCategoryService } from "../productCategory.service";

describe("ProductCategoryService", () => {
    let service: ProductCategoryService;
    let repo: jest.Mocked<Repository<ProductCategory>>;
    let manager: jest.Mocked<EntityManager>;
    let queryRunner: jest.Mocked<QueryRunner>;

    beforeEach(async () => {
        const repoMock = {
            findOne: jest.fn(),
            save: jest.fn(),
        };
        const managerMock = {
            getRepository: jest.fn().mockReturnValue(repoMock),
        };
        const queryRunnerMock = {
            manager: managerMock,
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductCategoryService,
                {
                    provide: getRepositoryToken(ProductCategory),
                    useValue: repoMock,
                },
                {
                    provide: "EntityManager",
                    useValue: managerMock,
                },
                {
                    provide: "QueryRunner",
                    useValue: queryRunnerMock,
                },
            ],
        }).compile();

        service = module.get<ProductCategoryService>(ProductCategoryService);
        repo = module.get<jest.Mocked<Repository<ProductCategory>>>(getRepositoryToken(ProductCategory));
        manager = module.get<jest.Mocked<EntityManager>>("EntityManager");
        queryRunner = module.get<jest.Mocked<QueryRunner>>("QueryRunner");
    });

    describe("findOne", () => {
        it("", async () => {
            const categoryName: CategoryName = CategoryName.Electronics;
            const result: ProductCategory = { productCategoryId: "1", categoryName, createdAt: new Date() };

            repo.findOne.mockResolvedValue(result);

            expect(await service.findOne(categoryName)).toEqual(result);
            expect(repo.findOne).toHaveBeenCalledWith({ where: { categoryName } });
        });
    });

    describe("create", () => {
        it("", async () => {
            const categoryName: CategoryName = CategoryName.Electronics;
            const result: ProductCategory = { productCategoryId: "1", categoryName, createdAt: new Date() };

            repo.save.mockResolvedValue(result);

            expect(await service.create({ categoryName }, queryRunner)).toEqual(result);
            expect(repo.save).toHaveBeenCalledWith({ categoryName });
        });
    });

    describe("update", () => {
        it("", async () => {
            const productCategoryId = "1";
            const categoryName: CategoryName = CategoryName.Electronics;
            const result: ProductCategory = { productCategoryId, categoryName, createdAt: new Date() };

            repo.save.mockResolvedValue(result);

            expect(await service.update({ productCategoryId, categoryName }, queryRunner)).toEqual(result);
            expect(repo.save).toHaveBeenCalledWith({ productCategoryId, categoryName });
        });
    });
});
