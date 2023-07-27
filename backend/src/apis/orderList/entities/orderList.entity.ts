import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsPositive, Matches } from "class-validator";
import { Payment } from "src/apis/payment/entities/payment.entity";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class OrderList {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    orderListId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    @Field(() => Product)
    product: Product;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Payment, (payment) => payment.impUid)
    @JoinColumn({ name: "impUid", referencedColumnName: "impUid" })
    @Field(() => Payment)
    payment: Payment;

    @Column()
    @Field(() => Int)
    orderQuantity: Number;

    @Column()
    @Field(() => String)
    deliveryAddress: string;

    @Matches(/^010\d{8}$/, {
        message: "올바른 번호를 입력해주세요!",
    })
    @Column()
    @Field(() => String)
    contactNumber: string;

    @Column()
    @Field(() => Int)
    @IsPositive()
    price: Number;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    @Field(() => Date, { nullable: true })
    deletedAt: Date;
}
