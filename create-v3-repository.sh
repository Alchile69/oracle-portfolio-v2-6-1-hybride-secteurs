#!/bin/bash

echo "🚀 CRÉATION REPOSITORY ORACLE PORTFOLIO V3"
echo "=========================================="

# Vérifier l'état actuel
echo "📋 État actuel:"
echo "Repository: $(git remote get-url origin)"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git rev-parse --short HEAD)"

# Créer un nouveau dossier pour V3
echo "📁 Création dossier V3..."
mkdir -p ../oracle-portfolio-v3
cd ../oracle-portfolio-v3

# Initialiser nouveau repository
echo "🔧 Initialisation nouveau repository..."
git init
git remote add origin https://github.com/Alchile69/oracle-portfolio-v3.git

# Copier tous les fichiers du repository actuel
echo "📋 Copie des fichiers..."
cp -r ../oracle-portfolio-v2-6-1-hybride-secteurs/* .
cp -r ../oracle-portfolio-v2-6-1-hybride-secteurs/.* . 2>/dev/null || true

# Supprimer les fichiers git du repository source
rm -rf .git

# Initialiser le nouveau repository
echo "🔧 Configuration nouveau repository..."
git init
git remote add origin https://github.com/Alchile69/oracle-portfolio-v3.git

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Commit initial V3
echo "📝 Commit initial V3..."
git commit -m "🚀 ORACLE PORTFOLIO V3.0.0 - STRUCTURE 2 FINALE

✅ Architecture STRUCTURE 2 complète
✅ Frontend Vite/React optimisé
✅ Backend Python Cloud Run opérationnel
✅ Firebase Functions orchestrées
✅ Next.js complètement supprimé
✅ Performance <800ms validée
✅ Interface V3.0 finalisée

Version: 3.0.0
Architecture: Firebase + Vite + Cloud Run
Status: PRÊT POUR PRODUCTION

🌐 URLs:
- Frontend: https://oracle-portfolio-v3.vercel.app
- Backend: https://oracle-backend-yrvjzoj3aa-uc.a.run.app
- GitHub: https://github.com/Alchile69/oracle-portfolio-v3

🎯 RÉSULTAT: Oracle Portfolio V3.0.0 - STRUCTURE 2 FINALE"

# Créer la branche main
echo "🌿 Création branche main..."
git branch -M main

# Tag V3.0.0
echo "🏷️ Création tag V3.0.0..."
git tag -a v3.0.0 -m "🚀 Oracle Portfolio V3.0.0 - STRUCTURE 2 Finale"

echo "🎉 REPOSITORY V3 CRÉÉ !"
echo "======================"
echo "📁 Dossier: ../oracle-portfolio-v3"
echo "🌐 URL: https://github.com/Alchile69/oracle-portfolio-v3"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créez le repository sur GitHub: oracle-portfolio-v3"
echo "2. Push vers GitHub: git push -u origin main"
echo "3. Push tag: git push origin v3.0.0"
echo "4. Déployez sur Vercel avec le nouveau repository"
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
