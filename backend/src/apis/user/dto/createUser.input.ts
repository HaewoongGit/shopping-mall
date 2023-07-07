import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEmail, IsInt, IsOptional, Matches, Min } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsEmail({}, { message: "이메일 양식이 맞지 않습니다." })
    email: string;

    @Field(() => String)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/, {
        message: "비밀번호는 영문과 숫자의 조합으로 6자 이상 15자 이하입니다.",
    })
    password: string;

    @Field(() => String)
    @Matches(/^010\d{8}$/, {
        message: "적절한 전화번호를 입력해 주십시오.",
    })
    phoneNumber: string;

    @Field(() => String)
    @Matches(/^[^\d]+$/, {
        message: "이름에 숫자는 올 수 없습니다.",
    })
    userName: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt({ message: "나이를 바르게 입력해주세요." })
    @Min(1, { message: "나이를 바르게 입력해주세요." })
    age: number;
}
