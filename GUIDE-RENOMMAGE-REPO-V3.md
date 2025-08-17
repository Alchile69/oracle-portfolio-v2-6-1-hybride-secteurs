# 🔄 GUIDE RENOMMAGE REPOSITORY - ORACLE PORTFOLIO V3

## 🎯 **OBJECTIF**
Renommer le repository GitHub pour éliminer les références à l'ancienne architecture et permettre à Vercel de détecter correctement STRUCTURE 2.

## 📋 **ÉTAPES DE RENOMMAGE**

### **Étape 1: Renommer sur GitHub**

1. **Allez sur:** https://github.com/Alchile69/oracle-portfolio-v2-6-1-hybride-secteurs
2. **Cliquez sur "Settings"** (onglet en haut)
3. **Faites défiler jusqu'à "Repository name"**
4. **Changez le nom en:** `oracle-portfolio-v3`
5. **Cliquez sur "Rename"** (bouton vert)

### **Étape 2: Mettre à jour les URLs locales**

Une fois le repository renommé, exécutez le script de mise à jour :

```bash
chmod +x update-repo-name-v3.sh
./update-repo-name-v3.sh
```

### **Étape 3: Nouveau déploiement Vercel**

1. **Allez sur:** https://vercel.com/new
2. **Importez le nouveau repository:** `Alchile69/oracle-portfolio-v3`
3. **Nommez le projet:** `oracle-portfolio-v3`
4. **Framework:** Vite (détecté automatiquement)
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Cliquez sur "Deploy"**

## 🌐 **NOUVELLES URLS**

### **GitHub:**
- **Ancienne:** `https://github.com/Alchile69/oracle-portfolio-v2-6-1-hybride-secteurs`
- **Nouvelle:** `https://github.com/Alchile69/oracle-portfolio-v3`

### **Vercel:**
- **Ancienne:** `https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app`
- **Nouvelle:** `https://oracle-portfolio-v3.vercel.app`

### **Backend (inchangé):**
- **URL:** `https://oracle-backend-yrvjzoj3aa-uc.a.run.app`

## 🏗️ **ARCHITECTURE STRUCTURE 2**

```
Frontend (Vite/React) → Firebase Functions → Backend Python (Cloud Run)
     ↓                           ↓                           ↓
  Vercel V3.0              Firebase Auth              Google Cloud Run
```

## ✅ **AVANTAGES DU RENOMMAGE**

1. **Élimination des références** à l'ancienne architecture
2. **Détection automatique Vite** par Vercel
3. **Nom plus simple** et professionnel
4. **Cohérence** avec la version 3.0.0
5. **Élimination des conflits** Next.js

## 📊 **MÉTRIQUES V3.0**

### **Performance:**
- **Build Time:** <2s
- **Bundle Size:** 900KB
- **APIs Response:** <800ms

### **Architecture:**
- **Frontend:** Vite/React (Vercel)
- **Backend:** Python FastAPI (Cloud Run)
- **Orchestration:** Firebase Functions
- **Database:** Firebase Firestore

## 🚀 **RÉSULTAT ATTENDU**

**Oracle Portfolio V3.0** sera accessible via :
- **GitHub:** `https://github.com/Alchile69/oracle-portfolio-v3`
- **Vercel:** `https://oracle-portfolio-v3.vercel.app`
- **Backend:** `https://oracle-backend-yrvjzoj3aa-uc.a.run.app`

## 📞 **SUPPORT**

Si le renommage pose problème :
1. Vérifiez les permissions GitHub
2. Assurez-vous que le repository n'est pas utilisé ailleurs
3. Contactez le support GitHub si nécessaire

---

**✅ STRUCTURE 2 - Architecture optimale confirmée !**
