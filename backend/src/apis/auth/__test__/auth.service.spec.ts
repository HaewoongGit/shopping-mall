import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/users.service";
import { User } from "../../user/entities/user.entity";
import * as bcrypt from "bcrypt";
import { response as mockResponse } from "jest-mock-express";
import { UnprocessableEntityException } from "@nestjs/common";

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hash: jest.fn(() => Promise.resolve("hashedPassword")),
}));

describe("AuthService", () => {
    let service: AuthService;
    let jwtService: { sign: jest.Mock };
    let userService: { findOneByEmail: jest.Mock; create: jest.Mock };

    const email = "test@example.com";
    const password = "password";

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

    res.setHeader = jest.fn();
    res._getRedirectUrl = jest.fn(() => "http://localhost:8080/?token=mockToken");
    res._getHeaders = jest.fn(() => ({ "Set-Cookie": "refreshToken=mockToken; path=/;" }));

    const context = {
        req: res.req,
        res,
    };

    let user: User;

    beforeEach(async () => {
        (bcrypt.compare as jest.Mock).mockImplementation(() => Promise.resolve(true));
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {
            email,
            password: hashedPassword,
            userId: "",
            phoneNumber: "",
            userName: "",
            age: 0,
            createdAt: undefined,
            deletedAt: undefined,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        findOneByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
        userService = module.get(UserService);

        (bcrypt.compare as jest.Mock) = jest.fn();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("login success", async () => {
        userService.findOneByEmail.mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        jwtService.sign.mockReturnValue("mockToken");

        const result = await service.login({ email, password, context });

        expect(result).toEqual({ token: "mockToken", userId: user.userId });
    });

    it("login, 이메일 확인 실패", async () => {
        const email = "test@example.com";
        const password = "password";

        userService.findOneByEmail.mockResolvedValue(undefined);

        await expect(service.login({ email, password, context })).rejects.toThrow(UnprocessableEntityException);
    });

    it("login, 비밀번호 확인 실패", async () => {
        user.password = await bcrypt.hash("differentPassword", 10);
        userService.findOneByEmail.mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(service.login({ email, password, context })).rejects.toThrow(UnprocessableEntityException);
    });

    it("loginOAuth", async () => {
        user.email = context.req.user.email;

        userService.findOneByEmail.mockResolvedValue(null);
        userService.create.mockResolvedValue(user);
        jwtService.sign.mockReturnValue("mockToken");

        const result = await service.loginOAuth(context);

        expect(result).toEqual(user);
        expect(res._getRedirectUrl()).toEqual("http://localhost:8080/?token=mockToken");
        expect(res._getHeaders()).toHaveProperty("Set-Cookie");

        user.email = "test@example.com";
    });

    it("restoreAccessToken", () => {
        jwtService.sign.mockReturnValue("mockToken");

        const result = service.restoreAccessToken({ user });

        expect(result).toEqual("mockToken");
    });

    it("setRefreshToken", () => {
        jwtService.sign.mockReturnValue("mockToken");

        service.setRefreshToken({ user, res });

        expect(res._getHeaders()).toHaveProperty("Set-Cookie");
    });

    it("getAccessToken", () => {
        jwtService.sign.mockReturnValue("mockToken");

        const result = service.getAccessToken({ user });

        expect(result).toEqual("mockToken");
    });
});
