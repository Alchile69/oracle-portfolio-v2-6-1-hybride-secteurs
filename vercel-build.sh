#!/bin/bash

echo "🚀 VERCEL BUILD - ORACLE PORTFOLIO V3"
echo "====================================="

# Vérifier Node.js
echo "📦 Node.js version:"
node --version

# Vérifier npm
echo "📦 npm version:"
npm --version

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Vérifier le résultat
echo "📁 Contenu du dossier dist:"
ls -la dist/

echo "✅ VERCEL BUILD TERMINÉ !"
