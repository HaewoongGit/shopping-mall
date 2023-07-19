import { Test, TestingModule } from "@nestjs/testing";
import { UserResolver } from "../users.resolver";
import { UserService } from "../users.service";
import { User } from "../entities/user.entity";
import { response as mockResponse } from "jest-mock-express";

describe("UserResolver", () => {
    let resolver: UserResolver;
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: {
                        findLoginUser: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        updatePassword: jest.fn(),
                        removeLoginUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<UserResolver>(UserResolver);
        service = module.get<UserService>(UserService);
    });

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

    describe("fetchUser", () => {
        it("", () => {
            expect(resolver.fetchUser(context)).toBe("인가에 성공하였습니다.");
        });
    });

    describe("fetchLoginUser", () => {
        it("", async () => {
            const user = new User();
            jest.spyOn(service, "findLoginUser").mockResolvedValue(user);

            expect(await resolver.fetchLoginUser(context)).toBe(user);
        });
    });

    describe("findUser", () => {
        it("", async () => {
            const user = new User();
            jest.spyOn(service, "findOne").mockResolvedValue(user);

            expect(await resolver.findUser("testEmail@example.com")).toBe(user);
        });
    });

    describe("createUser", () => {
        it("", async () => {
            const user = new User();
            const createUserInput = { email: "testEmail@example.com", password: "password", phoneNumber: "01012345678", userName: "testUser", age: 20 };
            jest.spyOn(service, "create").mockResolvedValue(user);

            expect(await resolver.createUser(createUserInput)).toBe(user);
        });
    });

    describe("updateUser", () => {
        it("", async () => {
            const user = new User();
            const updateUserInput = { password: "newPassword", phoneNumber: "01098765432", userName: "newUser", age: 25 };
            jest.spyOn(service, "update").mockResolvedValue(user);

            expect(await resolver.updateUser(updateUserInput, context)).toBe(user);
        });
    });

    describe("updateUserPwd", () => {
        it("", async () => {
            const user = new User();
            const updateUserPwdInput = { email: "testEmail@example.com", password: "newPassword", phoneNumber: "01012345678" };
            jest.spyOn(service, "updatePassword").mockResolvedValue(user);

            expect(await resolver.updateUserPwd(updateUserPwdInput, context)).toBe(user);
        });
    });

    describe("deleteLoginUser", () => {
        it("", async () => {
            jest.spyOn(service, "removeLoginUser").mockResolvedValue(true);

            expect(await resolver.deleteLoginUser(context)).toBe(true);
        });
    });
});
