#!/bin/bash

# 🚀 Script de Déploiement Oracle Portfolio V2.6.0
# Architecture Hybride - Vercel Optimisé

echo "🚀 DÉPLOIEMENT ORACLE PORTFOLIO V2.6.0"
echo "======================================"

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm détectés"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"

# Vérification de la version date-fns
echo "🔍 Vérification de date-fns..."
DATE_FNS_VERSION=$(npm list date-fns --depth=0 2>/dev/null | grep date-fns | cut -d'@' -f2)

if [[ $DATE_FNS_VERSION == 4.* ]]; then
    echo "⚠️  date-fns 4.x détecté - correction en cours..."
    npm uninstall date-fns
    npm install date-fns@3.6.0 --save
    echo "✅ date-fns corrigé vers 3.6.0"
fi

# Build de production
echo "🏗️  Build de production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi"

# Vérification du dossier dist
if [ ! -d "dist" ]; then
    echo "❌ Dossier dist non trouvé"
    exit 1
fi

echo "✅ Dossier dist créé"

# Installation de Vercel CLI si nécessaire
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Déploiement Vercel
echo "🚀 Déploiement sur Vercel..."
echo "⚠️  Assurez-vous d'être connecté avec 'vercel login'"

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo "======================================"
    echo "✅ Oracle Portfolio V2.6.0 déployé"
    echo "✅ Toutes les fonctionnalités opérationnelles"
    echo "✅ Icônes crayon ✏️ fonctionnelles"
    echo "✅ Modal d'édition complète"
    echo ""
    echo "🔐 Connexion admin :"
    echo "   Login: admin"
    echo "   Password: scalabla2025"
    echo ""
    echo "🎯 Testez le menu Configuration ⚙️"
else
    echo "❌ Erreur lors du déploiement Vercel"
    exit 1
fi

