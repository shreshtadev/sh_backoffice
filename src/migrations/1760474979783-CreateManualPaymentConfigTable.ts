import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateManualPaymentConfigTable1760474979783
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `manual_payment_config` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(144) NULL,`accountName` varchar(255) NULL, `accountNumber` varchar(255) NULL, `bankName` varchar(255) NULL, `ifsc` varchar(255) NULL, `upiId` varchar(255) NULL, `phone` varchar(255) NULL, `instructionsExtra` text NULL, `enabled` tinyint NOT NULL DEFAULT 1, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE `manual_payment_config`", undefined);
  }
}
