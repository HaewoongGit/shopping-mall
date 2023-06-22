import { Module } from "@nestjs/common";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./entities/file.entity";

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    providers: [
        FileResolver, //
        FileService,
    ],
    exports: [FileService],
})
export class FileModule {}
