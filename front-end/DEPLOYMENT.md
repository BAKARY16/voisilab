# Guide de Déploiement - Voisilab Front-End

## 📦 Prérequis

- Node.js 18+ installé sur le serveur
- npm (pas besoin de pnpm en production)
- PM2 pour la gestion des processus (optionnel mais recommandé)
- Accès SSH au serveur

## 🚀 Déploiement Initial

### 1. Sur votre machine locale

```bash
# Pousser les derniers changements
git add .
git commit -m "Prêt pour le déploiement"
git push
```

### 2. Sur le serveur (SSH)

```bash
# Se connecter au serveur
ssh jean1@69.62.106.191

# Naviguer vers le dossier du projet
cd ~/voisilab/front-end

# Récupérer les dernières modifications
git pull

# Installer les dépendances (utiliser npm, pas pnpm)
npm install

# Build l'application
npm run build

# Lancer avec PM2
pm2 start npm --name "voisilab-front" -- start
pm2 save
```

## 🔄 Mise à jour du déploiement

Quand vous faites des modifications :

```bash
# Sur le serveur
cd ~/voisilab/front-end
git pull
npm install  # Si de nouvelles dépendances
npm run build
pm2 restart voisilab-front
```

## ⚙️ Configuration Production

### Variables d'environnement

Créer un fichier `.env` sur le serveur avec :

```env
# Backend API URL (Production)
NEXT_PUBLIC_API_URL=https://uvci.online/api

# Admin Dashboard URL (Production)
NEXT_PUBLIC_ADMIN_URL=https://uvci.online/admin

# EmailJS (si utilisé)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_b58tz46
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=MvM03335Gb31btkA5
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XiFhBa572W9B08-q-7Enb

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
```

**Important :** Ajustez `NEXT_PUBLIC_API_URL` selon votre configuration serveur.

## 🐛 Résolution de problèmes

### Erreur "pnpm not found"

**Solution :** Utiliser `npm` au lieu de `pnpm` sur le serveur :
```bash
npm run build
npm start
```

### Erreur "Could not find a production build"

**Cause :** Le build n'a pas été exécuté ou a échoué.

**Solution :**
```bash
npm run build
```

### Build qui se bloque

**Cause :** Mémoire insuffisante ou processus en arrière-plan.

**Solution :**
```bash
# Arrêter les processus node en cours
pm2 stop all
# ou
killall node

# Relancer le build
npm run build
```

### Port déjà utilisé

Si le port 3501 est déjà utilisé :

```bash
# Voir qui utilise le port
lsof -i :3501

# Arrêter le processus
pm2 stop voisilab-front
# ou
kill -9 <PID>
```

## 📊 Commandes PM2 utiles

```bash
# Voir les logs
pm2 logs voisilab-front

# Voir le status
pm2 status

# Redémarrer
pm2 restart voisilab-front

# Arrêter
pm2 stop voisilab-front

# Supprimer
pm2 delete voisilab-front
```

## 🔒 Sécurité

- Les fichiers `.env` ne sont **jamais** committés dans Git
- Utilisez `.env.production` comme template
- Changez les clés API en production si nécessaire

## 📝 Notes

- L'application utilise le port **3501** par défaut
- Next.js utilise le mode `standalone` pour l'optimisation
- Les images sont en mode `unoptimized` pour la compatibilité
