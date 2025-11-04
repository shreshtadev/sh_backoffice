import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedHsnSacFields1760555060534 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsHsnsac` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_variant` ADD `customFieldsHsnsac` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `manual_payment_config` CHANGE `enabled` `enabled` tinyint NOT NULL DEFAULT 1", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `manual_payment_config` CHANGE `enabled` `enabled` tinyint NULL", undefined);
        await queryRunner.query("ALTER TABLE `product_variant` DROP COLUMN `customFieldsHsnsac`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsHsnsac`", undefined);
   }

}
