import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./commons/filter/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    // app.enableCors({
    //     origin: "http://localhost:8080", // 요청을 보내는 클라이언트의 주소를 명시
    //     credentials: true,
    // });
    await app.listen(3000);
}
bootstrap();
