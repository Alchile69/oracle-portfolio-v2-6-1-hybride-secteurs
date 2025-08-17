#!/bin/bash

echo "🚀 CRÉATION NOUVEAU PROJET VERCEL - ORACLE PORTFOLIO V3"
echo "======================================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    exit 1
fi

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi !"

# Créer un fichier de configuration pour nouveau projet
echo "📝 Création configuration nouveau projet..."
cat > vercel-new.json << EOF
{
  "name": "oracle-portfolio-v3",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

# Créer un commit pour nouveau projet
echo "📝 Commit pour nouveau projet..."
git add .
git commit -m "🚀 Nouveau Projet Vercel - Oracle Portfolio V3

✅ Configuration Vercel alternative
✅ Build testé et validé
✅ Prêt pour nouveau déploiement

Version: 3.0.0
Architecture: STRUCTURE 2
Nouveau projet: oracle-portfolio-v3"

# Push vers GitHub
echo "📤 Push vers GitHub..."
git push origin main

echo "🎉 NOUVEAU PROJET PRÊT !"
echo "========================"
echo "📱 Pour créer un nouveau projet Vercel:"
echo "1. Allez sur https://vercel.com/new"
echo "2. Importez le repository GitHub"
echo "3. Nommez le projet: oracle-portfolio-v3"
echo "4. Framework: Vite"
echo "5. Build Command: npm run build"
echo "6. Output Directory: dist"
echo ""
echo "🌐 Nouvelle URL sera: https://oracle-portfolio-v3.vercel.app"
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
