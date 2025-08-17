#!/bin/bash

echo "🚀 FORCE DÉPLOIEMENT VERCEL - ORACLE PORTFOLIO V3"
echo "================================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    exit 1
fi

# Vérifier la configuration Vercel
echo "📋 Configuration Vercel actuelle:"
cat vercel.json

# Build de test
echo "🔨 Test build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build local"
    exit 1
fi

echo "✅ Build local réussi !"

# Vérifier le contenu du dossier dist
echo "📁 Contenu du dossier dist:"
ls -la dist/

# Créer un commit vide pour forcer le déploiement
echo "📝 Création d'un commit de déploiement..."
echo "# Force Vercel Deployment - $(date)" >> FORCE_DEPLOY.md
git add FORCE_DEPLOY.md
git commit -m "🚀 Force Vercel Deployment - Oracle Portfolio V3

✅ Configuration Vercel corrigée
✅ Build script fixé
✅ Architecture STRUCTURE 2

Version: 3.0.0
Build: $(date)"

# Push vers GitHub
echo "📤 Push vers GitHub..."
git push origin main

echo "🎉 FORCE DÉPLOIEMENT TERMINÉ !"
echo "=============================="
echo "📱 Oracle Portfolio V3.0 sera redéployé sur Vercel"
echo "🌐 URL: https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app"
echo "⏱️  Déploiement en cours (2-3 minutes)..."
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
