import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";

import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import { ManualPaymentConfigAdminResolver } from "./api/manual-payment-config-admin.resolver";
import { MANUAL_PAYMENT_PLUGIN_OPTIONS } from "./constants";
import { ManualPaymentConfig } from "./entities/manual-payment-config.entity";
import { PluginInitOptions } from "./types";
import { ManualPaymentConfigService } from "./services/manual-payment-config.service";
import { ManualPaymentConfigShopResolver } from "./api/manual-payment-config-shop.resolver";
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: MANUAL_PAYMENT_PLUGIN_OPTIONS,
      useFactory: () => ManualPaymentPlugin.options,
    },
    ManualPaymentConfigService,
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    return config;
  },
  compatibility: "^3.0.0",
  entities: [ManualPaymentConfig],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ManualPaymentConfigAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ManualPaymentConfigShopResolver],
  },
})
export class ManualPaymentPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<ManualPaymentPlugin> {
    this.options = options;
    return ManualPaymentPlugin;
  }
}
