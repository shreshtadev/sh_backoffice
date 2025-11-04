import {
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { GraphiqlPlugin } from "@vendure/graphiql-plugin";
import "dotenv/config";
import path from "path";
import { ManualPaymentPlugin } from "./plugins/manual-payment/manual-payment.plugin";
import { createManualPaymentHandler } from "./plugins/manual-payment/services/manual-payment-handler";
import { GstTaxesPlugin } from "./plugins/gst-taxes/gst-taxes.plugin";
import { DashboardPlugin } from "@vendure/dashboard/plugin";
const IS_DEV = process.env.APP_ENV === "dev";
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
  apiOptions: {
    port: serverPort,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    trustProxy: IS_DEV ? false : 1,
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiDebug: true,
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    type: "mariadb",
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: false,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  paymentOptions: {
    paymentMethodHandlers: [createManualPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    GraphiqlPlugin.init(),
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : "http://127.0.0.1:3000/assets/",
    }),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(
        path.join(__dirname, "../static/email/templates"),
      ),
      globalTemplateVars: {
        globalTemplateVars: {
          // The following variables will change depending on your storefront implementation.
          // Here we are assuming a storefront running at http://localhost:8080.
          fromAddress: '"noreply" <noreply@shreshtasmg.in>',
          verifyEmailAddressUrl: "http://localhost:8080/verify",
          passwordResetUrl: "http://localhost:8080/password-reset",
          changeEmailAddressUrl:
            "http://localhost:8080/verify-email-address-change",
        },
      },

      // ⬇️ Production/Deployment Configuration ⬇️
      // In production (IS_DEV is false), use a real SMTP transport.
      ...(IS_DEV
        ? {
            devMode: true,
            outputPath: path.join(__dirname, "../static/email/test-emails"),
          }
        : {
            // ⚠️ IMPORTANT: Replace with your actual production SMTP details ⚠️
            transport: {
              type: "smtp",
              host: process.env.SMTP_HOST || "smtp.your-provider.com",
              port: +process.env.SMTP_PORT || 587,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
            },
          }),
    }),
    DashboardPlugin.init({
      route: "dashboard",
    }),
    ManualPaymentPlugin.init({}),
    GstTaxesPlugin.init({}),
  ],
};
