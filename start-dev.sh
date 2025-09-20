#!/bin/bash

echo "🚀 Starting Traffic Ticketing Annotation Tool..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install --no-optional

echo ""
echo "🔧 Fixing npm cache permissions..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "🌐 Starting development server..."
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "Email: demo@traffic.com"
echo "Password: demo123"
echo ""

npm run dev
