# Configuration Hybride Vercel - Oracle Portfolio v2.6.1

## Structure du Projet

```
oracle-portfolio-v2-6-1-hybride-secteurs/
├── src/                    # Frontend React (Vite)
├── api/                    # APIs locales (Node.js)
├── functions/              # Firebase Cloud Functions
├── dist/                   # Build Vite + APIs copiées
└── vercel.json            # Configuration Vercel
```

## Architecture Hybride

### ✅ Frontend : Vite (React)
- Framework : Vite + React
- Build : `npm run build` → `dist/`
- Routing : React Router

### ✅ APIs locales : Node.js (/api/)
- **Emplacement** : `/api/*.js`
- **Runtime** : Node.js 18.x
- **Copie** : Automatique vers `dist/api/` lors du build
- **Exemples** :
  - `/api/allocations.js`
  - `/api/backtesting.js`
  - `/api/market-data.js`
  - `/api/regime.js`

### ✅ APIs externes : Firebase Cloud Functions
- **Emplacement** : `/functions/`
- **Runtime** : Firebase Functions
- **Déploiement** : Séparé de Vercel

### ✅ Base de données : Firebase Firestore
- **Service** : Firebase Firestore
- **Accès** : Via Firebase SDK

### ✅ Déploiement : Vercel
- **Framework** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Functions** : Configuration pour `/api/**/*.js`

## Configuration Vercel

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### Script de Build (package.json)
```json
{
  "scripts": {
    "build": "vite build && node vercel-build.js"
  }
}
```

### Script de Copie (vercel-build.js)
- Copie automatiquement `/api/` vers `/dist/api/`
- Compatible ES modules
- Gestion d'erreurs

## Déploiement

### 1. Build Local
```bash
npm run build
```

### 2. Déploiement Vercel
```bash
# Via CLI
vercel --prod --force

# Ou via script
./deploy-vercel-force.sh
```

### 3. Vérification
- Frontend : `https://your-app.vercel.app`
- APIs : `https://your-app.vercel.app/api/allocations`

## Résolution des Problèmes

### Problème : Vercel utilise l'ancienne API
**Solution** :
1. Vérifier `vercel.json` est à jour
2. Forcer le redéploiement : `vercel --prod --force`
3. Vérifier les logs de build

### Problème : APIs non accessibles
**Solution** :
1. Vérifier que `/api/` est copié vers `/dist/api/`
2. Vérifier la configuration `functions` dans `vercel.json`
3. Tester localement : `npm run preview`

### Problème : Build échoue
**Solution** :
1. Vérifier les dépendances : `npm install`
2. Vérifier les imports ES modules
3. Tester le build local : `npm run build`

## Charte Graphique

- **Couleurs** : #0f0f23 (fond), #1a1a2e (cartes), #00d4ff (accents)
- **Typographie** : Inter, H1:32px/700, Body:16px/400
- **Layout** : Container 1200px, Grid auto-fit 350px
- **Widgets** : 7 composants (Pays, Régime, Indicateurs Physiques, etc.)
- **Responsive** : Mobile 1 colonne, Desktop auto-fit

## Commit Actuel
- **Commit** : 36b5a3b
- **Version** : 2.6.1
- **Statut** : Configuration hybride fonctionnelle

