import { CustomProductFields } from "@vendure/core/dist/entity/custom-entity-fields";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions { }
declare module "@vendure/core/dist/entity/custom-entity-fields" {
  interface CustomPaymentMethodFields {
    bankName: string;
    branchName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    contactNumber: string;
    extraInstructions: string;
  }
}
