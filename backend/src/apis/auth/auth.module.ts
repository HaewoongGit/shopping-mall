// auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [AuthController],
    providers: [
        JwtAccessStrategy,
        AuthResolver,
        AuthService,
        JwtRefreshStrategy,
        JwtGoogleStrategy,
    ],
})
export class AuthModule {}
