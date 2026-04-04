#!/bin/bash
# Simple deployment script

echo "🚀 Preparing backend for deployment..."

# Navigate to backend directory
cd backend

# Install production dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Create deployment zip
echo "📁 Creating deployment package..."
zip -r ../backend-deploy.zip . -x "node_modules/.cache/*" "*.log" ".env"

echo "✅ Deployment package created: backend-deploy.zip"
echo "📤 Upload this file manually to Azure App Service"