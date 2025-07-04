# Use Node.js 20 LTS Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies needed for native modules and proto compilation
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    protobuf \
    protobuf-dev

# Set working directory
WORKDIR /usr/src/app

# Copy package files for better layer caching
COPY package*.json ./

# Stage 1: Dependencies
FROM base AS dependencies

# Install all dependencies (including dev dependencies for building)
RUN npm ci --include=dev

# Stage 2: Build
FROM dependencies AS builder

# Copy source code
COPY . .

# Generate proto files if needed
RUN npm run proto:generate || echo "Proto generation skipped"

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Stage 3: Production
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy proto files (needed at runtime)
COPY --from=builder /usr/src/app/src/proto ./src/proto

# Don't copy .env file - use environment variables instead
# COPY --from=builder /usr/src/app/.env ./

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /usr/src/app
USER nodeuser

# Expose the gRPC port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const grpc = require('@grpc/grpc-js'); const client = new grpc.Client('localhost:3001', grpc.credentials.createInsecure()); client.waitForReady(Date.now() + 1000, (err) => process.exit(err ? 1 : 0));" || exit 1

# Start the application
CMD ["node", "dist/server.js"]