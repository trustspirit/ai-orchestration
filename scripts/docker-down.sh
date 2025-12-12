#!/bin/bash

# AI Orchestration Service - Docker Down Script
# This script stops and removes the Docker containers.

set -e

echo "🛑 Stopping AI Orchestration services..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Stop and remove containers
docker-compose down

echo "✅ Services stopped successfully!"

