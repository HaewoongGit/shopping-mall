import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./commons/filter/http-exception.filter";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.enableCors({
    //     origin: "http://localhost:8080",
    //     credentials: true,
    // });
    app.useGlobalFilters(new HttpExceptionFilter());
    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         exceptionFactory: (errors) => {
    //             const messages = errors.map((error) => Object.values(error.constraints).join(", "));
    //             return new BadRequestException(messages.join(" "));
    //         },
    //     })
    // );
    app.use(graphqlUploadExpress());
    await app.listen(3000);
}
bootstrap();
