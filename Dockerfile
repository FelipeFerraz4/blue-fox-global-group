# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Angular client and SSR server bundles
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built application from Stage 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose SSR port
EXPOSE 4000

# Set environment variables
ENV PORT=4000
ENV NODE_ENV=production

# Run the Express server
CMD ["node", "dist/blue-fox-global-group/server/server.mjs"]
