// payment.entity.ts

import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINT_TRANSACTION_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
}

registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
    name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    paymentId: string;

    @Column()
    @Field(() => String)
    impUid: string;

    @Column()
    @Field(() => Int)
    paidAmount: number;

    @Column()
    @Field(() => Int)
    purchaseQuantity: number;

    @Column()
    @Field(() => String)
    deliveryAddr: string;

    @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
    @Field(() => POINT_TRANSACTION_STATUS_ENUM)
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    @Field(() => Product)
    product: Product;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;
}
