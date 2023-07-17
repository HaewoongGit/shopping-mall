import { Test, TestingModule } from "@nestjs/testing";
import { AuthResolver } from "../auth.resolver";
import { AuthService } from "../auth.service";
import { response as mockResponse } from "jest-mock-express";

describe("AuthResolver", () => {
    let resolver: AuthResolver;
    let authService: jest.Mocked<AuthService>;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        restoreAccessToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
        authService = module.get(AuthService);
    });

    it("authResolver init", () => {
        expect(resolver).toBeDefined();
    });

    it("login", async () => {
        const email = "test@example.com";
        const password = "password";

        const mockLoginResult = { accessToken: "mockToken" };
        authService.login.mockResolvedValue(mockLoginResult);

        const result = await resolver.login(email, password, context);

        expect(authService.login).toHaveBeenCalledWith({ email, password, context });
        expect(result).toEqual(mockLoginResult);
    });

    it("restoreAcessToken", () => {
        const mockToken = "mockToken";
        authService.restoreAccessToken.mockReturnValue(mockToken);

        const result = resolver.restoreAcessToken(context);

        expect(authService.restoreAccessToken).toHaveBeenCalledWith({ user: context.req.user });
        expect(result).toEqual(mockToken);
    });
});
