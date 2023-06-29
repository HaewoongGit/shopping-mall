import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IOAuthUser } from "./interfaces/auth-service.interface";
import { User } from "../user/entities/user.entity";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard("google"))
    @Get("/login/google")
    async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response): Promise<User> {
        return this.authService.loginOAuth({ req, res });
    }
}
