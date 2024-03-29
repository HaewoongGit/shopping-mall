// auth.resolver.ts

import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { IContext } from "src/commons/interfaces/context";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { LoginResponse } from "./dto/loginResponse.output";

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginResponse)
    login(@Args("email") email: string, @Args("password") password: string, @Context() context: IContext): Promise<object> {
        return this.authService.login({ email, password, context });
    }

    @UseGuards(GqlAuthGuard("refresh"))
    @Mutation(() => String)
    restoreAcessToken(@Context() context: IContext): string {
        return this.authService.restoreAccessToken({
            user: context.req.user,
        });
    }
}
