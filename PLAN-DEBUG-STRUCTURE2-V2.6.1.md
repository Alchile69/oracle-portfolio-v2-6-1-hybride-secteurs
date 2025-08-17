# 🚀 PLAN DE DEBUG STRUCTURE 2 - V2.6.1
## Architecture Firebase + Vite + Cloud Run

---

## 📋 **CONTEXTE STRUCTURE 2**
- **Frontend:** Vite/React (Vercel)
- **Backend:** Python FastAPI (Google Cloud Run)
- **Orchestration:** Firebase Functions (Node.js)
- **Base de données:** Firebase Firestore
- **Authentification:** Firebase Auth

---

## 🎯 **1. VÉRIFIER BACKEND PYTHON CLOUD RUN**

### **API 1: getRegime (STRUCTURE 2)**
```bash
# Test direct Cloud Run
curl -X POST https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze \
  -H "Content-Type: application/json" \
  -d '{"country": "France"}'
```

**Tests à effectuer:**
- ✅ Réponse JSON valide
- ✅ Temps de réponse <800ms
- ✅ Données: regime, confidence, indicators
- ✅ Mise à jour selon pays sélectionné

**Problèmes à identifier:**
- ❌ Erreur 404 ou 500
- ❌ Réponse vide ou invalide
- ❌ Timeout >2s
- ❌ Données identiques pour tous les pays

### **API 2: getAllocations (STRUCTURE 2)**
```bash
# Test direct Cloud Run
curl "https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/allocations/get?country=France"
```

**Tests à effectuer:**
- ✅ Réponse avec stocks, bonds, commodities, cash
- ✅ Pourcentages cohérents (total = 100%)
- ✅ Mise à jour selon pays sélectionné
- ✅ Status: LIVE ou SIMULÉ

### **API 3: getIndicators (STRUCTURE 2)**
```bash
# Test direct Cloud Run
curl "https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/indicators/breakdown?country=France"
```

**Tests à effectuer:**
- ✅ Score global calculé
- ✅ Indicateurs physiques présents
- ✅ Sources de données correctes
- ✅ Mise à jour temps réel

---

## 🎯 **2. VÉRIFIER FRONTEND VITE/REACT (STRUCTURE 2)**

### **Widget 1: Sélection du Pays**
**Tests à effectuer:**
- ✅ Dropdown fonctionnel avec 15 pays
- ✅ Changement de pays (France → USA → Allemagne)
- ✅ Mise à jour automatique des données
- ✅ Affichage drapeaux et noms pays
- ✅ Sauvegarde sélection en localStorage

**Problèmes à identifier:**
- ❌ Dropdown ne s'ouvre pas
- ❌ Changement pays ne met pas à jour les autres widgets
- ❌ Erreurs console lors du changement
- ❌ Drapeaux manquants ou incorrects

### **Widget 2: Régime Économique (STRUCTURE 2)**
**Tests à effectuer:**
- ✅ Affichage régime actuel (EXPANSION, RECESSION, etc.)
- ✅ Indice de confiance (85%)
- ✅ Indicateurs: Croissance 2.5%, Inflation 2.8%, Chômage 7.5%
- ✅ Couleur du badge selon le régime
- ✅ Mise à jour temps réel
- ✅ Status: LIVE ou SIMULÉ

### **Widget 3: Market Stress Indicators**
**Tests à effectuer:**
- ✅ Niveau de stress affiché (EXTRÊME)
- ✅ VIX : 16.52 avec gauge visuel
- ✅ HY Spread : 6.92 avec gauge visuel
- ✅ Sources : fred.stlouisfed.org
- ✅ Couleurs selon niveau de stress

### **Widget 4: Allocations de Portefeuille**
**Tests à effectuer:**
- ✅ Graphique circulaire affiché
- ✅ Pourcentages : Actions 65%, Obligations 25%, Or 5%, Liquidités 5%
- ✅ Tooltips au survol
- ✅ Mise à jour selon le régime

### **Widget 5: ETF Prices**
**Tests à effectuer:**
- ✅ Prix SPY, TLT, GLD, HYG affichés
- ✅ Variations en pourcentage
- ✅ Couleurs vert/rouge selon performance
- ✅ Liens vers Yahoo Finance

### **Widget 6: Backtesting Engine**
**Tests à effectuer:**
- ✅ Statut "API OK" affiché
- ✅ Données de performance
- ✅ Graphiques historiques
- ✅ Métriques : rendement, volatilité, Sharpe

### **Widget 7: Indicateurs d'Activité Économique Réelle**
**Tests à effectuer:**
- ✅ Statut "API OK" affiché
- ✅ Données de performance
- ✅ Score composite calculé
- ✅ Sources de données listées

---

## 🎯 **3. VÉRIFIER FIREBASE FUNCTIONS (STRUCTURE 2)**

### **Orchestration Firebase Functions**
```bash
# Test Firebase Functions
curl "https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getRegime?country=France"
```

**Tests à effectuer:**
- ✅ Communication Firebase → Cloud Run
- ✅ Cache Firestore fonctionnel
- ✅ Gestion d'erreurs robuste
- ✅ Temps de réponse <300ms

---

## 🎯 **4. VALIDER RESPONSIVE DESIGN STRUCTURE 2**

### **Desktop (1920x1080)**
**Tests à effectuer:**
- ✅ Layout 6 widgets en grille
- ✅ Navigation horizontale complète
- ✅ Tooltips et hover effects
- ✅ Performance fluide

### **Tablet (768x1024)**
**Tests à effectuer:**
- ✅ Layout adapté 2-3 colonnes
- ✅ Navigation accessible
- ✅ Widgets redimensionnés
- ✅ Touch interactions

### **Mobile (375x667)**
**Tests à effectuer:**
- ✅ Layout 1 colonne
- ✅ Navigation hamburger
- ✅ Widgets empilés
- ✅ Scroll fluide

---

## 🎯 **5. CONFIRMER PERFORMANCE STRUCTURE 2**

### **Métriques à Mesurer**
- **Temps de chargement:**
  - First Contentful Paint (FCP) : <1s
  - Largest Contentful Paint (LCP) : <2s
  - Time to Interactive (TTI) : <2s
  - First Input Delay (FID) : <100ms

- **Bundle Size:**
  - JavaScript : <500KB
  - CSS : <100KB
  - Images : <200KB
  - Total : <800KB

### **Tests de Performance**
**Outils à utiliser:**
- Chrome DevTools Lighthouse
- WebPageTest
- GTmetrix
- Vercel Analytics

---

## 🎯 **6. TESTER NAVIGATION STRUCTURE 2**

### **Navigation Principale**
**Tests à effectuer:**
- ✅ Dashboard (actif par défaut)
- ✅ Secteurs (3 vues : Aperçu, Graphique, Tableau)
- ✅ Essentiels (module complet)
- ✅ Analytics (graphiques avancés)
- ✅ Configuration (paramètres)

### **Navigation Secondaire**
**Tests à effectuer:**
- ✅ Breadcrumbs fonctionnels
- ✅ Boutons retour/précédent
- ✅ Liens externes (Yahoo Finance)
- ✅ Modales et popups

---

## 🎯 **7. VÉRIFIER ARCHITECTURE STRUCTURE 2**

### **Suppression Next.js**
**Tests à effectuer:**
- ❌ Pas de dossier `pages/`
- ❌ Pas de `next.config.js`
- ❌ Pas d'APIs locales `/api/`
- ✅ Configuration Vite pure

### **Configuration Firebase**
**Tests à effectuer:**
- ✅ Firebase config dans `src/lib/firebase.js`
- ✅ Authentification Firebase Auth
- ✅ Firestore configuré
- ✅ Cloud Functions déployées

### **Configuration Cloud Run**
**Tests à effectuer:**
- ✅ Container Python déployé
- ✅ FastAPI accessible
- ✅ Modules Python intégrés
- ✅ Performance <800ms

---

## 📊 **RAPPORT ATTENDU STRUCTURE 2**

### **Format du Rapport**
```json
{
  "timestamp": "2025-08-17T...",
  "version": "STRUCTURE 2",
  "architecture": "Firebase + Vite + Cloud Run",
  "summary": {
    "backend": { "total": 3, "ok": 3 },
    "frontend": { "total": 7, "ok": 7 },
    "firebase": { "total": 1, "ok": 1 },
    "responsive": { "total": 3, "ok": 3 },
    "performance": { "total": 4, "ok": 4 },
    "navigation": { "total": 5, "ok": 5 },
    "architecture": { "total": 3, "ok": 3 }
  },
  "details": {
    "backend": [...],
    "frontend": [...],
    "firebase": [...],
    "responsive": [...],
    "performance": [...],
    "navigation": [...],
    "architecture": [...]
  }
}
```

### **Status de chaque composant**
- **OK:** Fonctionnel et conforme
- **WARNING:** Fonctionnel mais optimisable
- **ERROR:** Problème détecté

### **Recommandations de correction**
- Liste des problèmes identifiés
- Priorités de correction
- Actions spécifiques à entreprendre

---

## ✅ **CHECKLIST FINALE STRUCTURE 2**

### **Avant Déploiement:**
- [ ] Backend Python Cloud Run opérationnel
- [ ] Frontend Vite/React fonctionnel
- [ ] Firebase Functions orchestrées
- [ ] Responsive design validé
- [ ] Performance <2s confirmée
- [ ] Navigation complète testée
- [ ] Architecture Next.js supprimée

### **Après Déploiement:**
- [ ] Tests production identiques
- [ ] Monitoring erreurs activé
- [ ] Analytics configurés
- [ ] Backup et rollback préparés

---

## 🎯 **RÉSULTAT ATTENDU STRUCTURE 2**

**V2.6.1 100% fonctionnelle avec architecture Firebase + Vite + Cloud Run !**

### **URLs de Production STRUCTURE 2:**
- **Frontend:** `https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app`
- **Backend:** `https://oracle-backend-yrvjzoj3aa-uc.a.run.app`
- **Firebase:** `https://console.firebase.google.com/project/oracle-portfolio-prod`

### **Architecture Finale STRUCTURE 2:**
```
Frontend (Vite/React) → Firebase Functions → Backend Python (Cloud Run)
     ↓                           ↓                           ↓
  Vercel                    Firebase Auth              Google Cloud Run
```

---

## 🚀 **EXÉCUTION DU PLAN STRUCTURE 2**

```bash
# Lancer les tests STRUCTURE 2
node test-structure2.mjs

# Générer le rapport complet
node debug-test-runner.mjs

# Vérifier la production
npm run test:production
```

**STRUCTURE 2 - Architecture optimale confirmée ! 🏆**
