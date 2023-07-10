import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DibsService } from "./dibs.service";
import { Dibs } from "./entities/dibs.entity";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { UpdateDibsInput } from "./dto/updateDibs.input";
import { IContext } from "src/commons/interfaces/context";

@Resolver()
export class DibsResolver {
    constructor(private readonly dibsService: DibsService) {}

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => Dibs, { nullable: true })
    fetchDibs(@Args("productId") productId: string, @Context() context: IContext): Promise<Dibs | null> {
        return this.dibsService.findOne(productId, context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => [Dibs])
    fetchDibses(
        @Context() context: IContext,
        @Args("page", { type: () => Int }) page: number,
        @Args("productId", { nullable: true }) productId?: string
    ): Promise<Dibs[]> {
        return this.dibsService.find(context.req.user.userId, page, productId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Query(() => Number)
    countDibses(@Context() context: IContext): Promise<number> {
        return this.dibsService.count(context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Dibs)
    createDibs(@Args("productId") productId: string, @Context() context: IContext): Promise<Dibs> {
        return this.dibsService.create(productId, context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Dibs)
    updateDibs(@Args("updateDibsInput") updateDibsInput: UpdateDibsInput, @Context() context: IContext): Promise<Dibs> {
        return this.dibsService.update(updateDibsInput, context.req.user.userId);
    }

    @UseGuards(GqlAuthGuard("access"))
    @Mutation(() => Boolean)
    deleteDibs(@Args("productId") productId: string, @Context() context: IContext): Promise<boolean> {
        return this.dibsService.delete(productId, context.req.user.userId);
    }
}
