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

    async find(userId?: string, productId?: string): Promise<Dibs[]> {
        let result = [];
        if (productId && userId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsUser")
                .where("dibsProduct.productId = :productId", { productId })
                .andWhere("dibsuser.userId = :userId", { userId })
                .getMany();
        } else if (productId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsUser")
                .where("dibsProduct.productId = :productId", { productId })
                .getMany();
        } else if (userId) {
            result = await this.dibsRepository
                .createQueryBuilder("dibs")
                .leftJoinAndSelect("dibs.product", "dibsProduct")
                .leftJoinAndSelect("dibsProduct.files", "productFiles")
                .leftJoinAndSelect("dibs.user", "dibsuser")
                .where("dibsuser.userId = :userId", { userId })
                .getMany();
        } else {
            result = await this.dibsRepository.find({
                relations: ["product", "user", "product.files"],
            });
        }
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
