// file.service.ts

import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";
import { UploadFileInput } from "./dto/createFile.input";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./entities/file.entity";
import { QueryRunner, Repository } from "typeorm";
import { error } from "console";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>
    ) {}

    async uploadFile(uploadFileInput: UploadFileInput, queryRunner: QueryRunner): Promise<File> {
        const { file, email, productId, userId } = uploadFileInput;
        const emailAddress = email.split("@");
        const now = new Date();
        let publicURL = "";

        file.filename = emailAddress[0] + now;

        // 1-1) 스토리지 셋팅하기
        const bucketName = "shopping-mall";
        const storage = new Storage({
            projectId: "utility-operand-388205",
            keyFilename: "/Users/lhw/Documents/GitHub/gcp-file-storage.json",
        }).bucket(bucketName);

        // 1-2) 스토리지에 파일 올리기
        await new Promise((resolve, reject) => {
            file.createReadStream()
                .pipe(storage.file(file.filename).createWriteStream())
                .on("finish", () => {
                    publicURL = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(file.filename)}`;
                    resolve(publicURL);
                })
                .on("error", (error) => {
                    console.log("실패:", error);
                    reject(error);
                });
        });

        return await queryRunner.manager.getRepository(File).save({
            fileName: file.filename,
            fileURL: publicURL,
            product: { productId },
            user: { userId },
        });
    }

    async deleteFile(fileName: string, queryRunner: QueryRunner): Promise<boolean> {
        const bucketName = "shopping-mall";
        const storage = new Storage({
            projectId: "utility-operand-388205",
            keyFilename: "/Users/lhw/Documents/GitHub/gcp-file-storage.json",
        }).bucket(bucketName);

        const file = storage.file(fileName);
        const [exists] = await file.exists();

        if (exists) {
            await file.delete();
            console.log(`${bucketName} 버킷의 ${fileName} 파일이 지워졌습니다.`);
        } else {
            console.log(`${bucketName} 버킷에서 '${fileName}'라는 파일을 찾을 수 없습니다.`);
        }

        const result = await queryRunner.manager.getRepository(File).softDelete({
            fileName,
        });

        return result.affected ? true : false;
    }
}
