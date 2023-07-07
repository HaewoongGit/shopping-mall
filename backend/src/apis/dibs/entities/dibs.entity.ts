import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Dibs {
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

    @Column({ default: true })
    @Field(() => Boolean)
    isDibs: boolean;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;
}
