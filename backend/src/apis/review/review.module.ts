import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Review])],
    providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
