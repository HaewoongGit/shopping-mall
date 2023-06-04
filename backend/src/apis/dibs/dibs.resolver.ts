import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DibsService } from './dibs.service';
import { Dibs } from './entities/dibs.entity';
import { CreateDibsInput } from './dto/createDibs.input';
import { DeleteDibsInput } from './dto/deleteDibs.input';
import { FindDibsInput } from './dto/findDibs.input';
import { FindOneDibsInput } from './dto/findOneDibs.input';

@Resolver()
export class DibsResolver {
    constructor(private readonly dibsService: DibsService) {}

    @Query(() => Dibs)
    fetchDibs(
        @Args('findOneDibsInput') findOneDibsInput: FindOneDibsInput,
    ): Promise<Dibs> {
        return this.dibsService.findOne(findOneDibsInput);
    }

    @Query(() => [Dibs])
    fetchDibses(
        @Args('findDibsInput') findDibsInput: FindDibsInput,
    ): Promise<Dibs[]> {
        return this.dibsService.find(findDibsInput);
    }

    @Mutation(() => Dibs)
    createDibs(
        @Args('createDibsInput') createDibsInput: CreateDibsInput,
    ): Promise<Dibs> {
        return this.dibsService.create(createDibsInput);
    }

    @Mutation(() => Boolean)
    deleteDibs(
        @Args('deleteDibsInput') deleteDibsInput: DeleteDibsInput,
    ): Promise<boolean> {
        return this.dibsService.delete(deleteDibsInput);
    }
}
