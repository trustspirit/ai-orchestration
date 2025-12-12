#!/bin/bash

# AI Orchestration Service - Docker Logs Script
# This script shows logs from the running containers.

# Navigate to project root
cd "$(dirname "$0")/.."

# Default to following all logs
SERVICE="${1:-}"

if [ -n "$SERVICE" ]; then
    echo "📋 Showing logs for $SERVICE..."
    docker-compose logs -f "$SERVICE"
else
    echo "📋 Showing logs for all services..."
    docker-compose logs -f
fi

