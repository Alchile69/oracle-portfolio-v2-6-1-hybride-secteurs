# ⚡ GUIDE DE DÉMARRAGE RAPIDE - Oracle Portfolio V2.6.0

## 🚀 **INSTALLATION EN 3 MINUTES**

### **1️⃣ EXTRACTION ET INSTALLATION**
```bash
# Extraire le ZIP
unzip oracle-portfolio-v2.6.0-COMPLET.zip
cd oracle-portfolio-v2.6.0-COMPLET

# Installation (OBLIGATOIRE : --legacy-peer-deps)
npm install --legacy-peer-deps
```

### **2️⃣ DÉMARRAGE LOCAL**
```bash
# Démarrage développement
npm run dev

# ✅ Accessible sur http://localhost:5173
```

### **3️⃣ CONNEXION ET TEST**
```bash
# Ouvrir http://localhost:5173
# Login: admin
# Password: scalabla2025

# Tester: Configuration ⚙️ → Régimes → Clic ✏️
```

---

## 🎯 **DÉPLOIEMENT PRODUCTION**

### **🚀 VERCEL (RECOMMANDÉ)**
```bash
# Utiliser le script automatisé
./deploy-vercel-v2.6.0.sh

# OU manuellement
npm run build
vercel --prod
```

### **🔥 FIREBASE**
```bash
npm run build
firebase deploy
```

---

## ✅ **VALIDATION RAPIDE**

### **🔍 CHECKLIST 2 MINUTES**
- [ ] `npm install --legacy-peer-deps` → ✅ Sans erreur
- [ ] `npm run dev` → ✅ Serveur démarre
- [ ] Ouvrir http://localhost:5173 → ✅ Page charge
- [ ] Login admin/scalabla2025 → ✅ Connexion réussie
- [ ] Menu Configuration → ✅ Accessible
- [ ] Régimes → Clic ✏️ → ✅ Modal s'ouvre

### **🎯 FONCTIONNALITÉS CLÉS À TESTER**
1. **Dashboard** → Vue d'ensemble
2. **Analytics** → Graphiques et données
3. **Configuration** ⚙️ → **MENU PRINCIPAL V2.6.0**
   - **Indicateurs** 🔬 → Clic ✏️ → Modal d'édition
   - **Formules** 🧮 → Clic ✏️ → Modal d'édition
   - **Régimes** 📊 → Clic ✏️ → Modal d'édition
   - **Plugins** 🔌 → Système extensible

---

## 🔧 **RÉSOLUTION RAPIDE**

### **❌ ERREUR : npm install failed**
```bash
# Solution
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **❌ ERREUR : Build failed avec date-fns**
```bash
# Solution
npm uninstall date-fns
npm install date-fns@3.6.0 --save
npm run build
```

### **❌ ERREUR : editItem is not defined**
```bash
# Vérifier que ExtensibleConfigurationPanel.jsx contient editItem
grep -n "const editItem" src/components/admin/ExtensibleConfigurationPanel.jsx
# Doit retourner: 282:  const editItem = (type, id) => {
```

---

## 📞 **SUPPORT IMMÉDIAT**

### **🎯 DÉMONSTRATION LIVE**
- **URL** : https://zyiqtrqx.manus.space
- **Login** : admin / scalabla2025
- **Test** : Configuration → Régimes → Clic ✏️

### **📋 FICHIERS CRITIQUES**
```
src/components/admin/ExtensibleConfigurationPanel.jsx  # ⭐ CRUD complet
src/hooks/useAPI.js                                   # ⭐ Données 15 pays
package.json                                          # ⭐ React 19 + Vite 6
vite.config.js                                        # ⭐ Config hybride
vercel.json                                           # ⭐ Déploiement
```

### **🎯 COMMANDES ESSENTIELLES**
```bash
npm install --legacy-peer-deps  # Installation
npm run dev                     # Développement
npm run build                   # Production
npm run preview                 # Test build
./deploy-vercel-v2.6.0.sh      # Déploiement auto
```

---

## 🎉 **RÉSULTAT ATTENDU**

### **✅ APRÈS INSTALLATION RÉUSSIE**
- ✅ **Serveur local** sur http://localhost:5173
- ✅ **Connexion admin** fonctionnelle
- ✅ **Menu Configuration** accessible
- ✅ **Icônes crayon ✏️** cliquables
- ✅ **Modal d'édition** s'ouvre avec données pré-remplies
- ✅ **Sauvegarde** fonctionnelle avec notifications

### **✅ APRÈS DÉPLOIEMENT RÉUSSI**
- ✅ **URL publique** accessible
- ✅ **Performance** optimisée
- ✅ **Toutes fonctionnalités** opérationnelles
- ✅ **Interface responsive** mobile/desktop

---

**⚡ Oracle Portfolio V2.6.0 - Prêt en 3 minutes !**

*Guide de démarrage rapide - Version complète avec CRUD opérationnel*

