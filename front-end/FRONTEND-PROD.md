# ✨ Front-End VoisiLab - Configuration Production

## 📊 État actuel

**✅ Déjà configuré** :
- API URL de production : `https://api.fablab.voisilab.online`
- Admin URL de production : `https://admin.fablab.voisilab.online`
- Appels API dynamiques dans tous les composants
- Auto-refresh des données (équipe, blog, équipements, etc.)

**🎯 Composants utilisant l'API** :
- ✅ `home-page-content.tsx` : Blog, Équipements, Ateliers, Innovations, Services, Équipe
- ✅ `lib/api/index.ts` : Services API centralisés
- ✅ Toutes les pages sont prêtes pour la production

## 🔧 Configuration .env

Le fichier `.env` est configuré pour la production :

```env
NEXT_PUBLIC_API_URL=https://api.fablab.voisilab.online
NEXT_PUBLIC_ADMIN_URL=https://admin.fablab.voisilab.online
```

## 📦 Build et Déploiement

### Build Local (Windows)

```powershell
cd front-end
.\build-deploy.ps1
```

Le script va :
1. Nettoyer les builds précédents
2. Installer les dépendances
3. Builder Next.js pour la production
4. Afficher les instructions de déploiement

### Déploiement sur Serveur

#### Option 1: Via Git et PM2 (recommandé)

```bash
# Sur le serveur Hostinger
cd /path/to/voisilab-app/front-end
git pull origin main
npm install
npm run build
pm2 restart voisilab-frontend
pm2 logs voisilab-frontend --lines 50
```

#### Option 2: Upload manuel

1. Build local : `npm run build`
2. Compresser le dossier `.next/`
3. Uploader via FTP/SFTP
4. Redémarrer PM2 : `pm2 restart voisilab-frontend`

## 🧪 Test du Build

Après le build, tester localement :

```bash
npm start
# Ouvre http://localhost:3501
```

Vérifier que :
- ✅ Les données de l'équipe s'affichent
- ✅ Les équipements sont listés
- ✅ Les actualités du blog s'affichent
- ✅ Les ateliers et innovations sont visibles

## 📡 Endpoints API utilisés

Le front-end appelle ces endpoints :

| Endpoint | Usage | Page |
|----------|-------|------|
| `/api/team/active` | Membres d'équipe actifs | Accueil, Équipe |
| `/api/equipment/available` | Équipements disponibles | Accueil, Matériels |
| `/api/blog/published` | Articles publiés | Accueil, Actualités |
| `/api/workshops/published` | Ateliers à venir | Accueil, Ateliers |
| `/api/innovations/published` | Innovations récentes | Accueil, Innovations |
| `/api/services/active` | Services actifs | Accueil, Services |
| `/api/ppn` | Lieux PPN | Carte PPN |
| `/api/contacts` | Soumission formulaire | Contact |
| `/api/project-submissions` | Soumission projet | Projet |

## 🎨 Données affichées

Grâce à la migration des données Docker → Production :
- **7 membres d'équipe** (Hermane, Dallo, etc.)
- **6 équipements** (Imprimantes 3D, Découpeuse Laser, etc.)
- **10 lieux PPN** (PPN Bassam, PPN Daloa, etc.)

## ⚙️ Configuration PM2

Dans `ecosystem.config.js` :

```javascript
{
  name: 'voisilab-frontend',
  cwd: './front-end',
  script: 'node_modules/.bin/next',
  args: 'start -p 3501',
  instances: 1,
  autorestart: true,
  env: {
    NODE_ENV: 'production',
    PORT: 3501
  }
}
```

## 🔒 Reverse Proxy Nginx

Configuration pour `https://fablab.voisilab.online` :

```nginx
server {
    listen 443 ssl;
    server_name fablab.voisilab.online;
    
    location / {
        proxy_pass http://localhost:3501;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚀 Déploiement Rapide

```bash
# Tout en une commande (sur le serveur)
cd /path/to/voisilab-app/front-end && \
git pull && \
npm install && \
npm run build && \
pm2 restart voisilab-frontend && \
pm2 logs voisilab-frontend --lines 20
```

## 📝 Checklist Avant Déploiement

- [ ] Fichier `.env` configuré avec URLs de production
- [ ] Build local réussi sans erreurs
- [ ] Test local fonctionnel (`npm start`)
- [ ] Git commit et push vers `origin main`
- [ ] Backup du serveur effectué
- [ ] PM2 configuré avec `ecosystem.config.js`

## 🎯 URLs de Production

- **Front-End Public** : https://fablab.voisilab.online
- **Admin Dashboard** : https://admin.fablab.voisilab.online
- **API Backend** : https://api.fablab.voisilab.online

## 🆘 Dépannage

### Build échoue
```bash
# Nettoyer et réessayer
rm -rf .next node_modules
npm install
npm run build
```

### Données ne s'affichent pas
- Vérifier que l'API backend est en ligne
- Vérifier les CORS dans le backend
- Consulter les logs PM2 : `pm2 logs voisilab-frontend`
- Vérifier la console du navigateur (F12)

### PM2 ne redémarre pas
```bash
pm2 delete voisilab-frontend
pm2 start ecosystem.config.js --only voisilab-frontend
pm2 save
```
