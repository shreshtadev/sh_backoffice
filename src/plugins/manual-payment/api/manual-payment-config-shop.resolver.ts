import { Args, Query, Resolver } from "@nestjs/graphql";
import { Permission } from "@vendure/common/lib/generated-types";
import {
  Allow,
  Ctx,
  Relations,
  RelationPaths,
  ListQueryOptions,
  PaginatedList,
  RequestContext,
  ConfigService,
} from "@vendure/core";
import { ManualPaymentConfig } from "../entities/manual-payment-config.entity";
import { ManualPaymentConfigService } from "../services/manual-payment-config.service";

@Resolver()
export class ManualPaymentConfigShopResolver {
  constructor(
    private manualPaymentConfigService: ManualPaymentConfigService,
    private configService: ConfigService
  ) {}

  @Query()
  @Allow(Permission.Public)
  async manualPaymentConfigByCode(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string }
  ): Promise<ManualPaymentConfig | null> {
    const foundHandler =
      this.configService.paymentOptions.paymentMethodHandlers.find(
        (handler) => handler.code == args.code
      );
    return this.manualPaymentConfigService.findByCode(ctx, foundHandler?.code!);
  }

  @Query()
  @Allow(Permission.Public)
  async manualPaymentConfigs(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<ManualPaymentConfig> },
    @Relations(ManualPaymentConfig)
    relations: RelationPaths<ManualPaymentConfig>
  ): Promise<PaginatedList<ManualPaymentConfig>> {
    return this.manualPaymentConfigService.findAll(
      ctx,
      args.options || undefined,
      relations
    );
  }
  @Query()
  @Allow(Permission.Public)
  async qrCode(@Args("data") data: string): Promise<string> {
    return this.manualPaymentConfigService.generateQr(data);
  }
}
