import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { ProductTagResolver } from './productTag.resolver';
import { ProductTagService } from './productTag.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTag])],
    providers: [ProductTagResolver, ProductTagService],
    exports: [ProductTagService],
})
export class ProductTagModule {}
