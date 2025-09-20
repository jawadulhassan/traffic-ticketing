#!/bin/bash

echo "🚀 Starting Traffic Ticketing Annotation Tool (Simple Mode)..."
echo ""

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null || true

echo "📦 Installing dependencies without optional packages..."
npm install --no-optional --no-audit --no-fund

echo ""
echo "🔧 Setting environment variables..."
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

echo ""
echo "🌐 Starting development server..."
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "Email: demo@traffic.com"
echo "Password: demo123"
echo ""
echo "If you see SWC warnings, the app should still work!"
echo ""

# Start with specific flags to avoid SWC issues
npx next dev --port 3000 --hostname localhost
