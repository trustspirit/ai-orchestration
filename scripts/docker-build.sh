#!/bin/bash

# AI Orchestration Service - Docker Build Script
# This script builds the Docker images for the backend and frontend services.

set -e

echo "🔨 Building AI Orchestration Docker images..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Build shared packages first
echo "📦 Building shared packages..."
pnpm --filter @repo/shared build
pnpm --filter @repo/ui build

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build --no-cache

echo "✅ Docker images built successfully!"
echo ""
echo "To start the services, run:"
echo "  ./scripts/docker-up.sh"

