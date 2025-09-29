#!/bin/bash

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install

# Build client
echo "Building client..."
npm run build

echo "Build completed successfully!"