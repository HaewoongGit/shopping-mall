// user.entity.ts

import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    userId: string;

    @Column({ unique: true })
    @Field(() => String)
    email: string;

    @Column()
    @Field(() => String)
    password: string;

    @Column({ nullable: true, default: "empty" })
    @Field(() => String)
    phoneNumber: string;

    @Column()
    @Field(() => String)
    userName: string;

    @Column({ nullable: true, default: 0 })
    @Field(() => Int, { nullable: true })
    age: number;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
