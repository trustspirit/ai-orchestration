#!/bin/bash

# AI Orchestration Service - Docker Up Script
# This script starts the Docker containers for the backend and frontend services.

set -e

echo "🚀 Starting AI Orchestration services..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   Please edit .env file with your API keys."
    else
        echo "   Please create a .env file with your API keys."
    fi
fi

# Start services
docker-compose up -d

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:6200"
echo "   Backend:  http://localhost:6201"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:         ./scripts/docker-down.sh"
echo "   Restart:      docker-compose restart"

