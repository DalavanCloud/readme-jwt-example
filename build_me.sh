#!/usr/bin/env bash

echo "Installing npm dependencies..."
npm install
echo "...done"

echo "Building JS..."
npm run build
echo "...done"
