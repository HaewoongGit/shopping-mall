import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class File {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    fileId: string;

    @Column({ nullable: false, unique: true })
    @Field(() => String)
    fileName: string;

    @Column({ nullable: false, unique: true })
    @Field(() => String)
    fileURL: string;

    @ManyToOne(() => Product, (product) => product.files)
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @DeleteDateColumn()
    deletedAt: Date;
}
