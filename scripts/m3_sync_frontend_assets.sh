#!/bin/bash
set -e

# Milestone 3 — Step A
# Sync frontend into android-app assets

ASSETS_DIR="android-app/app/src/main/assets/frontend"

mkdir -p "$ASSETS_DIR"
cp -r frontend/* "$ASSETS_DIR/"

echo "Milestone 3 Step A: Frontend synced to $ASSETS_DIR"
