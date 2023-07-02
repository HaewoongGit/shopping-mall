import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsIn } from "class-validator";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    reviewId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @Column()
    @Field(() => String)
    reviewContent: string;

    @Column()
    @Field(() => Int)
    rating: number;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
