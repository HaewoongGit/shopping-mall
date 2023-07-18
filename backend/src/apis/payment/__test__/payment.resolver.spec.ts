import { Test, TestingModule } from "@nestjs/testing";
import { PaymentResolver } from "../payment.resolver";
import { PaymentService } from "../payment.service";
import { Payment } from "../entities/payment.entity";
import { CreatePaymentInput, PurchaseItem } from "../dto/createPayment.input";
import { response as mockResponse } from "jest-mock-express";

describe("PaymentResolver", () => {
    let resolver: PaymentResolver;
    let service: PaymentService;

    const mockService = {
        find: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    };

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

    const paymentArray: Payment[] = [];
    const payment = new Payment();
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
    const impUid = "testImpUid";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentResolver,
                {
                    provide: PaymentService,
                    useValue: mockService,
                },
            ],
        }).compile();

        resolver = module.get<PaymentResolver>(PaymentResolver);
        service = module.get<PaymentService>(PaymentService);
    });

    it("paymentResolver init", () => {
        expect(resolver).toBeDefined();
    });

    describe("fetchPayments", () => {
        it("", async () => {
            mockService.find.mockResolvedValue(paymentArray);
            const result = await resolver.fetchPayments(context);
            expect(result).toEqual(paymentArray);
        });
    });

    describe("createPayment", () => {
        it("", async () => {
            mockService.create.mockResolvedValue(payment);
            const result = await resolver.createPayment(createPaymentInput, context);
            expect(result).toEqual(payment);
        });
    });

    describe("deletePayment", () => {
        it("", async () => {
            mockService.delete.mockResolvedValue(true);
            const result = await resolver.deletePayment(impUid);
            expect(result).toEqual(true);
        });
    });
});
