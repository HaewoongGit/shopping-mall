import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import {
    IProductCategoryServiceCreate,
    IProductCategoryServiceUpdate,
} from './interfaces/product-category-service.interface';

@Injectable()
export class ProductCategoryService {
    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,
    ) {}

    findOne(categoryName: string): Promise<ProductCategory> {
        return this.productCategoryRepository.findOne({
            where: { categoryName },
        });
    }

    create({
        categoryName,
    }: IProductCategoryServiceCreate): Promise<ProductCategory> {
        return this.productCategoryRepository.save({ categoryName });
    }

    update({
        productCategoryId,
        categoryName,
    }: IProductCategoryServiceUpdate): Promise<ProductCategory> {
        return this.productCategoryRepository.save({
            productCategoryId,
            categoryName,
        });
    }
}
