import {
  type CancelPaymentErrorResult,
  type CancelPaymentResult,
  type CreatePaymentErrorResult,
  type CreatePaymentResult,
  LanguageCode,
  type PaymentMethod,
  PaymentMethodHandler,
  type RequestContext,
  type SettlePaymentErrorResult,
  type SettlePaymentResult,
} from "@vendure/core";
import { ManualPaymentConfigService } from "./manual-payment-config.service";

/**
 * Helper to render instructions string
 */
function buildInstructions(cfg?: Partial<PaymentMethod>): string {
  if (!cfg || !cfg.customFields) return "";
  const parts: string[] = [];
  if (cfg.customFields.accountName)
    parts.push(`Account name: ${cfg.customFields.accountName}`);
  if (cfg.customFields.accountNumber)
    parts.push(`Account number: ${cfg.customFields.accountNumber}`);
  if (cfg.customFields.bankName)
    parts.push(`Bank: ${cfg.customFields.bankName}`);
  if (cfg.customFields.branchName)
    parts.push(`Branch: ${cfg.customFields.branchName}`);
  if (cfg.customFields.ifscCode)
    parts.push(`IFSC: ${cfg.customFields.ifscCode}`);
  if (cfg.customFields.upiId) parts.push(`UPI ID: ${cfg.customFields.upiId}`);
  if (cfg.customFields.contactNumber)
    parts.push(`Contact phone: ${cfg.customFields.contactNumber}`);
  if (cfg.customFields.extraInstructions)
    parts.push(cfg.customFields.extraInstructions);
  parts.push(
    "Please transfer the exact order amount and include your Order ID in the payment reference.",
  );
  return parts.join("\n");
}

/**
 * PaymentMethodHandler factory which reads the DB-stored config at runtime via ctx.injector.
 * Uses the newer PaymentMethodHandler shape (code, description, args, createPayment, settlePayment, cancelPayment).
 */
let manualPaymentService: ManualPaymentConfigService;
export const createManualPaymentHandler: PaymentMethodHandler =
  new PaymentMethodHandler({
    code: "manual-bank-transfer",
    description: [
      {
        languageCode: LanguageCode.en,
        value: "Manual bank transfer / UPI",
      },
    ],
    args: {},

    /**
     * Eligibility checker: Vendure will call eligiblePaymentMethods which in turn
     * will call this function to determine if the method should be shown.
     * We implement an isEligible check that inspects the persisted config via DI.
     */
    init(injector) {
      manualPaymentService = injector.get(ManualPaymentConfigService);
    },

    /**
     * createPayment is invoked when the Shop calls addPaymentToOrder with method: 'manual-bank-transfer'.
     * We put the full human-readable instructions into metadata.public so the Shop API can display it.
     * We return state Authorized so settlement can be done later by admin after verification.
     */
    createPayment: async (
      ctx: RequestContext,
      order,
      amount,
      _args,
      _metadata,
      method,
    ): Promise<CreatePaymentResult | CreatePaymentErrorResult> => {
      const svc = manualPaymentService;
      const cfg = await svc.findByCode(ctx, method.code);
      const instructions = buildInstructions(cfg || {});

      // If disabled, return an error result
      if (!cfg || cfg.enabled === false) {
        return {
          errorMessage: "Payment method is not enabled",
        } as CreatePaymentErrorResult;
      }

      return {
        amount,
        state: "Authorized",
        transactionId: `MANUAL-${order.code}-${Date.now()}`,
        metadata: {
          // private metadata (admin-only)
          method: "manual-bank-transfer",
          orderCode: order.code,
          // public metadata the storefront can display
          public: {
            instructions,
          },
        },
      } as CreatePaymentResult;
    },

    /**
     * settlePayment is invoked when admin calls settlePayment on a Payment.
     * For manual transfers this should be triggered by admin after verifying the receipt.
     */
    settlePayment: async (
      ctx,
      order,
      payment,
      args,
    ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
      // No external provider to call; the admin will trigger this once funds are confirmed.
      return { success: true };
    },

    /**
     * cancelPayment / refund behavior for manual payments
     */
    cancelPayment: async (
      ctx,
      order,
      payment,
      args,
    ): Promise<CancelPaymentResult | CancelPaymentErrorResult> => {
      // No external cancellation possible; mark as cancelled in Vendure
      return { success: true };
    },
  });
