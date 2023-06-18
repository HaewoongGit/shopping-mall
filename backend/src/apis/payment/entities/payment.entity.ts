// payment.entity.ts

import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsPositive } from "class-validator";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum POINT_TRANSACTION_STATUS_ENUM {
    PAYMENT = "PAYMENT",
    CANCEL = "CANCEL",
}

registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
    name: "POINT_TRANSACTION_STATUS_ENUM",
});

@Entity()
@ObjectType()
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    paymentId: string;

    @Column({ unique: true })
    @Field(() => String)
    impUid: string;

    @Column({ unique: true })
    @Field(() => String)
    merchantUid: string;

    @Column()
    @Field(() => Int)
    @IsPositive()
    amount: number;

    @Column()
    @Field(() => String)
    deliveryAddress: string;

    @Column()
    @Field(() => String)
    contactNumber: string;

    @Column()
    @Field(() => String)
    orderInformation: string;

    @Column({ type: "enum", enum: POINT_TRANSACTION_STATUS_ENUM })
    @Field(() => POINT_TRANSACTION_STATUS_ENUM)
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    @Field(() => User)
    user: User;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    @Field(() => Date, { nullable: true })
    deletedAt: Date;
}
