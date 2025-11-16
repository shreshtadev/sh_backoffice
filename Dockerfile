# -------------------------------------
# STAGE 1: Build
# This stage installs dependencies and builds the production assets.
# -------------------------------------
FROM node:24.11.1 as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install all dependencies (dev and prod, as build might need dev deps)
RUN npm install

# Copy source code and run the build process
COPY . .
RUN npm run build

# -------------------------------------
# STAGE 2: Production Runtime
# This stage uses a slim image and only copies necessary files for execution.
# -------------------------------------
FROM node:24.11.1-slim as production

# Set the working directory
WORKDIR /usr/src/app

# 1. Copy necessary runtime dependencies from the builder stage
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

# 2. Copy the built assets and package files
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY package.json ./

# 3. ADD THE PRODUCTION .ENV FILE HERE
# Ensure you create a file named .env.production next to your Dockerfile
COPY .env.production .env

# Expose the application port
EXPOSE 3000

# Set the default command to start the application (assuming Vendure uses `start`)
CMD ["npm", "run", "start"]
