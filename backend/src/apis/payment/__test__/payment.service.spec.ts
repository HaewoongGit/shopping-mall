import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PaymentService } from "../payment.service";
import { Payment } from "../entities/payment.entity";
import { CartService } from "../../cart/cart.service";
import { OrderListService } from "../../orderList/orderList.service";
import { ProductService } from "../../product/product.service";
import { Cart } from "src/apis/cart/entities/cart.entity";
import { OrderList } from "src/apis/orderList/entities/orderList.entity";
import { Product } from "src/apis/product/entities/product.entity";
import { ProductTagService } from "src/apis/productTag/productTag.service";
import { UserService } from "src/apis/user/users.service";
import { User } from "src/apis/user/entities/user.entity";
import { ProductCategoryService } from "src/apis/productCategory/productCategory.service";
import { FileService } from "src/apis/file/file.service";
import { File } from "src/apis/file/entities/file.entity";
import { ProductCategory } from "src/apis/productCategory/entities/productCategory.entity";
import { ProductTag } from "src/apis/productTag/entities/productTag.entity";

jest.mock("iamport", () => {
    return jest.fn().mockImplementation(() => {
        return {
            payment: {
                getByImpUid: jest.fn().mockResolvedValue({ status: "paid", amount: 1000 }),
                cancel: jest.fn().mockResolvedValue({}),
            },
        };
    });
});

const testPayment: Payment = new Payment();
const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn().mockResolvedValue(null),
        startTransaction: jest.fn().mockResolvedValue(null),
        commitTransaction: jest.fn().mockResolvedValue(null),
        rollbackTransaction: jest.fn().mockResolvedValue(null),
        release: jest.fn().mockResolvedValue(null),
        manager: {
            save: jest.fn().mockResolvedValue(testPayment),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            getRepository: jest.fn().mockReturnValue({
                softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            }),
        },
    }),
};

describe("PaymentService", () => {
    let service: PaymentService;
    let repo: Repository<Payment>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                { provide: getRepositoryToken(Payment), useClass: Repository },
                CartService,
                { provide: getRepositoryToken(Cart), useClass: Repository },
                OrderListService,
                { provide: getRepositoryToken(OrderList), useClass: Repository },
                ProductService,
                { provide: getRepositoryToken(Product), useClass: Repository },
                ProductTagService,
                { provide: getRepositoryToken(ProductTag), useClass: Repository },
                ProductCategoryService,
                { provide: getRepositoryToken(ProductCategory), useClass: Repository },
                FileService,
                { provide: getRepositoryToken(File), useClass: Repository },
                UserService,
                { provide: getRepositoryToken(User), useClass: Repository },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        repo = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    });

    it("paymnetService init", () => {
        expect(service).toBeDefined();
    });

    describe("find", () => {
        it("", async () => {
            const testPayment: Payment = new Payment();
            jest.spyOn(repo, "find").mockResolvedValueOnce([testPayment]);

            const payments = await service.find("testUserId");
            expect(payments).toEqual([testPayment]);
        });
    });

    describe("create", () => {
        it("", async () => {
            const testPayment: Payment = new Payment();
            const mockCartService = {
                deleteForTransaction: jest.fn().mockResolvedValueOnce(true),
            };
            const mockProductService = {
                findOne: jest.fn().mockResolvedValueOnce({ price: 1000 }), // price 속성 추가
            };
            const mockOrderListService = {
                createForTransaction: jest.fn().mockResolvedValueOnce(new OrderList()),
            };
            const mockPaymentRepository = {
                create: jest.fn().mockReturnValue(testPayment),
                save: jest.fn().mockResolvedValueOnce(testPayment),
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    PaymentService,
                    { provide: getRepositoryToken(Payment), useValue: mockPaymentRepository },
                    { provide: CartService, useValue: mockCartService },
                    { provide: ProductService, useValue: mockProductService },
                    { provide: OrderListService, useValue: mockOrderListService },
                    { provide: DataSource, useValue: mockDataSource },
                ],
            }).compile();

            service = module.get<PaymentService>(PaymentService);

            const payment = await service.create({
                createPaymentInput: {
                    waitingListForPurchase: [
                        {
                            productId: "testProductId",
                            productName: "testProductName",
                            quantity: 1,
                            price: 1000,
                            isCart: true,
                        },
                    ],
                    impUid: "testImpUid",
                    merchantUid: "testMerchantUid",
                    amount: 1000,
                    deliveryAddress: "testAddress",
                    contactNumber: "testContactNumber",
                    orderInformation: "testOrderInformation",
                },
                user: {
                    userId: "testUserId",
                    email: "testEmail@example.com",
                },
            });

            expect(payment).toEqual(testPayment);
        });
    });

    describe("delete", () => {
        it("", async () => {
            jest.spyOn(mockDataSource.createQueryRunner().manager, "softDelete").mockResolvedValueOnce({ affected: 1 });

            const affected = await service.delete("testImpUid");
            expect(affected).toEqual(1);
        });
    });
});
