# traffic-ticketing

# Install all dependencies

npm install

# Navigate to better-sqlite3 module

cd node_modules/better-sqlite3

# Return to project root

cd ../..

# Rebuild SQLite with proper permissions

sudo npm rebuild

# Initialize database with HR permissions

sudo npm run init-db

# Build for production

npm run build

# Start production server

npm start

# Run linting

npm run lint

# Start development server

npm run dev
