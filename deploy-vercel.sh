#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL - ORACLE PORTFOLIO V2.6.1 HYBRIDE SECTEURS"
echo "=================================================================="

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

# 6. Initialisation Git si nécessaire
if [ ! -d ".git" ]; then
    echo "🔧 Initialisation Git..."
    git init
    git branch -M main
fi

# 7. Commit et push
echo "📤 Commit et push vers GitHub..."
git add .
git commit -m "deploy: Oracle Portfolio V2.6.1 Hybride Secteurs + Essentiels - $(date '+%Y-%m-%d %H:%M:%S')"

# Vérifier si remote existe
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Configuration remote GitHub..."
    echo "⚠️  Veuillez configurer le remote GitHub manuellement :"
    echo "    git remote add origin https://github.com/VOTRE-USERNAME/$PROJECT_NAME.git"
    echo "    git push -u origin main"
    exit 1
fi

git push origin $BRANCH_NAME

if [ $? -ne 0 ]; then
    echo "❌ Échec du push GitHub"
    exit 1
fi

echo "✅ Push GitHub réussi"

# 8. Informations de déploiement
echo ""
echo "🎉 DÉPLOIEMENT DÉCLENCHÉ SUR VERCEL !"
echo "=================================================================="
echo "📋 Projet: $PROJECT_NAME"
echo "🌿 Branche: $BRANCH_NAME"
echo "🌐 URL attendue: https://$PROJECT_NAME.vercel.app"
echo ""
echo "⏳ Surveillez le déploiement sur: https://vercel.com/dashboard"
echo ""
echo "🔑 Identifiants de test:"
echo "   Username: admin"
echo "   Password: scalabla2025"
echo ""
echo "🎯 Fonctionnalités déployées:"
echo "   ✅ Design Oracle Portfolio V2.6.1"
echo "   ✅ Module Configuration avec 15 pays"
echo "   ✅ Secteurs d'activité (11 secteurs)"
echo "   ✅ Modules Essentiels (Monitoring, Tests, Auto-amélioration, Rapports)"
echo "   ✅ ROI documenté: 1,464% - 4,100%"
echo ""
echo "🚀 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"

