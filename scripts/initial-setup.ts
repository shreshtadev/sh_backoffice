import * as path from "node:path";
import { bootstrap } from "@vendure/core";
import { populate } from "@vendure/core/cli";
import { config } from "../src/vendure-config"; // Adjust path to your vendure-config

// Define the path to the assets from @vendure/create
const initialDataPath = require.resolve(
  "@vendure/create/assets/initial-data.json",
);

// Ensure synchronize is set to true for this script run
const populateConfig = {
  ...config,
  dbConnectionOptions: {
    ...config.dbConnectionOptions,
    synchronize: true, // This creates the tables on run
  },
};

populate(() => bootstrap(populateConfig), require(initialDataPath))
  .then((app) => {
    console.log("Database schema created and populated with initial data!");
    return app.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error during database population:", err);
    process.exit(1);
  });
