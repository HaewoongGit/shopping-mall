import { Test, TestingModule } from "@nestjs/testing";
import { DibsResolver } from "../dibs.resolver";
import { DibsService } from "../dibs.service";
import { Dibs } from "../entities/dibs.entity";
import { response as mockResponse } from "jest-mock-express";

jest.mock("../dibs.service");

describe("DibsResolver", () => {
    let resolver: DibsResolver;
    let service: DibsService;

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

    const productId = "1";
    const dibs = new Dibs();
    const dibses: Dibs[] = [];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DibsResolver, DibsService],
        }).compile();

        resolver = module.get<DibsResolver>(DibsResolver);
        service = module.get<DibsService>(DibsService);
    });

    it("dibs init", () => {
        expect(resolver).toBeDefined();
    });

    it("fetchDibs", async () => {
        jest.spyOn(service, "findOne").mockResolvedValue(dibs);

        expect(await resolver.fetchDibs(productId, context)).toBe(dibs);
    });

    it("fetchDibses", async () => {
        const page = 1;

        jest.spyOn(service, "find").mockResolvedValue(dibses);

        expect(await resolver.fetchDibses(context, page, productId)).toBe(dibses);
        expect(service.find).toHaveBeenCalled();
        expect(service.find).toHaveBeenCalledWith(context.req.user.userId, page, productId);

        jest.spyOn(service, "find").mockImplementation(() => {
            throw new Error();
        });

        try {
            await resolver.fetchDibses(context, page, productId);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    it("countDibses", async () => {
        const count = 5;

        jest.spyOn(service, "count").mockResolvedValue(count);

        expect(await resolver.countDibses(context)).toBe(count);
        expect(service.count).toHaveBeenCalled();
        expect(service.count).toHaveBeenCalledWith(context.req.user.userId);
    });

    it("createDibs", async () => {
        jest.spyOn(service, "create").mockResolvedValue(dibs);

        expect(await resolver.createDibs(productId, context)).toBe(dibs);
        expect(service.create).toHaveBeenCalled();
        expect(service.create).toHaveBeenCalledWith(productId, context.req.user.userId);
    });

    it("updateDibs", async () => {
        const updateDibsInput = { productId: "1", isDibs: true };

        jest.spyOn(service, "update").mockResolvedValue(dibs);

        expect(await resolver.updateDibs(updateDibsInput, context)).toBe(dibs);
        expect(service.update).toHaveBeenCalled();
        expect(service.update).toHaveBeenCalledWith(updateDibsInput, context.req.user.userId);
    });

    it("deleteDibs", async () => {
        jest.spyOn(service, "delete").mockResolvedValue(true);

        expect(await resolver.deleteDibs(productId, context)).toBe(true);
        expect(service.delete).toHaveBeenCalled();
        expect(service.delete).toHaveBeenCalledWith(productId, context.req.user.userId);
    });
});
