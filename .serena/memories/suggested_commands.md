# Commandes essentielles

## Installation
```bash
# Installation des dépendances (OBLIGATOIRE avec --legacy-peer-deps)
npm install --legacy-peer-deps

# Nettoyage et réinstallation si problème
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Développement
```bash
# Démarrage Vite (recommandé)
npm run dev
# → http://localhost:5173

# Démarrage Next.js seul
npm run dev:next
# → http://localhost:3002

# Démarrage hybride (les deux simultanément)
npm run dev:hybrid
```

## Build et production
```bash
# Build Vite (principal)
npm run build

# Build Next.js
npm run build:next

# Build hybride complet
npm run build:hybrid

# Prévisualisation du build
npm run preview
```

## Déploiement
```bash
# Déploiement Vercel automatisé
./deploy-vercel-v2.6.0.sh

# Déploiement Vercel manuel
npm run build
vercel --prod

# Déploiement Firebase
npm run build
firebase deploy
```

## Qualité de code
```bash
# Linting
npm run lint

# Vérification des erreurs critiques
grep -n "const editItem" src/components/admin/ExtensibleConfigurationPanel.jsx
```

## Système (Darwin/macOS)
```bash
# Navigation et exploration
ls -la
cd [directory]
find . -name "*.jsx" | head -10
grep -r "pattern" src/

# Git (si configuré)
git status
git add .
git commit -m "message"
git push

# Vérification des processus
lsof -i :5173  # Vérifier port Vite
lsof -i :3002  # Vérifier port Next.js
```

## Tests et validation
```bash
# Vérification structure hybride
ls -la .next/                    # Build Next.js
ls -la pages/                    # Pages Next.js
curl http://localhost:5173       # Test Vite
curl http://localhost:3002       # Test Next.js
curl http://localhost:3002/api/health # Test API
```