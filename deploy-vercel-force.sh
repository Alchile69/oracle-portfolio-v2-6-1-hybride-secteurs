#!/bin/bash

echo "🚀 Déploiement forcé sur Vercel..."

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Build local pour tester
echo "📦 Build local..."
npm run build

# Déploiement forcé
echo "🌐 Déploiement forcé sur Vercel..."
vercel --prod --force

echo "✅ Déploiement terminé !"
echo "🔗 Vérifiez votre application sur Vercel"
