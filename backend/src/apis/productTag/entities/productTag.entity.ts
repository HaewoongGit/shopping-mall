import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class ProductTag {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    productTagId: string;

    @ManyToMany(() => Product, (products) => products.productTags)
    @Field(() => [Product])
    products: Product[];

    @Column({ nullable: false })
    @Field(() => String)
    tagName: string;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
