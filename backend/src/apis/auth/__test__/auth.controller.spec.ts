import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { User } from "../../user/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        loginOAuth: jest.fn().mockImplementation(async () => {
                            const result = new User();
                            result.userId = "1";
                            result.email = "test@test.com";
                            result.userName = "Test User";
                            return result;
                        }),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard("google"))
            .useValue({ canActivate: () => true })
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    it("google login", async () => {
        const req = {
            user: {
                accessToken: "testToken",
                email: "test@test.com",
                userName: "Test User",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const result = await authController.loginGoogle(req as any, res as any);
        expect(result).toBeInstanceOf(User);
        expect(result.email).toEqual("test@test.com");
    });
});
