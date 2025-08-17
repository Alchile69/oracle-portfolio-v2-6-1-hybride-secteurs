#!/bin/bash

echo "🧹 NETTOYAGE COMPLET NEXT.JS - STRUCTURE 2"
echo "=========================================="

# Supprimer les dépendances Next.js
echo "📦 Suppression dépendances Next.js..."
npm uninstall next @next/font @next/image @next/router next-themes

# Supprimer les fichiers Next.js s'ils existent
echo "🗑️ Suppression fichiers Next.js..."
rm -rf pages/
rm -rf api/
rm -rf .next/
rm -f next.config.js
rm -f next-env.d.ts

# Nettoyer le cache npm
echo "🧽 Nettoyage cache npm..."
npm cache clean --force

# Réinstaller les dépendances
echo "📦 Réinstallation dépendances..."
npm install

# Build de test
echo "🔨 Test build STRUCTURE 2..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    
    # Commit des changements
    echo "📝 Commit nettoyage Next.js..."
    git add .
    git commit -m "🧹 Nettoyage complet Next.js - STRUCTURE 2

✅ Suppression dépendances Next.js
✅ Suppression fichiers Next.js
✅ Nettoyage cache npm
✅ Build STRUCTURE 2 réussi

Version: 3.0.0
Architecture: Firebase + Vite + Cloud Run
Next.js: COMPLÈTEMENT SUPPRIMÉ"

    # Push vers GitHub
    echo "📤 Push vers GitHub..."
    git push origin main
    
    echo "🎉 NETTOYAGE TERMINÉ !"
    echo "======================"
    echo "✅ Next.js complètement supprimé"
    echo "✅ STRUCTURE 2 prête pour Vercel"
    echo "✅ Vercel détectera maintenant Vite"
    echo ""
    echo "🌐 Retournez sur Vercel et cliquez sur la flèche à côté de 'Next.js'"
    echo "📱 Sélectionnez 'Vite' dans le menu déroulant"
    echo ""
    echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
else
    echo "❌ Erreur lors du build"
    exit 1
fi
