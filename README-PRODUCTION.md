# 🚀 Oracle Portfolio - Version Production Complète (19 juillet 2025)

## 📅 Version de référence
- **Date de création** : 19 juillet 2025 à 14:47:34
- **Commit** : a3fa3b295f4c9d2fed06924d37ee1fd19fa6482d
- **Message** : "feat: restauration complète Oracle Portfolio avec toutes les fonctionnalités avancées"

## ✅ FONCTIONNALITÉS INCLUSES

### 🎯 Interface complète
- ✅ 6 panneaux de données réelles
- ✅ Menu Configuration fonctionnel avec authentification
- ✅ 15 pays avec menu déroulant
- ✅ Données réelles : EXPANSION 85%, VIX 16.52, etc.
- ✅ Backtesting Engine fonctionnel

### ⚙️ Menu de configuration complet
- ✅ **Général** - Configuration générale du système
- ✅ **Indicateurs** - 7 indicateurs configurables
- ✅ **Formules** - Formules extensibles
- ✅ **Régimes** - 4 régimes économiques
- ✅ **Plugins** - Système de plugins extensible

### 🏗️ Architecture technique
- **Framework** : React 18 + Vite
- **UI** : Shadcn/ui + Radix UI + Tailwind CSS
- **Graphiques** : Recharts
- **Animations** : Framer Motion
- **Authentification** : admin/scalabla2025

## 📁 STRUCTURE DU PROJET

```
oracle-portfolio-prod-complete-19juillet/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ConfigurationPanel.jsx
│   │   │   ├── ExtensibleConfigurationPanel.jsx ⭐ MENU COMPLET
│   │   │   └── PluginWizard.jsx
│   │   ├── auth/
│   │   │   └── LoginModal.jsx
│   │   ├── charts/
│   │   │   └── GaugeChart.jsx
│   │   ├── layout/
│   │   │   └── Dashboard.jsx
│   │   ├── ui/ (40+ composants Shadcn/ui)
│   │   └── widgets/ (10 widgets fonctionnels)
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   └── utils/
├── public/
├── package.json
├── vite.config.js
├── index.html
└── firebase.json
```

## 🚀 INSTALLATION ET DÉMARRAGE

### Prérequis
- Node.js 18+
- npm ou pnpm

### Installation
```bash
# Installation des dépendances
npm install
# ou
pnpm install

# Démarrage en développement
npm run dev
# ou
pnpm dev

# Build pour production
npm run build
# ou
pnpm build
```

### Déploiement Firebase
```bash
# Installation Firebase CLI
npm install -g firebase-tools

# Connexion à Firebase
firebase login

# Déploiement
firebase deploy
```

## 🔧 COMPOSANTS PRINCIPAUX

### ExtensibleConfigurationPanel.jsx
Le composant principal du menu de configuration avec :
- Gestion des indicateurs (7 types)
- Formules extensibles
- Régimes économiques (4 types)
- Système de plugins
- Interface d'administration complète

### Dashboard.jsx
Interface principale avec :
- 6 panneaux de données
- Sélecteur de pays (15 pays)
- Données en temps réel
- Graphiques interactifs

### Widgets fonctionnels
- AllocationsCard.jsx
- BacktestingCard.jsx
- MarketStressCard.jsx
- RegimeCard.jsx
- ETFPricesModule.jsx
- Et 5 autres widgets

## 📊 DONNÉES INCLUSES

### Indicateurs configurables
- ⚡ Électricité (25% - EIA, Eurostat)
- 🏭 PMI (30% - Markit, ISM)
- 🚢 Maritime (20% - Baltic Exchange)
- ⛽ Énergie (25% - IEA, OPEC)
- 📈 Yields (40% - Bloomberg, Reuters)
- 📊 Spreads (30% - Bloomberg)
- 📉 Volatility (30% - CBOE, Bloomberg)

### Régimes économiques
- 🚀 Expansion : Stocks 70%, Bonds 20%, Commodities 10%
- 🔥 Stagflation : Stocks 40%, Bonds 30%, Commodities 30%
- 📉 Récession : Stocks 30%, Bonds 60%, Commodities 10%
- ❄️ Déflation : Stocks 20%, Bonds 70%, Commodities 10%

### Pays supportés (15)
France, États-Unis, Chine, Japon, Allemagne, Inde, Royaume-Uni, Italie, Brésil, Canada, Russie, Corée du Sud, Espagne, Australie, Mexique

## 🔐 Authentification
- **Utilisateur** : admin
- **Mot de passe** : scalabla2025

## 📝 NOTES IMPORTANTES

### Version de référence
Cette version contient EXACTEMENT le code qui était disponible le 19 juillet 2025, AVANT les tentatives de déploiement ratées sur Vercel et AVANT la version déployée en production le 25 juillet qui ne contenait pas le menu de configuration complet.

### Différences avec la production
La version actuellement en production (https://oracle-portfolio-prod.web.app/) utilise une version ANTÉRIEURE qui ne contient PAS le menu de configuration complet. Cette archive contient la version COMPLÈTE avec toutes les fonctionnalités.

### Compatibilité
- ✅ Compatible React 18
- ✅ Compatible Vite 6+
- ✅ Compatible Node.js 18+
- ✅ Prêt pour déploiement Firebase
- ✅ Tous les widgets fonctionnels
- ✅ Menu de configuration opérationnel

## 🎯 UTILISATION

1. **Démarrage** : `npm run dev`
2. **Connexion** : admin/scalabla2025
3. **Configuration** : Cliquer sur ⚙️ Configuration
4. **Sous-menus** : Général, Indicateurs, Formules, Régimes, Plugins
5. **Backtesting** : Utiliser le module de backtesting
6. **Pays** : Sélectionner parmi 15 pays disponibles

Cette version est la référence complète et fonctionnelle du 19 juillet 2025.

