# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate gRPC types (optional if needed)
RUN npm run proto:generate

# Build TypeScript
RUN npm run build