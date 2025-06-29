# Stage 1: Build
FROM node:20 AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Generate proto files (optional)
# RUN npm run proto:generate

# Build TypeScript
RUN npm run build


# Stage 2: Production
FROM node:20-slim AS production

# Set working directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/proto ./src/proto
COPY --from=builder /usr/src/app/.env ./

# Expose port
EXPOSE 50051

# Run server
CMD ["node", "dist/server.js"]
