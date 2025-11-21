import { Injectable } from "@nestjs/common";
import {
  PaymentMethod,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import QRCode from "qrcode";

@Injectable()
export class ManualPaymentConfigService {
  constructor(private connection: TransactionalConnection) {}

  async findByCode(
    ctx: RequestContext,
    code: string
  ): Promise<PaymentMethod | null> {
    return this.connection
      .getRepository(ctx, PaymentMethod)
      .findOneByOrFail({ code: code });
  }

  async generateQr(data: string): Promise<string> {
    return await QRCode.toDataURL(data);
  }
}
