import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, QueryRunner } from "typeorm";
import { OrderListService } from "../orderList.service";
import { OrderList } from "../entities/orderList.entity";

describe("OrderListService", () => {
    let service: OrderListService;
    let repository: Repository<OrderList>;

    const mockRepository = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        softDelete: jest.fn(),
    };

    const mockQueryRunner: any = {
        manager: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
        },
    };

    const userId = "testUserId";
    const orderListArray: OrderList[] = [];
    const orderList = new OrderList();
    const createOrderListInput = {
        productId: "1",
        impUid: "testImpUid",
        orderQuantity: 1,
        deliveryAddress: "testAddress",
        contactNumber: "testContactNumber",
        price: 1000,
    };
    const user = { email: "testEmail", userId: "testUserId" };
    const impUid = "testImpUid";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderListService,
                {
                    provide: getRepositoryToken(OrderList),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<OrderListService>(OrderListService);
        repository = module.get<Repository<OrderList>>(getRepositoryToken(OrderList));
    });

    it("orderList init", () => {
        expect(service).toBeDefined();
    });

    describe("find", () => {
        it("", async () => {
            mockRepository.find.mockResolvedValue(orderListArray);
            const result = await service.find(userId);
            expect(result).toEqual(orderListArray);
        });
    });

    describe("createForTransaction", () => {
        it("", async () => {
            mockRepository.create.mockReturnValue(orderList);
            mockRepository.save.mockResolvedValue(orderList);

            const result = await service.createForTransaction({ createOrderListInput, user }, mockQueryRunner);

            expect(result).toEqual(orderList);
            expect(mockRepository.create).toHaveBeenCalledWith({
                product: { productId: createOrderListInput.productId },
                user,
                payment: { impUid: createOrderListInput.impUid },
                orderQuantity: createOrderListInput.orderQuantity,
                deliveryAddress: createOrderListInput.deliveryAddress,
                contactNumber: createOrderListInput.contactNumber,
                price: createOrderListInput.price,
            });
            expect(mockRepository.save).toHaveBeenCalledWith(orderList);
        });
    });

    describe("deleteForTransaction", () => {
        it("", async () => {
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            const result = await service.deleteForTransaction(impUid, mockQueryRunner);

            expect(result).toEqual(true);
            expect(mockRepository.softDelete).toHaveBeenCalledWith({ payment: { impUid } });
        });
    });
});
