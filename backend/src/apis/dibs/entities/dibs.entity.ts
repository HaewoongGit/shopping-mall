import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Dibs {
    @ManyToOne(() => User)
    @PrimaryColumn({ name: 'userId' })
    @JoinColumn({ name: 'userId' })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product)
    @PrimaryColumn({ name: 'productId' })
    @JoinColumn({ name: 'productId' })
    @Field(() => Product)
    product: Product;

    @DeleteDateColumn()
    deletedAt: Date;
}
