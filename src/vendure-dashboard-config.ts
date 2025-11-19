import type { VendureConfig } from "@vendure/core";

import "dotenv/config";
import { join } from "node:path";
import { DashboardPlugin } from "@vendure/dashboard/plugin";
import { GstTaxesPlugin } from "./plugins/gst-taxes/gst-taxes.plugin";
import { ManualPaymentPlugin } from "./plugins/manual-payment/manual-payment.plugin";

const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
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
    type: "sqlite",
    database: ":memory:",
  },
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    DashboardPlugin.init({
      route: "dashboard",
      appDir: join(__dirname, "./dist"),
      viteDevServerPort: 5173,
    }),
    ManualPaymentPlugin.init({}),
    GstTaxesPlugin.init({}),
  ],
};

export { config };
