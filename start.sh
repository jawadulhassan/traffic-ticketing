#!/bin/bash

echo "🚀 Starting Traffic Ticketing Annotation Tool Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Initializing database..."
npm run init-db

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "Demo credentials:"
echo "Email: demo@traffic.com"
echo "Password: demo123"
