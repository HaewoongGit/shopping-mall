// // payments.resolver.ts

// import { UseGuards } from '@nestjs/common';
// import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
// import { IContext } from 'src/commons/interfaces/context';
// import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
// import { Payment } from './entities/payment.entity';
// import { PointsTransactionsService } from './payment.service';

// @Resolver()
// export class PointsTransactionsResolver {
//     constructor(
//         private readonly pointsTransactionsService: PointsTransactionsService,
//     ) {}

//     @UseGuards(GqlAuthGuard('access'))
//     @Mutation(() => Payment)
//     createPayment(
//         @Args('impUid') impUid: string, //
//         @Args({ name: 'amount', type: () => Int }) amount: number,
//         @Context() context: IContext,
//     ): Promise<void> {
//         const user = context.req.user;
//         return this.pointsTransactionsService.create({ impUid, amount, user });
//     }
// }
