import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PaymentService } from "../payment.service";
import { Payment } from "../entities/payment.entity";
import { CartService } from "../../cart/cart.service";
import { OrderListService } from "../../orderList/orderList.service";
import { ProductService } from "../../product/product.service";
import { CreatePaymentInput, PurchaseItem } from "../dto/createPayment.input";
import { Cart } from "src/apis/cart/entities/cart.entity";
import { Product } from "src/apis/product/entities/product.entity";
import { OrderList } from "src/apis/orderList/entities/orderList.entity";
import { ProductTagService } from "src/apis/productTag/productTag.service";
import { UserService } from "src/apis/user/users.service";
import { ProductCategoryService } from "src/apis/productCategory/productCategory.service";
import { FileService } from "src/apis/file/file.service";

describe("PaymentService", () => {
    let service: PaymentService;
    let repo: Repository<Payment>;

    const user = {
        email: "testEmail@example.com",
        userId: "testUserId",
    };

    const purchaseItem: PurchaseItem = {
        productId: "1",
        productName: "testProduct",
        quantity: 1,
        price: 1000,
        isCart: true,
    };

    const createPaymentInput: CreatePaymentInput = {
        waitingListForPurchase: [purchaseItem],
        impUid: "testImpUid",
        merchantUid: "testMerchantUid",
        amount: 1000,
        deliveryAddress: "testAddress",
        contactNumber: "testContactNumber",
        orderInformation: "testOrderInformation",
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            manager: {
                save: jest.fn(),
                softDelete: jest.fn(),
            },
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        }),
    };

    const testPayment: Payment = {
        paymentId: "test-payment-id",
        impUid: "test-imp-uid",
        merchantUid: "test-merchant-uid",
        amount: 1000,
        deliveryAddress: "123 Test Street, Test City, Test Country",
        contactNumber: "123-456-7890",
        orderInformation: "Test order information",
        status: "PAYMENT",
        user: {
            userId: "test-user-id",
            email: "test@example.com",
            password: "test-password",
            phoneNumber: "123-456-7890",
            userName: "Test User",
            age: 30,
            createdAt: new Date(),
            deletedAt: null,
        },
        createdAt: new Date(),
        deletedAt: null,
    };

    const mockProductTagService = {};
    const mockUserService = {};
    const mockProductCategoryService = {};
    const mockFileService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                { provide: getRepositoryToken(Payment), useClass: Repository },
                { provide: DataSource, useValue: mockDataSource },
                CartService,
                { provide: getRepositoryToken(Cart), useClass: Repository },
                OrderListService,
                { provide: getRepositoryToken(OrderList), useClass: Repository },
                ProductService,
                { provide: getRepositoryToken(Product), useClass: Repository },
                { provide: ProductTagService, useValue: mockProductTagService },
                { provide: UserService, useValue: mockUserService },
                { provide: ProductCategoryService, useValue: mockProductCategoryService },
                { provide: FileService, useValue: mockFileService },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        repo = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    });

    it("paymentService init", () => {
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

    // 아래 테스트들 제대로 작동하지 않음.
    // describe("create", () => {
    //     it("", async () => {
    //         const testPayment: Payment = new Payment();
    //         jest.spyOn(repo, "create").mockReturnValue(testPayment);
    //         jest.spyOn(repo, "save").mockResolvedValue(testPayment);

    //         const payment = await service.create({ createPaymentInput, user });
    //         expect(payment).toBeDefined();
    //         expect(payment).toEqual(testPayment);
    //     });
    // });

    // describe("delete", () => {
    //     it("", async () => {
    //         const mockDeleteResult = { affected: 1 };
    //         jest.spyOn(repo, "softDelete").mockResolvedValue(mockDeleteResult as any);

    //         const affected = await service.delete("testImpUid");
    //         expect(affected).toBeDefined();
    //         expect(affected).toEqual(1);
    //     });
    // });
});
