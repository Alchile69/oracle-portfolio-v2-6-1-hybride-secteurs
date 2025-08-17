import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oracle-portfolio-prod.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oracle-portfolio-prod",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oracle-portfolio-prod.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "777864688867",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:777864688867:web:XXXXXXXXXXXXXXXXXXXX"
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
    
    return await addDoc(regimesRef, {
      ...regimeData,
      createdAt: serverTimestamp(),
      userId: auth.currentUser?.uid
    });
  },

  // Récupération des données utilisateur
  async getUserData(userId) {
    const { doc, getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  }
};

// Configuration d'authentification
export const authConfig = {
  // Méthodes d'authentification disponibles
  signInMethods: ['email', 'google'],
  
  // Configuration des redirections
  redirectUrl: window.location.origin,
  
  // Configuration des sessions
  sessionTimeout: 60 * 60 * 1000, // 1 heure
};

export default app;
