#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL HYBRIDE OPTIMISÉ - ORACLE PORTFOLIO"
echo "=========================================================="

# Variables
PROJECT_NAME="oracle-portfolio-v2-6-1-hybride-secteurs"
BRANCH_NAME="main"

# 1. Vérifications préalables
echo "🔍 Vérifications préalables..."

# Vérifier Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

# Vérifier que nous sommes dans un repo Git
if [ ! -d ".git" ]; then
    echo "❌ Pas dans un repository Git"
    exit 1
fi

# Vérifier la branche
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    echo "⚠️  Branche actuelle: $CURRENT_BRANCH"
    echo "🔄 Changement vers $BRANCH_NAME..."
    git checkout $BRANCH_NAME
fi

# 2. Nettoyage complet
echo "🧹 Nettoyage des caches..."
rm -rf node_modules package-lock.json .vite dist .vercel

# 3. Installation avec legacy peer deps
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Échec de l'installation des dépendances"
    exit 1
fi

# 4. Test de build local obligatoire
echo "🔨 Test de build local..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build local échoué ! Arrêt du déploiement."
    exit 1
fi
echo "✅ Build local réussi !"

# 5. Vérification des fichiers critiques
echo "🔍 Vérification des fichiers critiques..."
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json manquant"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json manquant"
    exit 1
fi

# Vérifier date-fns version
DATE_FNS_VERSION=$(grep '"date-fns"' package.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
if [[ "$DATE_FNS_VERSION" == ^4.* ]]; then
    echo "❌ date-fns version 4.x détectée. Utiliser 3.6.0"
    exit 1
fi

echo "✅ Fichiers critiques validés"

# 6. Configuration Vercel optimisée
echo "🔧 Configuration Vercel optimisée..."
./node_modules/.bin/vercel env add VERCEL_PROTECTION_BYPASS production
echo "true" | ./node_modules/.bin/vercel env add VERCEL_PROTECTION_BYPASS production

# 7. Commit et push
echo "📤 Commit et push vers GitHub..."
git add .
git commit -m "deploy: configuration Vercel optimisée - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin $BRANCH_NAME
if [ $? -ne 0 ]; then
    echo "❌ Échec du push GitHub"
    exit 1
fi
echo "✅ Push GitHub réussi"

# 8. Déploiement Vercel avec configuration optimisée
echo "🚀 Déploiement Vercel avec configuration optimisée..."
./node_modules/.bin/vercel --prod --force --yes
if [ $? -ne 0 ]; then
    echo "❌ Échec du déploiement Vercel"
    exit 1
fi

# 9. Informations de déploiement
echo ""
echo "🎉 DÉPLOIEMENT HYBRIDE OPTIMISÉ RÉUSSI !"
echo "========================================="
echo "📋 Projet: $PROJECT_NAME"
echo "🌿 Branche: $BRANCH_NAME"
echo "🌐 Vercel: Déployé avec configuration optimisée"
echo "🔓 Authentification: Désactivée pour les APIs"
echo ""
echo "⏳ Surveillez le déploiement sur: https://vercel.com/alain-poncelas-projects/$PROJECT_NAME/deployments"
echo ""
echo "🔑 Test des APIs:"
echo "   Vercel: https://$PROJECT_NAME-$(git rev-parse --short HEAD).vercel.app/api/regime"
echo "   Vercel: https://$PROJECT_NAME-$(git rev-parse --short HEAD).vercel.app/api/getIndicatorsBreakdown"
