import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { In, InsertResult, Repository } from 'typeorm';
import { IProductTagServiceBulkInsert } from './interface/product-tag-service.interface';

@Injectable()
export class ProductTagService {
    constructor(
        @InjectRepository(ProductTag)
        private readonly productTagRepository: Repository<ProductTag>,
    ) {}

    async findByNames(tagNames: string[]): Promise<ProductTag[]> {
        return await this.productTagRepository.find({
            where: { tagName: In([...tagNames]) },
        });
    }

    async bulkInsert({
        names,
    }: IProductTagServiceBulkInsert): Promise<InsertResult> {
        return await this.productTagRepository.insert([...names]);
    }

    async findOne(productTagId: string): Promise<ProductTag> {
        const result = await this.productTagRepository.findOne({
            where: { productTagId },
        });

        return result;
    }

    async findAll(): Promise<ProductTag[]> {
        return await this.productTagRepository.find();
    }

    async update(productTagId: string): Promise<ProductTag> {
        return await this.productTagRepository.save({
            productTagId,
        });
    }

    async delete(productTagId: string): Promise<boolean> {
        const result = await this.productTagRepository.softRemove({
            productTagId,
        });

        return result.deletedAt ? true : false;
    }
}
