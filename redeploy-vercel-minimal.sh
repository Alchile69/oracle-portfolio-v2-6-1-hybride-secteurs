#!/bin/bash

echo "🚀 REDÉPLOIEMENT VERCEL MINIMAL - ORACLE PORTFOLIO V3"
echo "====================================================="

# Vérifier la configuration actuelle
echo "📋 Configuration Vercel actuelle:"
cat vercel.json

# Build de test
echo "🔨 Test build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi !"

# Créer un commit avec un timestamp unique
TIMESTAMP=$(date +%s)
echo "📝 Création d'un commit unique..."
echo "# Redéploiement Vercel - $(date) - Timestamp: $TIMESTAMP" >> REDEPLOY_$TIMESTAMP.md
git add .
git commit -m "🚀 Redéploiement Vercel Minimal - Oracle Portfolio V3

✅ Configuration Vercel simplifiée
✅ Build testé localement
✅ Timestamp: $TIMESTAMP

Version: 3.0.0
Architecture: STRUCTURE 2"

# Push vers GitHub
echo "📤 Push vers GitHub..."
git push origin main

echo "🎉 REDÉPLOIEMENT TERMINÉ !"
echo "=========================="
echo "📱 Oracle Portfolio V3.0 sera redéployé sur Vercel"
echo "🌐 URL: https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app"
echo "⏱️  Déploiement en cours..."
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
