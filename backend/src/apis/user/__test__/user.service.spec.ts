import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../users.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

describe("UserService", () => {
    let service: UserService;
    let repo: Repository<User>;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
        user = new User();

        jest.spyOn(bcrypt, "hash").mockImplementation(() => Promise.resolve("hashedPassword"));
        jest.spyOn(repo, "save").mockResolvedValue(user);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("userService init", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("", async () => {
            const user = new User();
            jest.spyOn(repo, "findOne").mockResolvedValue(user);

            expect(await service.findOne("1")).toBe(user);
        });
    });

    describe("findOneByEmail", () => {
        it("", async () => {
            jest.spyOn(repo, "findOne").mockResolvedValue(user);

            expect(await service.findOneByEmail({ email: "testEmail@example.com" })).toBe(user);
        });
    });

    describe("create", () => {
        it("", async () => {
            const createUserInput = { email: "testEmail@example.com", password: "password", phoneNumber: "01012345678", userName: "testUser", age: 20 };
            jest.spyOn(service, "findOneByEmail").mockResolvedValue(null);

            expect(await service.create(createUserInput)).toBe(user);
        });
    });

    describe("update", () => {
        it("사용자 정보를 업데이트한다", async () => {
            const updateUserInput = { password: "newPassword", phoneNumber: "01098765432", userName: "newUser", age: 25 };
            jest.spyOn(service, "findOne").mockResolvedValue(user);
            expect(await service.update(updateUserInput, "1")).toBe(user);
        });
    });

    describe("updatePassword", () => {
        it("사용자 비밀번호를 업데이트한다", async () => {
            const updateUserPwdInput = { email: "testEmail@example.com", password: "newPassword", phoneNumber: "01012345678" };
            jest.spyOn(repo, "findOne").mockResolvedValue(user);

            expect(await service.updatePassword(updateUserPwdInput)).toBe(user);
        });
    });

    describe("findLoginUser", () => {
        it("로그인한 사용자를 찾아서 반환한다", async () => {
            jest.spyOn(repo, "findOne").mockResolvedValue(user);

            expect(await service.findLoginUser("testEmail@example.com")).toBe(user);
        });
    });

    describe("removeLoginUser", () => {
        it("로그인한 사용자를 삭제한다", async () => {
            jest.spyOn(repo, "softRemove").mockResolvedValue({ deletedAt: new Date() } as any);

            expect(await service.removeLoginUser("1")).toBe(true);
        });
    });
});
