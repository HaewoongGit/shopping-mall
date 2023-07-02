import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Dibs {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    dibsId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
