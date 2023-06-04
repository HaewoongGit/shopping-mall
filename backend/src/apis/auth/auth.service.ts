import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    IAuthServiceGetAccessToken,
    IAuthServiceLogin,
    IAuthServiceLoginOAuth,
    IAuthServiceRestoreAccessToken,
    IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, //

        private readonly userService: UserService,
    ) {}

    async login({
        email,
        password,
        context,
    }: IAuthServiceLogin): Promise<string> {
        const user = await this.userService.findOneByEmail({ email });

        if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new UnprocessableEntityException('암호가 틀렸습니다.');

        this.setRefreshToken({ user, res: context.res });

        return this.getAccessToken({ user });
    }

    async loginOAuth({ req, res }: IAuthServiceLoginOAuth) {
        let user = await this.userService.findOneByEmail({
            email: req.user.email,
        });

        console.log('user 출력: ', user);

        if (!user) user = await this.userService.create({ ...req.user });

        this.setRefreshToken({ user, res });
        res.redirect(
            'http://127.0.0.1:5500/campmoa/frontend/social-login.html',
        );
    }

    restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
        return this.getAccessToken({ user });
    }

    setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.userId },
            { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
        );

        res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    }

    getAccessToken({ user }: IAuthServiceGetAccessToken): string {
        return this.jwtService.sign(
            { sub: user.userId, email: user.email },
            { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
        );
    }
}
