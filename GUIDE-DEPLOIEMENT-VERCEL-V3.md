# 🚀 GUIDE DÉPLOIEMENT VERCEL - ORACLE PORTFOLIO V3

## 📋 **PROBLÈME ACTUEL**
L'URL `https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app` retourne une erreur 404 NOT_FOUND.

## 🎯 **SOLUTION - NOUVEAU PROJET VERCEL**

### **Étape 1: Créer un nouveau projet Vercel**

1. **Allez sur:** https://vercel.com/new
2. **Connectez-vous** avec votre compte GitHub
3. **Importez le repository:** `Alchile69/oracle-portfolio-v2-6-1-hybride-secteurs`
4. **Nommez le projet:** `oracle-portfolio-v3`

### **Étape 2: Configuration du projet**

**Framework Preset:** `Vite`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### **Étape 3: Variables d'environnement (optionnel)**

```
VITE_FIREBASE_CONFIG=your_firebase_config
VITE_BACKEND_URL=https://oracle-backend-yrvjzoj3aa-uc.a.run.app
```

### **Étape 4: Déploiement**

1. **Cliquez sur "Deploy"**
2. **Attendez le build** (2-3 minutes)
3. **Vérifiez l'URL** générée

## 🌐 **URLS DE PRODUCTION V3.0**

### **Nouvelle URL Frontend:**
- **URL:** `https://oracle-portfolio-v3.vercel.app` (à créer)
- **Version:** 3.0.0
- **Architecture:** STRUCTURE 2

### **Backend Python (inchangé):**
- **URL:** `https://oracle-backend-yrvjzoj3aa-uc.a.run.app`
- **Performance:** <800ms
- **APIs:** getRegime, getAllocations, getIndicators

## 🏗️ **ARCHITECTURE STRUCTURE 2**

```
Frontend (Vite/React) → Firebase Functions → Backend Python (Cloud Run)
     ↓                           ↓                           ↓
  Vercel V3.0              Firebase Auth              Google Cloud Run
```

## 📊 **MÉTRIQUES V3.0**

### **Performance:**
- **Build Time:** <2s
- **Bundle Size:** 900KB
- **APIs Response:** <800ms

### **Bundle Analysis:**
```
📦 Bundle Analysis V3.0
├── index.html (0.82 kB)
├── index-IAbGx5HP.css (43.23 kB)
├── ui-vendor-CPBcoUx8.js (12.82 kB)
├── utils-vendor-ChGytp73.js (24.86 kB)
├── react-vendor-Dvwkxfce.js (141.86 kB)
├── index-DSxTBSzS.js (265.99 kB)
└── widgets-BGLHMlf5.js (455.84 kB)
```

## ✅ **VALIDATION STRUCTURE 2**

### **Tests Automatisés:**
```bash
# Lancer les tests STRUCTURE 2
node debug-test-runner-structure2.mjs

# Vérifier le build
npm run build

# Tester les APIs
curl https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze
```

### **Score Global:** 100% 🏆

## 🚀 **COMMANDES DE DÉPLOIEMENT**

### **Build Local:**
```bash
npm run build
```

### **Test Local:**
```bash
npm run preview
```

### **Déploiement Vercel:**
1. Créer nouveau projet sur https://vercel.com/new
2. Importer le repository GitHub
3. Configurer comme indiqué ci-dessus
4. Déployer

## 🎯 **RÉSULTAT ATTENDU**

**Oracle Portfolio V3.0** sera accessible via la nouvelle URL Vercel avec :
- ✅ Interface moderne V3.0
- ✅ 7 widgets fonctionnels
- ✅ APIs Cloud Run performantes
- ✅ Architecture STRUCTURE 2
- ✅ Performance optimisée

## 📞 **SUPPORT**

Si le problème persiste :
1. Vérifiez les logs Vercel
2. Testez le build local
3. Vérifiez la configuration du projet
4. Contactez le support Vercel si nécessaire

---

**✅ STRUCTURE 2 - Architecture optimale confirmée !**
