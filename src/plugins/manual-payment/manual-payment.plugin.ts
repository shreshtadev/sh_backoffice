import {
  CustomFieldConfig,
  LanguageCode,
  PluginCommonModule,
  type Type,
  VendurePlugin,
} from "@vendure/core";

import { shopApiExtensions } from "./api/api-extensions";
import { ManualPaymentConfigShopResolver } from "./api/manual-payment-config-shop.resolver";
import { MANUAL_PAYMENT_PLUGIN_OPTIONS } from "./constants";
import { ManualPaymentConfigService } from "./services/manual-payment-config.service";
import type { PluginInitOptions } from "./types";

const accountNameField: CustomFieldConfig = {
  name: "accountName",
  label: [{ languageCode: LanguageCode.en, value: "Account Name" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The account name for the payment method",
    },
  ],
};
const accountNumberField: CustomFieldConfig = {
  name: "accountNumber",
  label: [{ languageCode: LanguageCode.en, value: "Account Number" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The account number for the payment method",
    },
  ],
  validate: (value: string) => {
    if (value === "") {
      return "Invalid Account Number";
    }
    const regex = /^\d{9,18}$/;
    return regex.test(value) ? undefined : "Invalid Account Number";
  },
};
const bankNameField: CustomFieldConfig = {
  name: "bankName",
  label: [{ languageCode: LanguageCode.en, value: "Bank Name" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The bank name for the payment method",
    },
  ],
};

const bankBranchField: CustomFieldConfig = {
  name: "branchName",
  label: [{ languageCode: LanguageCode.en, value: "Bank Branch" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The bank branch for the payment method",
    },
  ],
};
const ifscField: CustomFieldConfig = {
  name: "ifscCode",
  label: [{ languageCode: LanguageCode.en, value: "IFSC Code" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The IFSC code for the payment method",
    },
  ],
  validate: (value: string) => {
    if (value === null || value === "") {
      return undefined;
    }
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(value) ? undefined : "Invalid IFSC";
  },
};

const upiIdField: CustomFieldConfig = {
  name: "upiId",
  label: [{ languageCode: LanguageCode.en, value: "UPI ID" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The UPI ID for the payment method",
    },
  ],
  validate: (value: string) => {
    if (value === null || value === "") {
      return undefined;
    }
    const regex = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9]{2,64}$/;
    return regex.test(value) ? undefined : "Invalid UPI ID";
  },
};

const phoneField: CustomFieldConfig = {
  name: "contactNumber",
  label: [{ languageCode: LanguageCode.en, value: "Phone Number" }],
  type: "string" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "The phone number for the payment method",
    },
  ],
  validate: (value: string) => {
    if (value === null || value === "") {
      return undefined;
    }
    const regex = /^\d{10}$/;
    return regex.test(value) ? undefined : "Invalid phone number";
  },
};

const extraInstructionsField: CustomFieldConfig = {
  name: "extraInstructions",
  label: [{ languageCode: LanguageCode.en, value: "Extra Instructions" }],
  type: "text" as const,
  nullable: true,
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Any additional instructions for the payment method",
    },
  ],
};

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
    config.customFields.PaymentMethod.push(phoneField);
    config.customFields.PaymentMethod.push(upiIdField);
    config.customFields.PaymentMethod.push(accountNameField);
    config.customFields.PaymentMethod.push(accountNumberField);
    config.customFields.PaymentMethod.push(bankNameField);
    config.customFields.PaymentMethod.push(bankBranchField);
    config.customFields.PaymentMethod.push(ifscField);
    config.customFields.PaymentMethod.push(extraInstructionsField);

    return config;
  },
  compatibility: "^3.0.0",
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ManualPaymentConfigShopResolver],
  },
})
export class ManualPaymentPlugin {
  static options: PluginInitOptions;
  public _isInitialized = false;
  static init(options: PluginInitOptions): Type<ManualPaymentPlugin> {
    ManualPaymentPlugin.options = options;
    return ManualPaymentPlugin;
  }
}
