import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Cart {
    @ManyToOne(() => User)
    @PrimaryColumn({ name: "userId" })
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @PrimaryColumn({ name: "productId" })
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @Column({ nullable: false })
    @Field(() => Int)
    quantity: number;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;
}
