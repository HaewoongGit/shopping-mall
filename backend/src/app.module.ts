import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { DibsModule } from "./apis/dibs/dibs.module";
import { AuthModule } from "./apis/auth/auth.module";
import { UserModule } from "./apis/user/user.module";
import { ReviewModule } from "./apis/review/review.module";
import { ProductCategoryModule } from "./apis/productCategory/productCategory.module";
import { PaymentModule } from "./apis/payment/payment.module";
import { CartModule } from "./apis/cart/cart.module";
import { ProductTagModule } from "./apis/productTag/productTag.module";
import { ProductModule } from "./apis/product/product.module";

@Module({
    imports: [
        UserModule,
        DibsModule,
        AuthModule,
        ProductModule,
        ReviewModule,
        ProductCategoryModule,
        PaymentModule,
        CartModule,
        ProductTagModule,
        ConfigModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: "src/commons/graphql/schema.gql",
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: process.env.DATABASE_TYPE as "mysql",
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            entities: [__dirname + "/apis/**/*.entity.*"],
            synchronize: true,
            logging: true,
        }),
    ],
})
export class AppModule {}
