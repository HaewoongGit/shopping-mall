import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    productCategoryId: string;

    @Column({ unique: true })
    @Field(() => String)
    categoryName: string;
}
