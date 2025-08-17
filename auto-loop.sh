#!/bin/bash

# 🚀 SCRIPT DE BOUCLE AUTOMATIQUE - PAS DE CONFIRMATION REQUISE

echo "🚀 DÉMARRAGE DE LA BOUCLE AUTOMATIQUE"
echo "===================================="

# Boucle infinie avec auto-exécution
while true; do
    echo "🔄 Exécution automatique de npm run auto-ui..."
    
    # Exécution directe sans confirmation
    npm run auto-ui
    
    echo "⏳ Attente de 30 secondes avant la prochaine exécution..."
    sleep 30
done
