import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DibsResolver } from './dibs.resolver';
import { DibsService } from './dibs.service';
import { Dibs } from './entities/dibs.entity';
import { Product } from '../product/entities/product.entity';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Dibs, Product, ProductTag, User]),
        UserModule,
        ProductModule,
    ],
    providers: [DibsResolver, DibsService],
})
export class DibsModule {}
