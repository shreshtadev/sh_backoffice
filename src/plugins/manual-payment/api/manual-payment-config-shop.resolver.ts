import { Args, Query, Resolver } from "@nestjs/graphql";
import { Permission } from "@vendure/common/lib/generated-types";
import {
  Allow,
  Ctx,
  PaymentMethod,
  RequestContext
} from "@vendure/core";
import { ManualPaymentConfigService } from "../services/manual-payment-config.service";

@Resolver()
export class ManualPaymentConfigShopResolver {
  constructor(
    private manualPaymentConfigService: ManualPaymentConfigService,
  ) { }

  @Query()
  @Allow(Permission.Public)
  async manualPaymentConfigByCode(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string },
  ): Promise<PaymentMethod | null> {
    return this.manualPaymentConfigService.findByCode(ctx, args.code);
  }

  @Query()
  @Allow(Permission.Public)
  async qrCode(@Args("data") data: string): Promise<string> {
    return this.manualPaymentConfigService.generateQr(data);
  }
}
