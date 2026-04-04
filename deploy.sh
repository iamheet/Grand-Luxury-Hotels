#!/bin/bash

# Azure deployment script for Node.js
echo "Starting Azure deployment script..."

# Navigate to the app directory
cd /home/site/wwwroot

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Start the application
echo "Starting the application..."
exec node server.js