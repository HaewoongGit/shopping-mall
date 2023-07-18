import { Test, TestingModule } from "@nestjs/testing";
import { OrderListResolver } from "../orderList.resolver";
import { OrderListService } from "../orderList.service";
import { response as mockResponse } from "jest-mock-express";
import { OrderList } from "../entities/orderList.entity";

jest.mock("../orderList.service");

describe("OrderListResolver", () => {
    let resolver: OrderListResolver;
    let service: OrderListService;

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

    const orderList: OrderList[] = [];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrderListResolver, OrderListService],
        }).compile();

        resolver = module.get<OrderListResolver>(OrderListResolver);
        service = module.get<OrderListService>(OrderListService);
    });

    describe("orderListResolver init", () => {
        it("", () => {
            expect(resolver).toBeDefined();
        });
    });

    describe("fetchOrderList", () => {
        it("orderList 목록 확인", async () => {
            jest.spyOn(service, "find").mockResolvedValue(orderList);

            expect(await resolver.fetchOrderList(context)).toBe(orderList);
            expect(service.find).toHaveBeenCalled();
            expect(service.find).toHaveBeenCalledWith(context.req.user.userId);
        });
    });
});
