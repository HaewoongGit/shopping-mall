// jwt-access.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_KEY,
        });
    }

    validate(payload) {
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}
