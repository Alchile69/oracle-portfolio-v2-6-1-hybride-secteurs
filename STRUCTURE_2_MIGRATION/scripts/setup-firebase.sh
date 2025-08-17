#!/bin/bash
# Oracle Portfolio - Script de configuration Firebase
# Architecture: Firebase + Vite + Cloud Run

set -e

echo "🔥 CONFIGURATION FIREBASE"
echo "========================="

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

# Vérification des prérequis
check_prerequisites() {
    log_step "1/6 - Vérification des prérequis"
    
    if ! command -v npm &> /dev/null; then
        log_error "npm non installé"
        exit 1
    fi
    
    log_info "✅ Prérequis validés"
}

# Installation de Firebase CLI
install_firebase_cli() {
    log_step "2/6 - Installation de Firebase CLI"
    
    if ! command -v firebase &> /dev/null; then
        log_info "Installation de Firebase CLI..."
        npm install -g firebase-tools
    else
        log_info "Firebase CLI déjà installé"
        firebase --version
    fi
    
    log_info "✅ Firebase CLI prêt"
}

# Authentification Firebase
authenticate_firebase() {
    log_step "3/6 - Authentification Firebase"
    
    log_info "Authentification Firebase..."
    firebase login --no-localhost
    
    log_info "✅ Authentification réussie"
}

# Initialisation du projet Firebase
init_firebase_project() {
    log_step "4/6 - Initialisation du projet Firebase"
    
    if [ ! -f "firebase.json" ]; then
        log_info "Initialisation du projet Firebase..."
        
        # Initialisation interactive
        firebase init
        
        log_info "Configuration Firebase terminée"
    else
        log_info "Projet Firebase déjà initialisé"
    fi
    
    # Création de la configuration Firebase pour le frontend
    create_firebase_config
    
    log_info "✅ Projet Firebase initialisé"
}

# Création de la configuration Firebase
create_firebase_config() {
    log_info "Création de la configuration Firebase..."
    
    # Création du fichier de configuration Firebase
    mkdir -p src/lib
    
    cat > src/lib/firebase.js << 'EOF'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Helper functions pour Oracle Portfolio
export const oraclePortfolioAPI = {
  // Gestion des portefeuilles
  async getPortfolios(userId) {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Sauvegarde d'analyse de régime
  async saveEconomicRegime(regimeData) {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const regimesRef = collection(db, 'economic_regimes');
    
    const docRef = await addDoc(regimesRef, {
      ...regimeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // Récupération des analyses de régimes
  async getEconomicRegimes(country, limit = 10) {
    const { collection, query, where, orderBy, limitToLast, getDocs } = await import('firebase/firestore');
    const regimesRef = collection(db, 'economic_regimes');
    const q = query(
      regimesRef,
      where('country', '==', country),
      orderBy('analysisDate', 'desc'),
      limitToLast(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Sauvegarde de backtest
  async saveBacktest(backtestData) {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const backtestsRef = collection(db, 'backtests');
    
    const docRef = await addDoc(backtestsRef, {
      ...backtestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // Récupération des backtests
  async getBacktests(userId) {
    const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const backtestsRef = collection(db, 'backtests');
    const q = query(
      backtestsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Appel des Firebase Functions
  async callFunction(functionName, data) {
    const { httpsCallable } = await import('firebase/functions');
    const callable = httpsCallable(functions, functionName);
    
    try {
      const result = await callable(data);
      return result.data;
    } catch (error) {
      console.error(`Erreur lors de l'appel de ${functionName}:`, error);
      throw error;
    }
  }
};

export default app;
EOF
    
    log_info "✅ Configuration Firebase créée"
}

# Configuration des Firebase Functions
setup_firebase_functions() {
    log_step "5/6 - Configuration des Firebase Functions"
    
    if [ ! -d "functions" ]; then
        log_info "Création du dossier functions..."
        mkdir -p functions
    fi
    
    # Création du package.json pour les functions
    cat > functions/package.json << 'EOF'
{
  "name": "oracle-portfolio-functions",
  "description": "Firebase Functions pour Oracle Portfolio",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1",
    "axios": "^1.5.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "typescript": "^4.9.0",
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "eslint": "^8.9.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.25.4"
  },
  "private": true
}
EOF

    # Création du fichier index.ts principal
    cat > functions/src/index.ts << 'EOF'
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();

const corsHandler = cors({origin: true});

// Configuration
const PYTHON_BACKEND_URL = functions.config().backend?.url || 
  "https://oracle-backend-xxx.run.app";

/**
 * Proxy pour les analyses de régimes économiques
 */
export const analyzeEconomicRegimes = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      try {
        // Vérification de l'authentification
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
          response.status(401).json({error: "Token manquant"});
          return;
        }

        // Vérification du token Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Appel au backend Python
        const pythonResponse = await axios.post(
          `${PYTHON_BACKEND_URL}/api/regimes/analyze`,
          request.body,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-ID": userId,
            },
            timeout: 30000,
          }
        );

        // Sauvegarde en Firestore
        if (pythonResponse.data.success) {
          await admin.firestore().collection("economic_regimes").add({
            userId: userId,
            country: request.body.country,
            analysis: pythonResponse.data.data,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        response.json(pythonResponse.data);
      } catch (error) {
        console.error("Erreur analyse régimes:", error);
        response.status(500).json({
          error: "Erreur serveur",
          message: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    });
  }
);

/**
 * Proxy pour le backtesting
 */
export const runBacktest = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Vérification de l'authentification
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        response.status(401).json({error: "Token manquant"});
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      // Appel au backend Python
      const pythonResponse = await axios.post(
        `${PYTHON_BACKEND_URL}/api/backtest/run`,
        request.body,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
          timeout: 60000, // Timeout plus long pour les backtests
        }
      );

      // Sauvegarde en Firestore
      if (pythonResponse.data.success) {
        await admin.firestore().collection("backtests").add({
          userId: userId,
          strategy: request.body.strategy,
          results: pythonResponse.data.data,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      response.json(pythonResponse.data);
    } catch (error) {
      console.error("Erreur backtest:", error);
      response.status(500).json({
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  });
});

/**
 * Proxy pour l'analyse de performance
 */
export const analyzePerformance = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      try {
        // Vérification de l'authentification
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
          response.status(401).json({error: "Token manquant"});
          return;
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Appel au backend Python
        const pythonResponse = await axios.post(
          `${PYTHON_BACKEND_URL}/api/performance/analyze`,
          request.body,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-ID": userId,
            },
            timeout: 30000,
          }
        );

        // Sauvegarde en Firestore
        if (pythonResponse.data.success) {
          await admin.firestore().collection("performance_analyses").add({
            userId: userId,
            portfolioId: request.body.portfolioId,
            analysis: pythonResponse.data.data,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        response.json(pythonResponse.data);
      } catch (error) {
        console.error("Erreur analyse performance:", error);
        response.status(500).json({
          error: "Erreur serveur",
          message: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    });
  }
);

/**
 * Health check
 */
export const healthCheck = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "oracle-portfolio-functions",
      version: "2.7.0",
    });
  });
});
EOF

    # Création du tsconfig.json
    cat > functions/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017"
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
EOF

    # Création du .eslintrc.js
    cat > functions/.eslintrc.js << 'EOF'
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
  },
};
EOF

    log_info "✅ Firebase Functions configurées"
}

# Configuration des règles Firestore
setup_firestore_rules() {
    log_step "6/6 - Configuration des règles Firestore"
    
    # Création des règles de sécurité Firestore
    cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les portefeuilles
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les analyses de régimes économiques
    match /economic_regimes/{regimeId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les backtests
    match /backtests/{backtestId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les analyses de performance
    match /performance_analyses/{analysisId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les profils utilisateur
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
EOF

    # Création des index Firestore
    cat > firestore.indexes.json << 'EOF'
{
  "indexes": [
    {
      "collectionGroup": "economic_regimes",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "country",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "backtests",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "performance_analyses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "portfolioId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

    log_info "✅ Règles Firestore configurées"
}

# Installation des dépendances Firebase
install_firebase_dependencies() {
    log_info "Installation des dépendances Firebase..."
    
    # Installation des dépendances frontend
    npm install firebase
    
    # Installation des dépendances functions
    if [ -d "functions" ]; then
        cd functions
        npm install
        cd ..
    fi
    
    log_info "✅ Dépendances Firebase installées"
}

# Affichage des instructions
show_setup_instructions() {
    echo ""
    echo "🎉 CONFIGURATION FIREBASE TERMINÉE"
    echo "=================================="
    echo ""
    echo "📋 Prochaines étapes:"
    echo ""
    echo "1. 🔧 Configurer les variables d'environnement:"
    echo "   - Éditer le fichier .env"
    echo "   - Ajouter les clés Firebase de votre projet"
    echo ""
    echo "2. 🚀 Déployer les Firebase Functions:"
    echo "   cd functions && npm run deploy"
    echo ""
    echo "3. 🗄️ Déployer les règles Firestore:"
    echo "   firebase deploy --only firestore"
    echo ""
    echo "4. 🧪 Tester localement:"
    echo "   firebase emulators:start"
    echo "   npm run dev"
    echo ""
    echo "📁 Fichiers créés:"
    echo "   - src/lib/firebase.js"
    echo "   - functions/src/index.ts"
    echo "   - firestore.rules"
    echo "   - firestore.indexes.json"
    echo ""
    echo "🔗 Documentation:"
    echo "   - Firebase: https://firebase.google.com/docs"
    echo "   - Functions: https://firebase.google.com/docs/functions"
    echo "   - Firestore: https://firebase.google.com/docs/firestore"
}

# Fonction principale
main() {
    log_info "Début de la configuration Firebase..."
    
    check_prerequisites
    install_firebase_cli
    authenticate_firebase
    init_firebase_project
    setup_firebase_functions
    setup_firestore_rules
    install_firebase_dependencies
    show_setup_instructions
    
    log_info "🚀 Configuration Firebase terminée!"
}

# Gestion des erreurs
trap 'log_error "Erreur lors de la configuration Firebase."; exit 1' ERR

# Exécution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

