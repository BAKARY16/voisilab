# 🚀 Guide de Déploiement Front-End VoisiLab

## 📋 Pré-requis

- Node.js 18+ installé
- npm ou pnpm installé
- Accès au serveur de déploiement
- Variables d'environnement configurées

## 🔧 Configuration

### 1. Variables d'environnement

Le front-end utilise les variables suivantes (déjà configurées dans `.env.production`) :

```env
# API Backend (Production)
NEXT_PUBLIC_API_URL=https://api.fablab.voisilab.online

# Admin Dashboard
NEXT_PUBLIC_ADMIN_URL=https://admin.fablab.voisilab.online

# EmailJS (Contact forms)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_b58tz46
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=MvM03335Gb31btkA5
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XiFhBa572W9B08-q-7Enb

# Supabase (Optionnel)
NEXT_PUBLIC_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
```

## 🏗️ Build en Local

```bash
# Installation des dépendances
npm install
# ou
pnpm install

# Build pour la production
npm run build

# Test du build en local
npm start
```

Le build sera dans le dossier `.next/`.

## 🌐 Déploiement sur Serveur

### Option 1: Déploiement avec PM2 (Recommandé)

```bash
# 1. Sur votre machine locale
git add -A
git commit -m "chore: Configure front-end for production API"
git push origin main

# 2. Sur le serveur (via SSH)
cd /path/to/voisilab-app/front-end

# Récupérer les modifications
git pull origin main

# Installer/Mettre à jour les dépendances
npm install

# Build de production
npm run build

# Redémarrer avec PM2
pm2 restart voisilab-frontend

# Vérifier les logs
pm2 logs voisilab-frontend --lines 50
```

### Option 2: Build Standalone

```bash
# Build avec l'option standalone (déjà configuré dans next.config.mjs)
npm run build

# Le dossier .next/standalone contient tout le nécessaire
# Copier ce dossier sur le serveur et exécuter:
node .next/standalone/server.js
```

## 🔍 Vérification

Après déploiement, vérifiez :

1. **Page d'accueil** : https://fablab.voisilab.online
   - Les sections Team, Equipment, Workshops, Innovations chargent les données de l'API
   - Les images s'affichent correctement

2. **Navigation** :
   - /equipe - Affiche les membres depuis l'API
   - /materiels - Affiche les équipements depuis l'API
   - /ateliers - Affiche les ateliers
   - /innovations - Affiche les innovations
   - /ppn - Affiche la carte des PPN

3. **API Backend** :
   ```bash
   # Tester que le front-end communique bien avec l'API
   curl https://api.fablab.voisilab.online/api/team
   curl https://api.fablab.voisilab.online/api/equipment
   ```

## ⚡ Optimisations Production

Le front-end est configuré pour :

- ✅ Récupération dynamique des données depuis l'API
- ✅ Fallback vers données par défaut si API indisponible  
- ✅ Cache désactivé (`cache: 'no-store'`) pour données toujours fraîches
- ✅ Build standalone pour déploiement facile
- ✅ Compression et optimisation automatique des images
- ✅ Server-side rendering (SSR) pour performance SEO

## 🐛 Résolution de problèmes

### Les données ne s'affichent pas

```bash
# Vérifier la connexion à l'API
curl https://api.fablab.voisilab.online/api/team

# Vérifier les logs du front-end
pm2 logs voisilab-frontend
```

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :
- Vérifier que le backend autorise `https://fablab.voisilab.online`
- Vérifier le fichier `server/src/config/cors.ts`

### Build échoue

```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run build
```

## 📦 Structure de Déploiement

```
front-end/
├── .next/                    # Build output
│   ├── standalone/          # Version standalone (production)
│   └── static/              # Assets statiques
├── .env.production          # Variables d'environnement production
├── next.config.mjs          # Configuration Next.js
└── package.json             # Dépendances
```

## 🔄 Mises à jour

Pour mettre à jour le front-end en production :

```bash
git pull origin main
npm install       # Si nouvelles dépendances
npm run build
pm2 restart voisilab-frontend
```

## ✨ Fonctionnalités API Intégrées

Le front-end récupère maintenant automatiquement :

- 👥 **Team Members** - `/api/team`
- 🔧 **Equipment** - `/api/equipment`
- 🎓 **Workshops** - `/api/workshops`
- 💡 **Innovations** - `/api/innovations`
- 📍 **PPN Locations** - `/api/ppn`
- 📝 **Blog Posts** - `/api/blog`

Toutes les sections s'adaptent automatiquement aux données retournées par l'API.
