# Structure du code

## Organisation des répertoires

### Racine du projet
```
oracle-portfolio-v2-6-1-hybride-secteurs/
├── 📁 src/ (code source Vite)
├── 📁 pages/ (pages Next.js)
├── 📁 api/ (APIs)
├── 📁 functions/ (Cloud Functions)
├── 📁 public/ (assets statiques)
├── 📄 package.json (React 18 + Vite 6)
├── 📄 vite.config.js (config Vite)
├── 📄 vercel.json (config déploiement)
└── 📄 README-V2.6.0-COMPLET.md (doc principale)
```

### Dossier src/ (Vite)
```
src/
├── 📁 components/
│   ├── 📁 admin/ (ExtensibleConfigurationPanel.jsx ⭐)
│   ├── 📁 ui/ (40+ composants Radix UI)
│   ├── 📁 widgets/ (11 widgets)
│   ├── 📁 charts/ (composants graphiques)
│   ├── 📁 auth/ (authentification)
│   ├── 📁 layout/ (mise en page)
│   └── 📁 sectors/ (secteurs économiques)
├── 📁 hooks/ (useAPI.js ⭐)
├── 📁 data/ (countries.json, regimes.json)
├── 📁 contexts/ (React contexts)
├── 📁 lib/ (utilitaires)
├── 📁 utils/ (fonctions utilitaires)
├── 📁 services/ (services API)
├── 📁 types/ (types TypeScript)
├── 📁 assets/ (images, fonts)
├── 📄 App.jsx (composant principal)
├── 📄 main.jsx (point d'entrée)
└── 📄 index.css (styles globaux)
```

## Composants clés

### ExtensibleConfigurationPanel.jsx
- **Localisation** : `src/components/admin/ExtensibleConfigurationPanel.jsx`
- **Rôle** : Interface CRUD complète V2.6.0
- **Fonctions importantes** : editItem(), addNewItem(), deleteItem()

### useAPI.js
- **Localisation** : `src/hooks/useAPI.js`
- **Rôle** : Hook pour données de 15 pays avec fallback

### App.jsx
- **Localisation** : `src/App.jsx`
- **Rôle** : Composant racine avec routing et authentification

## Points d'entrée
- **Vite** : `src/main.jsx` → `src/App.jsx`
- **Next.js** : `pages/index.js`
- **API** : `pages/api/health.js`

## Fichiers de configuration critique
- `vite.config.js` : Configuration Vite avec alias @
- `eslint.config.js` : Linting JavaScript/JSX
- `vercel.json` : Configuration déploiement
- `package.json` : Scripts et dépendances