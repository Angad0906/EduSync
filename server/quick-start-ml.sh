#!/bin/bash

# Quick Start Script for ML-Enhanced Dynamic Scheduler
# This script sets up and starts the ML-enhanced scheduling system

echo "🚀 Quick Start: ML-Enhanced Dynamic Scheduler"
echo "=" .repeat(60)

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install ML dependencies
echo "🤖 Installing ML dependencies..."
npm install @tensorflow/tfjs-node ml-matrix ml-regression ml-kmeans ml-cross-validation

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
# ML Configuration
ML_MODEL_PATH=./ml/models/saved
ML_TRAINING_DATA_PATH=./ml/training/data
ML_ENABLED=true

# MongoDB Configuration (UPDATE THESE VALUES)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynamic-scheduler
ADMIN_ID=your-admin-id-here

# Server Configuration
PORT=3001
NODE_ENV=development
EOF
    echo "⚠️ Please update MONGODB_URI and ADMIN_ID in .env file"
fi

# Create ML directories
echo "📁 Creating ML directories..."
mkdir -p ml/models/saved
mkdir -p ml/training/data
mkdir -p ml/optimization
mkdir -p ml/utils
mkdir -p ml/test

# Run ML deployment
echo "🤖 Running ML deployment..."
node ml/training/deployML.js

# Test ML integration
echo "🧪 Testing ML integration..."
node ml/test/testMLIntegration.js

# Start the server
echo "🚀 Starting the server..."
echo "=" .repeat(60)
echo "✅ ML-Enhanced Dynamic Scheduler is ready!"
echo ""
echo "📋 Available endpoints:"
echo "   GET  /api/ml/status              - Check ML model status"
echo "   POST /api/ml/generate-schedule  - Generate ML-optimized schedule"
echo "   POST /api/ml/optimize-schedule   - Optimize existing schedule"
echo "   GET  /api/ml/suggestions/:id     - Get optimization suggestions"
echo "   POST /api/ml/score-schedule      - Score schedule quality"
echo "   POST /api/ml/train               - Train ML model"
echo ""
echo "🌐 Server will be available at: http://localhost:3001"
echo "📚 Documentation: ./ML_SCHEDULING_GUIDE.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=" .repeat(60)

# Start the server
npm run dev
