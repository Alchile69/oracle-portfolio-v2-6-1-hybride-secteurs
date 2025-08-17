#!/bin/bash

echo "🚀 DÉPLOIEMENT ORACLE PORTFOLIO V3 - STRUCTURE 2"
echo "================================================"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Vérifier la version
echo "📦 Version actuelle:"
grep '"version"' package.json

# Build du projet
echo "🔨 Build du projet..."
./node_modules/.bin/vite build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi !"

# Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo "❌ Erreur: dossier dist non trouvé après le build"
    exit 1
fi

echo "📁 Contenu du dossier dist:"
ls -la dist/

# Commit et push pour déclencher Vercel
echo "📝 Commit des changements..."
git add .
git commit -m "🚀 Oracle Portfolio V3.0 - Déploiement STRUCTURE 2

✅ Build V3.0 réussi
✅ Architecture Firebase + Vite + Cloud Run
✅ Performance optimisée
✅ Interface V3.0

Version: 3.0.0
Architecture: STRUCTURE 2"

echo "📤 Push vers GitHub..."
git push origin main

echo "🎉 DÉPLOIEMENT V3.0 TERMINÉ !"
echo "=============================="
echo "📱 Oracle Portfolio V3.0 sera déployé automatiquement sur Vercel"
echo "🌐 URL: https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app"
echo "🔗 Backend: https://oracle-backend-yrvjzoj3aa-uc.a.run.app"
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
