#!/bin/bash
# start-prod.sh

# --- Vendure Production Startup Script ---

# 1. Check if the .env file exists
ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "🚨 Error: .env file not found at $ENV_FILE"
    exit 1
fi

echo "🚀 Loading environment variables from $ENV_FILE and starting Vendure in Production mode..."

# 2. Read .env file line-by-line and export as environment variables
# This handles comments (#) and exports all key=value pairs.
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.* ]] || [[ -z "$key" ]] && continue

  # Remove leading/trailing quotes from value (optional but good practice)
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

  # Export the variable to the current shell environment
  export "$key=$value"
done < "$ENV_FILE"

# 3. Explicitly set APP_ENV to 'prod' to ensure the correct mode is loaded
# This will override the value in .env if it was set to 'dev'
export APP_ENV="prod"
# 4. Run the production build startup script
pnpm run start-prod

echo "✨ Vendure production processes stopped."
