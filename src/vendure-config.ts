import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import {
  AutoIncrementIdStrategy,
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  RedisCachePlugin,
  UuidIdStrategy,
  type VendureConfig,
} from "@vendure/core";
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from "@vendure/email-plugin";
import { GraphiqlPlugin } from "@vendure/graphiql-plugin";
import "dotenv/config";
import path, { join } from "node:path";
import { DashboardPlugin } from "@vendure/dashboard/plugin";
import { HardenPlugin, type HardenPluginOptions } from "@vendure/harden-plugin";
import { GstTaxesPlugin } from "./plugins/gst-taxes/gst-taxes.plugin";
import { ManualPaymentPlugin } from "./plugins/manual-payment/manual-payment.plugin";
import { createManualPaymentHandler } from "./plugins/manual-payment/services/manual-payment-handler";

const IS_DEV = process.env.APP_ENV === "dev";
const ASSET_HOST = process.env.VENDURE_ASSET_HOST || `http://localhost:3000`;
const STOREFRONT_HOST =
  process.env.VENDURE_STOREFRONT_HOST || "http://localhost:8080";
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "").split(",");

const hardenOptions: HardenPluginOptions = {
  // Primary limits
  maxQueryComplexity: 5000, // baseline production value (tune later)
  // Enable complexity logging during tuning; set to false in steady-state prod
  logComplexityScore: IS_DEV, // true in dev/staging; false in production by default

  // Hide GraphQL field suggestions (prevents schema enum/field probing)
  hideFieldSuggestions: !IS_DEV,

  // 'prod' disables introspection and playground; 'dev' leaves them enabled
  apiMode: IS_DEV ? "dev" : "prod",
};
const config: VendureConfig = {
  entityOptions: {
    entityIdStrategy: IS_DEV
      ? new AutoIncrementIdStrategy()
      : new UuidIdStrategy(),
  },
  apiOptions: {
    port: IS_DEV ? 3000 : 443,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    trustProxy: IS_DEV ? false : 1,
    cors: {
      origin: ALLOWED_HOSTS,
      credentials: true,
    },
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
    HardenPlugin.init(hardenOptions),
    GraphiqlPlugin.init(),
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : `${ASSET_HOST}/assets/`,
    }),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(
        path.join(__dirname, "../static/email/templates")
      ),
      globalTemplateVars: {
        globalTemplateVars: {
          // The following variables will change depending on your storefront implementation.
          // Here we are assuming a storefront running at http://localhost:8080.
          fromAddress: '"noreply" <noreply@shreshtasmg.in>',
          verifyEmailAddressUrl: `${STOREFRONT_HOST}/verify`,
          passwordResetUrl: `${STOREFRONT_HOST}/password-reset`,
          changeEmailAddressUrl: `${STOREFRONT_HOST}/verify-email-address-change`,
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
              type: "none",
              // host: process.env.SMTP_HOST || "smtp.your-provider.com",
              // port: +process.env.SMTP_PORT || 587,
              // auth: {
              //   user: process.env.SMTP_USER,
              //   pass: process.env.SMTP_PASSWORD,
              // },
            },
          }),
    }),
    DashboardPlugin.init({
      route: "dashboard",
      appDir: join(__dirname, "../dashboard/dist"),
      viteDevServerPort: 5173,
    }),
    ManualPaymentPlugin.init({}),
    GstTaxesPlugin.init({}),
  ],
};

if (!IS_DEV) {
  config.plugins?.push(
    RedisCachePlugin.init({
      redisOptions: {
        host: process.env.REDIS_HOST || "localhost",
        port: +process.env.REDIS_PORT || 6379,
        socketTimeout: 30000,
      },
    })
  );
}

export { config };
