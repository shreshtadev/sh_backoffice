import {MigrationInterface, QueryRunner} from "typeorm";

export class PaymentMethodConfigFields1763707279851 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsContactnumber` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsUpiid` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsAccountname` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsAccountnumber` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsBankname` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsBranchname` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsIfsccode` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` ADD `customFieldsExtrainstructions` longtext NULL", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsExtrainstructions`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsIfsccode`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsBranchname`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsBankname`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsAccountnumber`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsAccountname`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsUpiid`", undefined);
        await queryRunner.query("ALTER TABLE `payment_method` DROP COLUMN `customFieldsContactnumber`", undefined);
   }

}
