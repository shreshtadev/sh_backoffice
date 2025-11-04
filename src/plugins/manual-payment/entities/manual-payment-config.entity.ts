import { DeepPartial, HasCustomFields, VendureEntity } from "@vendure/core";
import { Column, Entity, Index } from "typeorm";

export class ManualPaymentConfigCustomFields {}

@Entity()
export class ManualPaymentConfig
  extends VendureEntity
  implements HasCustomFields
{
  constructor(input?: DeepPartial<ManualPaymentConfig>) {
    super(input);
  }

  @Column({ length: 144, nullable: true })
  code: string;

  @Column({ nullable: true })
  accountName: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  ifsc: string;

  @Column({ nullable: true })
  upiId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  instructionsExtra: string;

  @Column({ default: true })
  enabled: boolean;

  @Column((_) => ManualPaymentConfigCustomFields)
  customFields: ManualPaymentConfigCustomFields;
}
