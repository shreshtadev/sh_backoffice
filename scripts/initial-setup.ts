import { config } from "../src/vendure-config"; // Adjust path to your vendure-config

// Ensure synchronize is set to true for this script run
const populateConfig = {
  ...config,
  dbConnectionOptions: {
    ...config.dbConnectionOptions,
    synchronize: true, // This creates the tables on run
  },
};
