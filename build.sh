#!/bin/bash

# Run build command
echo "Building project..."
npm run build || { echo "Build failed"; exit 1; }

# Serve the dist folder
echo "Starting server..."
npx serve dist
