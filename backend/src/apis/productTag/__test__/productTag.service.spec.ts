import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductTag } from "../entities/productTag.entity";
import { ProductTagService } from "../productTag.service";

describe("ProductTagService", () => {
    let service: ProductTagService;
    let repo: Repository<ProductTag>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductTagService,
                {
                    provide: getRepositoryToken(ProductTag),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProductTagService>(ProductTagService);
        repo = module.get<Repository<ProductTag>>(getRepositoryToken(ProductTag));
    });

    describe("findByNames", () => {
        it("", async () => {
            const tagNames = ["tag1", "tag2"];
            const result = [new ProductTag(), new ProductTag()];
            jest.spyOn(repo, "find").mockResolvedValue(result);

            expect(await service.findByNames(tagNames)).toBe(result);
        });
    });

    describe("bulkInsert", () => {
        it("", async () => {
            const names = [{ tagName: "tag1" }, { tagName: "tag2" }];
            const result = { identifiers: [], generatedMaps: [], raw: [] };
            const mockQueryRunner = {
                manager: {
                    getRepository: jest.fn().mockReturnValue({
                        insert: jest.fn().mockResolvedValue(result),
                    }),
                },
            };

            expect(await service.bulkInsert({ names }, mockQueryRunner as any)).toBe(result);
        });
    });

    describe("findOne", () => {
        it("", async () => {
            const result = new ProductTag();
            jest.spyOn(repo, "findOne").mockResolvedValue(result);

            expect(await service.findOne("1")).toBe(result);
        });
    });

    describe("findAll", () => {
        it("", async () => {
            const result = [new ProductTag(), new ProductTag()];
            jest.spyOn(repo, "find").mockResolvedValue(result);

            expect(await service.findAll()).toBe(result);
        });
    });

    describe("update", () => {
        it("", async () => {
            const result = new ProductTag();
            jest.spyOn(repo, "save").mockResolvedValue(result);

            expect(await service.update("1")).toBe(result);
        });
    });

    describe("delete", () => {
        it("", async () => {
            const result = new ProductTag();
            result.deletedAt = new Date();
            jest.spyOn(repo, "softRemove").mockResolvedValue(result);

            expect(await service.delete("1")).toBe(true);
        });
    });
});
