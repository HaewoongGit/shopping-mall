import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DibsService } from "../dibs.service";
import { Dibs } from "../entities/dibs.entity";
import { Repository } from "typeorm";
import { ProductService } from "src/apis/product/product.service";
import { Product } from "src/apis/product/entities/product.entity";

describe("DibsService", () => {
    let service: DibsService;
    let repo: Repository<Dibs>;
    const product = new Product();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DibsService,
                {
                    provide: getRepositoryToken(Dibs),
                    useClass: Repository,
                },
                {
                    provide: ProductService,
                    useValue: {
                        findOne: jest.fn().mockImplementation((id: string) => {
                            return product;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<DibsService>(DibsService);
        repo = module.get<Repository<Dibs>>(getRepositoryToken(Dibs));
    });

    it("dibs init", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("dibs findOne", async () => {
            const testDibs = new Dibs();
            const productId = "testProductId";
            const userId = "testUserId";

            const query = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(testDibs),
            };

            jest.spyOn(repo, "createQueryBuilder").mockReturnValue(query as any);
            expect(await service.findOne(productId, userId)).toEqual(testDibs);
        });
    });

    describe("find", () => {
        it("userId와 productId가 둘 다 있는 경우", async () => {
            const testDibs = [new Dibs(), new Dibs()];
            const productId = "testProductId";
            const userId = "testUserId";

            const query = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(testDibs),
            };

            jest.spyOn(repo, "createQueryBuilder").mockReturnValue(query as any);

            expect(await service.find(userId, 1, productId)).toEqual(testDibs);
        });

        it("productId만 있는 경우", async () => {
            const testDibs = [new Dibs(), new Dibs()];
            const productId = "testProductId";

            const query = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(testDibs),
            };

            jest.spyOn(repo, "createQueryBuilder").mockReturnValue(query as any);

            expect(await service.find(undefined, 1, productId)).toEqual(testDibs);
        });

        it("userId만 있는 경우", async () => {
            const testDibs = [new Dibs(), new Dibs()];
            const userId = "testUserId";

            const query = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(testDibs),
            };

            jest.spyOn(repo, "createQueryBuilder").mockReturnValue(query as any);

            expect(await service.find(userId, 1)).toEqual(testDibs);
        });

        it("productId와 userId 둘 다 없는 경우", async () => {
            const testDibs = [new Dibs(), new Dibs()];

            jest.spyOn(repo, "find").mockResolvedValue(testDibs);

            expect(await service.find(undefined, 1)).toEqual(testDibs);
        });
    });

    describe("count", () => {
        it("", async () => {
            const testCount = 5;
            const userId = "testUserId";

            const query = {
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getCount: jest.fn().mockResolvedValue(testCount),
            };

            jest.spyOn(repo, "createQueryBuilder").mockReturnValue(query as any);

            expect(await service.count(userId)).toEqual(testCount);
        });
    });

    describe("create", () => {
        it("", async () => {
            const testDibs = new Dibs();
            const productId = "testProductId";
            const userId = "testUserId";

            jest.spyOn(repo, "save").mockResolvedValue(undefined);
            jest.spyOn(service, "findOne").mockResolvedValue(testDibs);

            expect(await service.create(productId, userId)).toEqual(testDibs);
        });
    });

    describe("update", () => {
        it("", async () => {
            const testDibs = new Dibs();
            const productId = "testProductId";
            const userId = "testUserId";
            const updateDibsInput = { productId, isDibs: true };

            jest.spyOn(repo, "save").mockResolvedValue(testDibs);

            expect(await service.update(updateDibsInput, userId)).toEqual(testDibs);
        });
    });

    describe("delete", () => {
        it("softDelete affected가 1이상을 반환하는 경우", async () => {
            const productId = "testProductId";
            const userId = "testUserId";

            jest.spyOn(repo, "softDelete").mockResolvedValue({ affected: 1 } as any);

            expect(await service.delete(productId, userId)).toEqual(true);
        });

        it("softDelete affected가 0을 반환하는 경우", async () => {
            const productId = "testProductId";
            const userId = "testUserId";

            jest.spyOn(repo, "softDelete").mockResolvedValue({ affected: 0 } as any);

            expect(await service.delete(productId, userId)).toEqual(false);
        });
    });
});
