import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CategoryName {
    Electronics = "가전디지털",
    Books = "도서",
    Food = "식품",
    Household = "생활용품",
    Stationery = "문구",
    Sports = "스포츠",
    clothes = "의류",
}

@Entity()
@ObjectType()
export class ProductCategory {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    productCategoryId: string;

    @Column({ type: "enum", enum: CategoryName })
    @Field(() => String)
    categoryName: CategoryName;
}
