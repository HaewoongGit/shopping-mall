import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDB1684498384679 implements MigrationInterface {
    name = 'updateDB1684498384679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dibs\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`dibs\` ADD PRIMARY KEY (\`member_id\`, \`campground_id\`)`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD PRIMARY KEY (\`campground_id\`)`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD \`member_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD PRIMARY KEY (\`campground_id\`, \`member_id\`)`);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD \`member_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`review\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD PRIMARY KEY (\`campground_id\`)`);
        await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`review\` ADD \`member_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`review\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD PRIMARY KEY (\`campground_id\`, \`member_id\`)`);
        await queryRunner.query(`ALTER TABLE \`campground\` ADD CONSTRAINT \`FK_9668e2c5569a5160cf12fe6f53c\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dibs\` ADD CONSTRAINT \`FK_e2f6e4af15c7a834cc8f49ce06f\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD CONSTRAINT \`FK_40b5cf653e8aa21d351d8fd336c\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_0f5d6689f3c4880b4ced581e87b\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_ac708cb4df027ea963e9e4c2977\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_ac708cb4df027ea963e9e4c2977\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_0f5d6689f3c4880b4ced581e87b\``);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP FOREIGN KEY \`FK_40b5cf653e8aa21d351d8fd336c\``);
        await queryRunner.query(`ALTER TABLE \`dibs\` DROP FOREIGN KEY \`FK_e2f6e4af15c7a834cc8f49ce06f\``);
        await queryRunner.query(`ALTER TABLE \`campground\` DROP FOREIGN KEY \`FK_9668e2c5569a5160cf12fe6f53c\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD PRIMARY KEY (\`campground_id\`)`);
        await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`review\` ADD \`member_id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`review\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD PRIMARY KEY (\`campground_id\`, \`member_id\`)`);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD \`member_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD PRIMARY KEY (\`campground_id\`)`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP COLUMN \`member_id\``);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD \`member_id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD PRIMARY KEY (\`campground_id\`, \`member_id\`)`);
        await queryRunner.query(`ALTER TABLE \`dibs\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`dibs\` ADD PRIMARY KEY (\`campground_id\`)`);
    }

}
