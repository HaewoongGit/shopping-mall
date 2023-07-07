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

    async uploadFileForTransaction(uploadFileInput: UploadFileInput, queryRunner: QueryRunner): Promise<File> {
        const { file: filePromise, email, productId, userId } = uploadFileInput;
        const emailAddress = email.split("@");
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // JavaScript에서는 월을 0부터 시작하므로 1을 더해줍니다.
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        let publicURL = "";

        let file = await filePromise;

        // console.log("file의 내용: ", file);
        // console.log("file의 타입: ", typeof file);
        // console.log("filePromise의 타입: ", typeof filePromise);
        // console.log("file.createReadStream의 타입", typeof file.createReadStream);

        file.filename = emailAddress[0] + timestamp;

        // 1-1) 스토리지 셋팅하기
        const bucketName = "shopping-mall";
        const storage = new Storage({
            projectId: "utility-operand-388205",
            keyFilename: "./gcp-file-storage.json",
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

    async deleteFileForTransaction(fileName: string, queryRunner: QueryRunner): Promise<boolean> {
        const bucketName = "shopping-mall";
        const storage = new Storage({
            projectId: "utility-operand-388205",
            keyFilename: "./gcp-file-storage.json",
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

    async deleteFile(fileName: string): Promise<boolean> {
        const bucketName = "shopping-mall";
        const storage = new Storage({
            projectId: "utility-operand-388205",
            keyFilename: "./gcp-file-storage.json",
        }).bucket(bucketName);

        const file = storage.file(fileName);
        const [exists] = await file.exists();

        if (exists) {
            await file.delete();
            console.log(`${bucketName} 버킷의 ${fileName} 파일이 지워졌습니다.`);
            return true;
        } else {
            console.log(`${bucketName} 버킷에서 '${fileName}'라는 파일을 찾을 수 없습니다.`);
            return false;
        }
    }
}
