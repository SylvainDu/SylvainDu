# OstéoGestion

Application de gestion de patients pour ostéopathes.

## Fonctionnalités

- ✅ Authentification sécurisée par mot de passe
- ✅ Gestion des fiches patients (coordonnées, antécédents, contre-indications)
- ✅ Historique des consultations
- ✅ Notes de séance structurées (motif, tests, techniques, conseils, suivi)
- ✅ Schéma corporel interactif avec zones cliquables
- ✅ Vue calendrier des consultations
- ✅ Interface responsive (mobile, tablette, ordinateur)
- ✅ Données stockées localement dans votre navigateur

---

## 🚀 Déploiement sur Vercel (Guide pas à pas)

### Étape 1 : Créer un compte GitHub (si vous n'en avez pas)

1. Allez sur **https://github.com**
2. Cliquez sur **Sign up**
3. Suivez les instructions pour créer votre compte

### Étape 2 : Créer un nouveau repository GitHub

1. Connectez-vous à GitHub
2. Cliquez sur le bouton **+** en haut à droite, puis **New repository**
3. Nom du repository : `osteo-gestion`
4. Laissez en **Public** ou **Private** (selon votre préférence)
5. Cliquez sur **Create repository**

### Étape 3 : Uploader les fichiers

1. Sur la page de votre nouveau repository, cliquez sur **uploading an existing file**
2. Glissez-déposez TOUS les fichiers et dossiers du projet
3. Cliquez sur **Commit changes**

**Structure des fichiers à uploader :**
```
osteo-gestion/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

### Étape 4 : Déployer sur Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **Sign Up** et choisissez **Continue with GitHub**
3. Autorisez Vercel à accéder à votre compte GitHub
4. Cliquez sur **Add New... → Project**
5. Trouvez votre repository `osteo-gestion` et cliquez sur **Import**
6. Laissez tous les paramètres par défaut
7. Cliquez sur **Deploy**

### Étape 5 : C'est terminé ! 🎉

Après 1-2 minutes, votre application sera en ligne !

Vous recevrez une URL du type : `https://osteo-gestion-xxxxx.vercel.app`

Vous pouvez personnaliser cette URL dans les paramètres du projet sur Vercel.

---

## 📱 Utilisation

### Première connexion
- Définissez votre mot de passe (minimum 6 caractères)
- Ce mot de passe protège l'accès à vos données

### Ajouter un patient
1. Cliquez sur le bouton **+** (Nouveau)
2. Remplissez les informations
3. Cliquez sur **Enregistrer**

### Ajouter une consultation
1. Sélectionnez un patient
2. Cliquez sur **Nouvelle consultation**
3. Remplissez le formulaire et cliquez sur les zones douloureuses sur le schéma corporel
4. Enregistrez

### Installer sur mobile (comme une app)
Sur votre téléphone :
1. Ouvrez l'URL de votre application dans Safari (iPhone) ou Chrome (Android)
2. **iPhone** : Appuyez sur le bouton Partager → "Sur l'écran d'accueil"
3. **Android** : Menu ⋮ → "Ajouter à l'écran d'accueil"

---

## ⚠️ Important : Sauvegarde des données

Les données sont stockées **localement dans votre navigateur**. Cela signifie :
- Vos données restent sur VOTRE appareil (confidentialité maximale)
- Si vous changez de navigateur ou d'appareil, vous repartez de zéro
- Si vous videz les données du navigateur, les patients seront supprimés

**Recommandation** : Utilisez toujours le même navigateur sur le même appareil pour accéder à votre application.

---

## 🔒 Sécurité

- Mot de passe hashé (SHA-256)
- Données stockées uniquement sur votre appareil
- Aucune donnée envoyée sur un serveur externe
- HTTPS automatique avec Vercel

---

## Support

Pour toute question ou amélioration, n'hésitez pas à demander !
