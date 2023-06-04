import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dibs } from './entities/dibs.entity';
import { FindDibsInput } from './dto/findDibs.input';
import { CreateDibsInput } from './dto/createDibs.input';
import { DeleteDibsInput } from './dto/deleteDibs.input';
import { FindOneDibsInput } from './dto/findOneDibs.input';

@Injectable()
export class DibsService {
    constructor(
        @InjectRepository(Dibs)
        private readonly dibsRepository: Repository<Dibs>,
    ) {}

    async findOne(findOneDibsInput: FindOneDibsInput): Promise<Dibs> {
        const { productId, userId } = findOneDibsInput;

        return await this.dibsRepository
            .createQueryBuilder('dibs')
            .leftJoinAndSelect('dibs.product', 'dibsProduct')
            .leftJoinAndSelect('dibs.user', 'dibsUser')
            .where('dibsProduct.productId = :productId', { productId })
            .andWhere('dibsuser.userId = :userId', { userId })
            .getOne();
    }

    async find(findDibsInput: FindDibsInput): Promise<Dibs[]> {
        const { productId, userId } = findDibsInput;
        let result = [];
        if (productId && userId) {
            result = await this.dibsRepository
                .createQueryBuilder('dibs')
                .leftJoinAndSelect('dibs.product', 'dibsProduct')
                .leftJoinAndSelect('dibs.user', 'dibsUser')
                .where('dibsProduct.productId = :productId', { productId })
                .andWhere('dibsuser.userId = :userId', { userId })
                .getMany();
        } else if (productId) {
            result = await this.dibsRepository
                .createQueryBuilder('dibs')
                .leftJoinAndSelect('dibs.product', 'dibsProduct')
                .leftJoinAndSelect('dibs.user', 'dibsUser')
                .where('dibsProduct.productId = :productId', { productId })
                .getMany();
        } else if (userId) {
            result = await this.dibsRepository
                .createQueryBuilder('dibs')
                .leftJoinAndSelect('dibs.product', 'product')
                .leftJoinAndSelect('dibs.user', 'dibsuser')
                .where('dibsuser.userId = :userId', { userId })
                .getMany();
        } else {
            result = await this.dibsRepository.find({
                relations: ['product', 'user'],
            });
        }
        return result;
    }

    async create(createDibsInput: CreateDibsInput): Promise<Dibs> {
        const { productId, userId } = createDibsInput;

        await this.dibsRepository.save({
            user: { userId },
            product: { productId },
        });

        const result = await this.findOne(createDibsInput);

        return result;
    }

    async delete(deleteDibsInput: DeleteDibsInput): Promise<boolean> {
        const { productId, userId } = deleteDibsInput;
        const result = await this.dibsRepository.softDelete({
            product: { productId },
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
