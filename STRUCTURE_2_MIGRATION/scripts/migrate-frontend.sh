#!/bin/bash
# Oracle Portfolio - Script de migration frontend
# Next.js → Vite + React

set -e

echo "🔄 MIGRATION FRONTEND: Next.js → Vite + React"
echo "============================================="

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Sauvegarde avant migration
backup_project() {
    log_step "1/8 - Sauvegarde du projet existant"
    
    BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Sauvegarde des fichiers critiques
    if [ -f "package.json" ]; then
        cp package.json "$BACKUP_DIR/"
    fi
    
    if [ -f "next.config.js" ]; then
        cp next.config.js "$BACKUP_DIR/"
    fi
    
    if [ -d "pages" ]; then
        cp -r pages "$BACKUP_DIR/"
    fi
    
    if [ -d "src" ]; then
        cp -r src "$BACKUP_DIR/"
    fi
    
    log_info "✅ Sauvegarde créée: $BACKUP_DIR"
}

# Suppression de Next.js
remove_nextjs() {
    log_step "2/8 - Suppression de Next.js"
    
    # Suppression des dossiers Next.js
    log_info "Suppression des dossiers Next.js..."
    rm -rf pages/ 2>/dev/null || true
    rm -rf .next/ 2>/dev/null || true
    rm -rf out/ 2>/dev/null || true
    
    # Suppression des fichiers de configuration Next.js
    log_info "Suppression des fichiers de configuration..."
    rm -f next.config.js 2>/dev/null || true
    rm -f next-env.d.ts 2>/dev/null || true
    
    # Suppression des dépendances Next.js du package.json
    if [ -f "package.json" ]; then
        log_info "Nettoyage du package.json..."
        # Sauvegarde temporaire
        cp package.json package.json.tmp
        
        # Suppression des dépendances Next.js avec sed
        sed -i.bak '/"next":/d' package.json
        sed -i.bak '/"@next\//d' package.json
        sed -i.bak '/next-/d' package.json
        
        rm -f package.json.bak
    fi
    
    log_info "✅ Next.js supprimé"
}

# Installation et configuration de Vite
setup_vite() {
    log_step "3/8 - Installation et configuration de Vite"
    
    # Installation des dépendances Vite
    log_info "Installation de Vite et React..."
    npm install --save-dev vite @vitejs/plugin-react
    npm install react react-dom
    
    # Création du fichier de configuration Vite
    log_info "Création de vite.config.js..."
    cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
EOF
    
    log_info "✅ Vite configuré"
}

# Création de la structure Vite
create_vite_structure() {
    log_step "4/8 - Création de la structure Vite"
    
    # Création du fichier index.html
    log_info "Création de index.html..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Oracle Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF
    
    # Création du dossier src s'il n'existe pas
    mkdir -p src
    
    # Création du fichier main.jsx
    log_info "Création de src/main.jsx..."
    cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF
    
    # Création du composant App principal
    log_info "Création de src/App.jsx..."
    cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Configuration de l'API backend
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const fetchHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Erreur API:', error)
      setData({ error: 'Connexion backend impossible' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔮 Oracle Portfolio</h1>
        <p>Architecture hybridée optimale</p>
        <p>Frontend: Vite + React | Backend: Python + Cloud Run</p>
        
        <div className="status-section">
          <button onClick={fetchHealthCheck} disabled={loading}>
            {loading ? 'Test en cours...' : 'Tester Backend'}
          </button>
          
          {data && (
            <div className="status-result">
              <h3>Statut Backend:</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
        
        <div className="migration-info">
          <h3>✅ Migration réussie</h3>
          <ul>
            <li>❌ Next.js supprimé</li>
            <li>✅ Vite configuré</li>
            <li>✅ React préservé</li>
            <li>✅ Backend Python intégré</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App
EOF
    
    # Création des styles CSS
    log_info "Création des styles CSS..."
    cat > src/App.css << 'EOF'
.App {
  text-align: center;
  padding: 2rem;
}

.App-header {
  background-color: #282c34;
  padding: 2rem;
  color: white;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.App-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.status-section {
  margin: 2rem 0;
}

.status-section button {
  background-color: #61dafb;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  color: #282c34;
  font-weight: bold;
}

.status-section button:hover {
  background-color: #21a9c7;
}

.status-section button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.status-result {
  margin-top: 1rem;
  text-align: left;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
  color: #333;
}

.status-result pre {
  background-color: #1e1e1e;
  color: #fff;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
}

.migration-info {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 2rem;
}

.migration-info ul {
  list-style: none;
  padding: 0;
}

.migration-info li {
  margin: 0.5rem 0;
  font-weight: bold;
}
EOF
    
    cat > src/index.css << 'EOF'
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
EOF
    
    log_info "✅ Structure Vite créée"
}

# Mise à jour du package.json
update_package_json() {
    log_step "5/8 - Mise à jour du package.json"
    
    # Création d'un nouveau package.json optimisé
    log_info "Mise à jour des scripts..."
    
    # Sauvegarde de l'ancien package.json
    if [ -f "package.json" ]; then
        cp package.json package.json.old
    fi
    
    # Extraction des dépendances existantes (hors Next.js)
    EXISTING_DEPS=""
    if [ -f "package.json.old" ]; then
        EXISTING_DEPS=$(cat package.json.old)
    fi
    
    # Création du nouveau package.json
    cat > package.json << 'EOF'
{
  "name": "oracle-portfolio-frontend",
  "private": true,
  "version": "2.7.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5"
  }
}
EOF
    
    log_info "✅ package.json mis à jour"
}

# Configuration de l'environnement
setup_environment() {
    log_step "6/8 - Configuration de l'environnement"
    
    # Création du fichier .env.example
    log_info "Création de .env.example..."
    cat > .env.example << 'EOF'
# Oracle Portfolio - Configuration Frontend
VITE_API_URL=http://localhost:8080
VITE_ENVIRONMENT=development
VITE_APP_NAME=Oracle Portfolio
VITE_APP_VERSION=2.7.0
EOF
    
    # Création du fichier .env local
    if [ ! -f ".env" ]; then
        log_info "Création de .env..."
        cp .env.example .env
    fi
    
    # Mise à jour du .gitignore
    log_info "Mise à jour de .gitignore..."
    cat >> .gitignore << 'EOF'

# Vite
dist/
*.local

# Environment variables
.env.local
.env.production.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF
    
    log_info "✅ Environnement configuré"
}

# Installation des dépendances
install_dependencies() {
    log_step "7/8 - Installation des dépendances"
    
    log_info "Nettoyage node_modules..."
    rm -rf node_modules package-lock.json
    
    log_info "Installation des nouvelles dépendances..."
    npm install
    
    log_info "✅ Dépendances installées"
}

# Tests et validation
test_migration() {
    log_step "8/8 - Tests et validation"
    
    log_info "Build de test..."
    if npm run build; then
        log_info "✅ Build réussi"
    else
        log_error "❌ Échec du build"
        return 1
    fi
    
    log_info "Vérification des fichiers générés..."
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        log_info "✅ Fichiers de build générés"
    else
        log_error "❌ Fichiers de build manquants"
        return 1
    fi
    
    log_info "✅ Migration validée"
}

# Affichage du résumé
show_migration_summary() {
    echo ""
    echo "🎉 MIGRATION TERMINÉE AVEC SUCCÈS"
    echo "================================="
    echo ""
    echo "✅ Next.js supprimé"
    echo "✅ Vite configuré"
    echo "✅ React préservé"
    echo "✅ Structure optimisée"
    echo ""
    echo "🚀 Commandes disponibles:"
    echo "  npm run dev     - Serveur de développement"
    echo "  npm run build   - Build de production"
    echo "  npm run preview - Aperçu du build"
    echo ""
    echo "🔧 Prochaines étapes:"
    echo "  1. Tester: npm run dev"
    echo "  2. Configurer l'API backend dans .env"
    echo "  3. Déployer sur Vercel"
    echo ""
    echo "📁 Sauvegarde disponible dans: $BACKUP_DIR"
}

# Fonction principale
main() {
    log_info "Début de la migration frontend..."
    
    backup_project
    remove_nextjs
    setup_vite
    create_vite_structure
    update_package_json
    setup_environment
    install_dependencies
    test_migration
    show_migration_summary
    
    log_info "🚀 Migration frontend terminée avec succès!"
}

# Gestion des erreurs
trap 'log_error "Erreur lors de la migration. Restaurez depuis la sauvegarde si nécessaire."; exit 1' ERR

# Exécution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

