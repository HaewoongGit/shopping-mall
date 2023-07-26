// auth.service.ts

import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
    IAuthServiceGetAccessToken,
    IAuthServiceLogin,
    IAuthServiceLoginOAuth,
    IAuthServiceRestoreAccessToken,
    IAuthServiceSetRefreshToken,
    IOAuthUser,
} from "./interfaces/auth-service.interface";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/users.service";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, //

        private readonly userService: UserService
    ) {}

    async login({ email, password, context }: IAuthServiceLogin): Promise<object> {
        const user = await this.userService.findOneByEmail({ email });

        if (!user) throw new UnprocessableEntityException("이메일이 없습니다.");

        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth) throw new UnprocessableEntityException("암호가 틀렸습니다.");

        this.setRefreshToken({ user, res: context.res });

        const token = this.getAccessToken({ user });

        return { token: token, userId: user.userId };
    }

    async loginOAuth({ req, res }: IAuthServiceLoginOAuth): Promise<User> {
        let user = await this.userService.findOneByEmail({
            email: req.user.email,
        });

        if (!user) user = await this.userService.create({ ...req.user, userName: req.user.userName });

        const token = await this.getAccessToken({ user });
        await this.setRefreshToken({ user, res });
        res.redirect(`${process.env.DOMAIN_NAME}/?token=${token}`);

        return user;
    }

    restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
        return this.getAccessToken({ user });
    }

    setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
        const refreshToken = this.jwtService.sign({ email: user.email, sub: user.userId }, { secret: process.env.JWT_REFRESH_KEY, expiresIn: "2w" });

        res.setHeader("Set-Cookie", `refreshToken=${refreshToken}; path=/;`);
    }

    getAccessToken({ user }: IAuthServiceGetAccessToken): string {
        return this.jwtService.sign({ sub: user.userId, email: user.email }, { secret: process.env.JWT_ACCESS_KEY, expiresIn: "1h" });
    }
}
