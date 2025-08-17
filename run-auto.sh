#!/bin/bash

echo "🚀 EXÉCUTION AUTOMATIQUE SANS CONFIRMATION"
echo "=========================================="

# Exécution directe des commandes
echo "📸 Capture des screenshots..."
./node_modules/.bin/playwright test tests/screenshot-test.spec.ts --project=chromium

echo "🔍 Analyse de l'UI..."
node ui-analyzer.mjs

echo "🏗️ Build de l'application..."
./node_modules/.bin/vite build

echo "✅ TERMINÉ !"
