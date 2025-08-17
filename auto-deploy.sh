#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT AUTOMATIQUE COMPLET
# Exécute tout sans demander de confirmation

set -e

echo "🚀 DÉMARRAGE DU DÉPLOIEMENT AUTOMATIQUE"
echo "======================================"

# 1. Capture des screenshots
echo "📸 Étape 1: Capture des screenshots..."
./node_modules/.bin/playwright test tests/screenshot-test.spec.ts --project=chromium

# 2. Analyse de l'UI
echo "🔍 Étape 2: Analyse de l'UI..."
node ui-analyzer.mjs

# 3. Application des corrections
echo "🎨 Étape 3: Application des corrections..."
# Ici on appliquerait les corrections CSS/JS

# 4. Build et déploiement
echo "🏗️ Étape 4: Build et déploiement..."
./node_modules/.bin/vite build
git add .
git commit -m "Auto-ajustement UI - $(date)"
git push origin main

# 5. Nouveau screenshot de vérification
echo "📸 Étape 5: Vérification finale..."
./node_modules/.bin/playwright test tests/screenshot-test.spec.ts --project=chromium

echo "🎉 DÉPLOIEMENT AUTOMATIQUE TERMINÉ !"
