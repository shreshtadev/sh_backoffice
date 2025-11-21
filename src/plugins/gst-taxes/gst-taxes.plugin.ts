import {
  CustomFieldConfig,
  LanguageCode,
  PluginCommonModule,
  Type,
  VendurePlugin,
} from "@vendure/core";

import { GST_TAXES_PLUGIN_OPTIONS } from "./constants";
import { PluginInitOptions } from "./types";
import { GstTaxStrategy } from "./gst-tax-strategy";

const hsnSacField: CustomFieldConfig = {
  name: "hsnSac",
  type: "string" as const, // The 'as const' helps TypeScript infer the exact string literal type
  nullable: true,
  label: [{ languageCode: LanguageCode.en, value: "HSN / SAC Code" }],
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Must be 4, 6, or 8 characters if provided.",
    },
  ],
  // Add the custom validation function
  validate: (value: string | null) => {
    if (value === null || value === "") {
      // Allow null or empty string (if not null, it should be of length 4/6/8)
      return undefined; // undefined indicates success (no validation error)
    }

    const length = value.length;

    if (length === 4 || length === 6 || length === 8) {
      return undefined; // Success
    } else {
      // Return an error message if validation fails
      return "The HSN/SAC code must be 4, 6, or 8 characters long.";
    }
  },
};

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: GST_TAXES_PLUGIN_OPTIONS,
      useFactory: () => GstTaxesPlugin.options,
    },
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    config.taxOptions.taxLineCalculationStrategy = new GstTaxStrategy();
    config.customFields.ProductVariant.push(hsnSacField);
    config.customFields.Product.push(hsnSacField);
    return config;
  },
  compatibility: "^3.0.0",
})
export class GstTaxesPlugin {
  static options: PluginInitOptions;
  public _isInitialized = false;

  static init(options: PluginInitOptions): Type<GstTaxesPlugin> {
    GstTaxesPlugin.options = options;
    return GstTaxesPlugin;
  }
}
