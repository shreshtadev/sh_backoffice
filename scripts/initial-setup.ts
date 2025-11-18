import { config } from "../src/vendure-config"; // Adjust path to your vendure-config
import { bootstrap } from "@vendure/core";
import { populate } from "@vendure/core/cli";

// Ensure synchronize is set to true for this script run
const populateConfig = {
  ...config,
  dbConnectionOptions: {
    ...config.dbConnectionOptions,
    synchronize: true, // This creates the tables on run
  },
};

populate(() => bootstrap(populateConfig), {})
  .then((app) => {
    console.log("Database schema created and populated with initial data!");
    return app.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error during database population:", err);
    process.exit(1);
  });
