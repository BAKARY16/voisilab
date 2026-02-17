# ✅ Configuration Front-End - Prêt pour Production

## 🎯 État Actuel

**✅ Configuration complète** :
- ✅ `.env` configuré avec API de production
- ✅ Tous les composants utilisent l'API dynamiquement
- ✅ Auto-refresh des données toutes les 15s
- ✅ Script de build `build-deploy.ps1` prêt
- ✅ 7 membres d'équipe migrés en production
- ✅ 6 équipements disponibles
- ✅ 10 lieux PPN actifs
- ✅ 3 articles de blog publiés

## 📊 Test des Endpoints (Résultats)

| Endpoint | Statut | Données |
|----------|--------|---------|
| Team (active) | ✅ 200 | 7 membres |
| Equipment (available) | ✅ 200 | 6 équipements |
| Blog (published) | ✅ 200 | 3 articles |
| PPN Locations | ✅ 200 | 10 lieux |
| Innovations | ✅ 200 | 0 (table vide) |
| Services | ✅ 200 | 1 service |
| Workshops | ❌ 500 | Backend à corriger |

## 🚀 Build et Déploiement

### Build Local (Windows)

```powershell
cd front-end
.\build-deploy.ps1
```

### Build Manuel

```bash
# Installation
npm install

# Build production
npm run build

# Test local
npm start
# Ouvre http://localhost:3501
```

### Déploiement sur Serveur

```bash
# SSH vers le serveur
ssh user@your-server

# Aller dans le dossier
cd /path/to/voisilab-app/front-end

# Mise à jour
git pull origin main
npm install
npm run build

# Redémarrer PM2
pm2 restart voisilab-frontend
pm2 logs voisilab-frontend --lines 50
```

## 📁 Structure

```
front-end/
├── .env                    # ✅ Production URLs configurées
├── build-deploy.ps1        # ✅ Script Windows de build
├── package.json            # ✅ Dépendances et scripts
├── next.config.mjs         # ✅ Config Next.js
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── equipe/            # Page équipe
│   ├── materiels/         # Page équipements
│   ├── actualites/        # Page blog/news
│   ├── ateliers/          # Page workshops
│   ├── innovations/       # Page innovations
│   └── ppn/               # Carte PPN
├── components/
│   └── home-page-content.tsx  # ✅ Utilise API pour tout
└── lib/
    └── api/
        └── index.ts       # ✅ Services API centralisés
```

## 🔧 Variables d'Environnement

**Fichier `.env` actuel** :
```env
NEXT_PUBLIC_API_URL=https://api.fablab.voisilab.online
NEXT_PUBLIC_ADMIN_URL=https://admin.fablab.voisilab.online
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_b58tz46
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=MvM03335Gb31btkA5
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XiFhBa572W9B08-q-7Enb
NEXT_PUBLIC_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
```

## 🎨 Pages Configurées

Toutes les pages utilisent l'API de production :

- **Accueil** (`/`) - home-page-content.tsx
  - ✅ Team members via `/api/team/active`
  - ✅ Equipment via `/api/equipment/available`
  - ✅ Blog posts via `/api/blog/published`
  - ✅ Workshops via `/api/workshops/published`
  - ✅ Innovations via `/api/innovations/published`
  - ✅ Services via `/api/services/active`

- **Équipe** (`/equipe`) - Données hardcodées (à migrer vers API si besoin)
- **Matériels** (`/materiels`) - Utilise API équipements
- **Actualités** (`/actualites`) - Utilise API blog
- **Ateliers** (`/ateliers`) - Utilise API workshops
- **Innovations** (`/innovations`) - Utilise API innovations
- **PPN** (`/ppn`) - Utilise API ppn locations

## ⚙️ Configuration PM2

Dans `ecosystem.config.js` (racine du projet) :

```javascript
{
  name: 'voisilab-frontend',
  cwd: './front-end',
  script: 'node_modules/.bin/next',
  args: 'start -p 3501',
  instances: 1,
  autorestart: true,
  watch: false,
  env: {
    NODE_ENV: 'production',
    PORT: 3501
  }
}
```

## 🌐 URLs de Production

- **Front-End Public** : https://fablab.voisilab.online
- **Admin Dashboard** : https://admin.fablab.voisilab.online
- **API Backend** : https://api.fablab.voisilab.online

## 📋 Checklist de Déploiement

- [x] `.env` configuré avec URLs de production
- [x] API backend en ligne et accessible
- [x] Données migrées en production (7 team, 6 equipment, 10 PPN)
- [x] Services API créés dans `lib/api/index.ts`
- [x] Composants adaptés pour utiliser l'API
- [x] Auto-refresh configuré (15s)
- [x] Script de build `build-deploy.ps1` créé
- [ ] Build local testé
- [ ] Code poussé sur Git
- [ ] Déploiement sur serveur
- [ ] PM2 redémarré
- [ ] Test final sur https://fablab.voisilab.online

## ✨ Prochaines Étapes

1. **Build local** :
   ```powershell
   cd front-end
   .\build-deploy.ps1
   ```

2. **Test local** :
   ```bash
   npm start
   # Vérifier http://localhost:3501
   ```

3. **Commit & Push** :
   ```bash
   git add -A
   git commit -m "feat: Front-end prêt pour production avec API"
   git push origin main
   ```

4. **Déployer sur serveur** :
   ```bash
   # Sur le serveur
   cd /path/to/voisilab-app/front-end
   git pull && npm install && npm run build
   pm2 restart voisilab-frontend
   ```

5. **Vérifier** :
   - Ouvrir https://fablab.voisilab.online
   - Vérifier que les données s'affichent
   - Consulter les logs : `pm2 logs voisilab-frontend`

## 🆘 Dépannage

### Données ne s'affichent pas
- Vérifier que l'API backend est en ligne : https://api.fablab.voisilab.online/health
- Vérifier CORS dans le backend (doit autoriser fablab.voisilab.online)
- Consulter la console du navigateur (F12)

### Build échoue
```bash
# Nettoyage complet
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### PM2 problème
```bash
pm2 delete voisilab-frontend
pm2 start ecosystem.config.js --only voisilab-frontend
pm2 save
```

---

**Créé le :** 17 février 2026  
**Environnement :** Production Hostinger  
**Status :** ✅ Prêt pour déploiement
