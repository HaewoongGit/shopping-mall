import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductsCategoriesResolver } from './productCategory.resolver';
import { ProductCategoryService } from './productCategory.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductCategory])],
    providers: [ProductsCategoriesResolver, ProductCategoryService],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
