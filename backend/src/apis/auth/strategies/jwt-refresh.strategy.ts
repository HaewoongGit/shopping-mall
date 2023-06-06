// jwt-refresh.strategy.ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
    constructor() {
        super({
            jwtFromRequest: (req) => {
                console.log("쿠키 추을려억!", req.headers.cookie);

                const cookie = req.headers.cookie;

                const refreshToken = cookie.replace("refreshToken=", "");
                return refreshToken;
            },
            secretOrKey: process.env.JWT_REFRESH_KEY,
        });
    }

    validate(payload) {
        return {
            userId: payload.sub,
        };
    }
}
