import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { ProductCategory } from 'src/apis/productCategory/entities/productCategory.entity';
import { ProductTag } from 'src/apis/productTag/entities/productTag.entity';

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    productId: string;

    @Column({ nullable: false })
    @Field(() => String)
    productName: string;

    @Column('text')
    @Field(() => String)
    description: string;

    @Column({ nullable: false })
    @Field(() => Int)
    price: number;

    @Column({ nullable: false, default: false })
    @Field(() => Boolean)
    isSoldOut: boolean;

    @Column({ nullable: false, default: 0 })
    @Field(() => Int)
    hits: number;

    @Field(() => User)
    @JoinColumn({ name: 'userId' })
    @ManyToOne(() => User)
    user: User;

    @Field(() => ProductCategory)
    @JoinColumn({ name: 'productCategoryId' })
    @ManyToOne(() => ProductCategory)
    productCategory: ProductCategory;

    @JoinTable({
        name: 'product_productTag', // 중간 테이블 이름 설정
        joinColumn: {
            name: 'productId',
            referencedColumnName: 'productId',
        }, // 외래 키 컬럼 이름 설정
        inverseJoinColumn: {
            name: 'productTagId',
            referencedColumnName: 'productTagId',
        }, // 외래 키 컬럼 이름 설정
    })
    @ManyToMany(() => ProductTag, (productTags) => productTags.products)
    @Field(() => [ProductTag])
    productTags: ProductTag[];

    @DeleteDateColumn()
    deletedAt: Date;
}
