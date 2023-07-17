import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./commons/filter/http-exception.filter";
import { graphqlUploadExpress } from "graphql-upload";
import * as serveStatic from "serve-static";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    app.use(graphqlUploadExpress());
    app.use(
        serveStatic("public", {
            index: ["index.html"],
        })
    );
    await app.listen(3000);
}
bootstrap();
