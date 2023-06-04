import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductTagModule } from '../productTag/productTag.module';
import { ProductCategoryModule } from '../productCategory/productCategory.module';
import { ProductTag } from '../productTag/entities/productTag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductTag]),
        UserModule,
        ProductTagModule,
        ProductCategoryModule,
    ],
    providers: [ProductResolver, ProductService],
    exports: [ProductService],
})
export class ProductModule {}
