import { Test, TestingModule } from "@nestjs/testing";
import { ProductTagResolver } from "../productTag.resolver";
import { ProductTagService } from "../productTag.service";
import { ProductTag } from "../entities/productTag.entity";

describe("ProductTagResolver", () => {
    let resolver: ProductTagResolver;
    let service: ProductTagService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductTagResolver,
                {
                    provide: ProductTagService,
                    useValue: {
                        findOne: jest.fn(),
                        findAll: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<ProductTagResolver>(ProductTagResolver);
        service = module.get<ProductTagService>(ProductTagService);
    });

    describe("fetchProductTag", () => {
        it("", async () => {
            const result = new ProductTag();
            jest.spyOn(service, "findOne").mockResolvedValue(result);

            expect(await resolver.fetchProductTag("1")).toBe(result);
        });
    });

    describe("fetchProductTags", () => {
        it("", async () => {
            const result = [new ProductTag(), new ProductTag()];
            jest.spyOn(service, "findAll").mockResolvedValue(result);

            expect(await resolver.fetchProductTags()).toBe(result);
        });
    });

    describe("updateProductTag", () => {
        it("", async () => {
            const result = new ProductTag();
            jest.spyOn(service, "update").mockResolvedValue(result);

            expect(await resolver.updateProductTag("1")).toBe(result);
        });
    });

    describe("deleteProductTag", () => {
        it("", async () => {
            jest.spyOn(service, "delete").mockResolvedValue(true);

            expect(await resolver.deleteProductTag("1")).toBe(true);
        });
    });
});
