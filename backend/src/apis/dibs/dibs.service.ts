import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Dibs } from "./entities/dibs.entity";
import { UpdateDibsInput } from "./dto/updateDibs.input";
import { ProductService } from "../product/product.service";

@Injectable()
export class DibsService {
    constructor(
        @InjectRepository(Dibs)
        private readonly dibsRepository: Repository<Dibs>,

        private readonly productService: ProductService
    ) {}

    async findOne(productId: string, userId: string): Promise<Dibs | null> {
        const result = await this.dibsRepository
            .createQueryBuilder("dibs")
            .leftJoinAndSelect("dibs.product", "dibsProduct")
            .leftJoinAndSelect("dibsProduct.files", "productFiles")
            .leftJoinAndSelect("dibs.user", "dibsUser")
            .where("dibsProduct.productId = :productId", { productId })
            .andWhere("dibsuser.userId = :userId", { userId })
            .getOne();

        return result;
    }

    async find(userId?: string, page: number = 1, productId?: string): Promise<Dibs[]> {
        let result = [];
        const limit = 10;
        const skip = (page - 1) * limit;

        if (productId && userId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsUser")
                .where("dibsProduct.productId = :productId", { productId })
                .andWhere("dibsuser.userId = :userId", { userId })
                .skip(skip)
                .take(limit)
                .getMany();
        } else if (productId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsUser")
                .where("dibsProduct.productId = :productId", { productId })
                .skip(skip)
                .take(limit)
                .getMany();
        } else if (userId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsuser")
                .where("dibsuser.userId = :userId", { userId })
                .skip(skip)
                .take(limit)
                .getMany();
        } else {
            result = await this.dibsRepository.find({
                relations: ["product", "user", "product.files"],
                skip,
                take: limit,
            });
        }
        return result;
    }

    async count(userId: string): Promise<number> {
        const result = await this.dibsRepository
            .createQueryBuilder("dibs")
            .innerJoin("dibs.user", "user")
            .where("user.userId = :userId", { userId })
            .andWhere("dibs.isDibs = :isDibs", { isDibs: true })
            .getCount();

        return result;
    }

    async create(productId: string, userId: string): Promise<Dibs> {
        await this.dibsRepository.save({
            user: { userId },
            product: { productId },
        });

        const result = await this.findOne(productId, userId);

        return result;
    }

    async update(updateDibsInput: UpdateDibsInput, userId: string): Promise<Dibs> {
        const { productId, isDibs } = updateDibsInput;

        const productCheck = await this.productService.findOne(productId);

        if (!productCheck) throw new NotFoundException("해당 제품을 찾을 수 없습니다.");

        const result = await this.dibsRepository.save({
            user: { userId },
            product: { productId },
            isDibs,
        });

        return result;
    }

    async delete(productId: string, userId: string): Promise<boolean> {
        const result = await this.dibsRepository.softDelete({
            product: { productId },
            user: { userId },
        });

        return result.affected ? true : false;
    }
}
