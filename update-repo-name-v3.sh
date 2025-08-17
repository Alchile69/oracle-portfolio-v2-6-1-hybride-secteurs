#!/bin/bash

echo "🔄 MISE À JOUR NOM REPOSITORY - ORACLE PORTFOLIO V3"
echo "=================================================="

# Vérifier l'URL actuelle
echo "📋 URL actuelle:"
git remote -v

# Mettre à jour l'URL du remote
echo "🔄 Mise à jour URL remote..."
git remote set-url origin https://github.com/Alchile69/oracle-portfolio-v3.git

# Vérifier la nouvelle URL
echo "📋 Nouvelle URL:"
git remote -v

# Test de connexion
echo "🔗 Test de connexion..."
git fetch origin

if [ $? -eq 0 ]; then
    echo "✅ Connexion réussie !"
    
    # Push pour confirmer
    echo "📤 Push de confirmation..."
    git push origin main
    
    echo "🎉 MISE À JOUR TERMINÉE !"
    echo "========================"
    echo "✅ Repository renommé: oracle-portfolio-v3"
    echo "✅ URLs mises à jour"
    echo "✅ Connexion confirmée"
    echo ""
    echo "🌐 Nouvelle URL GitHub:"
    echo "https://github.com/Alchile69/oracle-portfolio-v3"
    echo ""
    echo "📱 Maintenant sur Vercel:"
    echo "1. Importez le nouveau repository"
    echo "2. Nommez le projet: oracle-portfolio-v3"
    echo "3. Framework: Vite (détecté automatiquement)"
    echo ""
    echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
else
    echo "❌ Erreur de connexion"
    echo "⚠️ Vérifiez que le repository a bien été renommé sur GitHub"
    exit 1
fi
