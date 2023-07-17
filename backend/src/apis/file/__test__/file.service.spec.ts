import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "../entities/file.entity";
import { FileService } from "../file.service";

jest.mock("@google-cloud/storage", () => {
    const file = {
        exists: jest.fn().mockResolvedValue([true]),
        delete: jest.fn().mockResolvedValue([]),
        createWriteStream: jest.fn().mockReturnThis(),
    };

    const MockedStorage = jest.fn().mockImplementation(() => {
        return {
            bucket: jest.fn().mockReturnThis(),
            file: jest.fn().mockReturnValue(file),
            createWriteStream: jest.fn().mockReturnThis(),
            on: jest.fn().mockImplementation(function (this, event, callback) {
                if (event === "finish") {
                    callback();
                }
                return this;
            }),
        };
    });

    return {
        Storage: MockedStorage,
    };
});

describe("FileService", () => {
    let service: FileService;
    let repo: Repository<File>;
    let fileRepo;
    let queryRunner;
    let storage;
    let expected = true;

    const fileName = "testFile";
    const expectedFile = new File();
    const foundFile = new File();
    foundFile.fileId = "testFileId";

    const uploadFileInput = {
        file: {
            createReadStream: jest.fn(),
            filename: fileName,
        },
        email: "testEmail",
        productId: "testProductId",
        userId: "testUserId",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileService,
                {
                    provide: getRepositoryToken(File),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(foundFile),
                        save: jest.fn().mockResolvedValue(expectedFile),
                        softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
                    },
                },
            ],
        }).compile();

        service = module.get<FileService>(FileService);
        repo = module.get<Repository<File>>(getRepositoryToken(File));

        storage = new (require("@google-cloud/storage").Storage)();

        fileRepo = {
            findOne: jest.fn().mockResolvedValue(foundFile),
            save: jest.fn().mockResolvedValue(expectedFile),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
        };

        queryRunner = {
            manager: {
                getRepository: jest.fn().mockReturnValue(fileRepo),
            },
        };
    });

    uploadFileInput.file.createReadStream = jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (this, event, callback) {
            if (event === "finish") {
                callback();
            }
            return this;
        }),
    });

    it("fileService init", () => {
        expect(service).toBeDefined();
    });

    describe("uploadFileForTransaction", () => {
        it("", async () => {
            jest.spyOn(repo, "save").mockResolvedValue(expectedFile);

            const result = await service.uploadFileForTransaction(uploadFileInput, queryRunner as any);
            expect(result).toEqual(expectedFile);
        });
    });

    describe("updateFileForTransaction", () => {
        it("", async () => {
            const result = await service.updateFileForTransaction(uploadFileInput, queryRunner as any);
            expect(result).toEqual(expectedFile);
        });
    });

    describe("deleteFileForTransaction", () => {
        it("", async () => {
            fileRepo.softDelete = jest.fn().mockResolvedValue({ affected: 1 });
            const result = await service.deleteFileForTransaction(fileName, queryRunner as any);
            expect(result).toEqual(expected);
        });
    });

    describe("deleteFile", () => {
        it("", async () => {
            const result = await service.deleteFile(fileName);
            expect(result).toEqual(expected);
        });
    });
});
