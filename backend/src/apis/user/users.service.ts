// users.service.ts

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { CreateUserInput } from "./dto/createUser.input";
import { IUserServiceFindOneByEmail } from "./interfaces/user-service.interface";
import { UpdateUserPwdInput } from "./dto/updateUserPwd.input";
import { UpdateUserInput } from "./dto/updateUser.input";
import { log } from "console";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOne(userId: string) {
        const result = await this.userRepository.findOne({
            where: { userId },
        });

        return result;
    }

    async findOneByEmail({ email }: IUserServiceFindOneByEmail) {
        const result = await this.userRepository.findOne({
            where: { email },
        });

        return result;
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const { email, password } = createUserInput;

        const user = await this.findOneByEmail({ email });
        if (user) throw new ConflictException("이미 등록된 이메일입니다.");

        if (password === null) throw new ConflictException("비밀번호를 입력하세요.");

        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userRepository.save({
            ...createUserInput,
            password: hashedPassword,
        });
    }

    async update(updateUserInput: UpdateUserInput, userId: string): Promise<User> {
        const { password, phoneNumber, userName, age } = updateUserInput;

        const user = await this.findOne(userId);

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("뭐야 왜 출력이 안돼?");

        console.log("hashedPassword: ", hashedPassword);

        const result = await this.userRepository.save({
            ...user,
            ...updateUserInput,
            password: hashedPassword,
        });

        console.log("result 출력: ", result);

        return result;
    }

    async updatePassword(updateUserPwdInput: UpdateUserPwdInput): Promise<User> {
        const { email, password } = updateUserPwdInput;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) throw new NotFoundException("입력한 email을 찾을 수 없습니다.");

        const result = await this.userRepository.save({
            ...user,
            password: hashedPassword,
        });

        return result;
    }

    async findLoginUser(email: string): Promise<User> {
        const result = await this.userRepository.findOne({
            where: { email },
        });

        return result;
    }

    async removeLoginUser(userId: string): Promise<boolean> {
        const result = await this.userRepository.softRemove({
            userId,
        });

        return result.deletedAt ? true : false;
    }
}
