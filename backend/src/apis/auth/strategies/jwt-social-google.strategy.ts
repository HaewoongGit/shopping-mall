import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

export class JwtGoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/login/google",
            scope: ["email", "profile"],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: Profile) {
        const randomNumber: string = Math.random().toString().slice(2, 12);

        return {
            accessToken,
            userName: profile.displayName,
            email: profile.emails[0].value,
            password: randomNumber,
        };
    }
}
