// users.resolver.ts

import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UseGuards } from "@nestjs/common";
import { IContext } from "src/commons/interfaces/context";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CreateUserInput } from "./dto/createUser.input";
import { UserService } from "./users.service";
import { UpdateUserPwdInput } from "./dto/updateUserPwd.input";
import { UpdateUserInput } from "./dto/updateUser.input";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService //
    ) {}

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => String)
    fetchUser(@Context() context: IContext): string {
        console.log("================");
        console.log(context.req.user);
        console.log("================");
        return "인가에 성공하였습니다.";
    }

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => User)
    fetchLoginUser(@Context() context: IContext): Promise<User> {
        return this.userService.findLoginUser(context.req.user.email);
    }

    @Query(() => User)
    findUser(@Args("email") email: string): Promise<User> {
        return this.userService.findOne(email);
    }

    @Mutation(() => User)
    createUser(@Args("createUserInput") createUserInput: CreateUserInput): Promise<User> {
        return this.userService.create(createUserInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => User)
    updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput, @Context() context: IContext): Promise<User> {
        return this.userService.update(updateUserInput, context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => User)
    updateUserPwd(@Args("updateUserPwdInput") updateUserPwdInput: UpdateUserPwdInput, @Context() context: IContext): Promise<User> {
        console.log("================");
        console.log(context.req.user);
        console.log("================");
        return this.userService.updatePassword(updateUserPwdInput);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Boolean)
    deleteLoginUser(@Context() context: IContext): Promise<boolean> {
        return this.userService.removeLoginUser(context.req.user.userId);
    }
}
