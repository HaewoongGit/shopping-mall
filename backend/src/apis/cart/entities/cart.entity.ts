import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Cart {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    cartId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @Column({ nullable: false })
    @Field(() => Int)
    quantity: number;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
