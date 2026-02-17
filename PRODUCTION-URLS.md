# 🌐 URLs de Production VoisiLab

## Services Déployés

### Backend API ✅
- **URL:** https://api.fablab.voisilab.online
- **Status:** Déployé
- **Port:** 3500 (interne)
- **Framework:** Express.js + TypeScript
- **Hébergement:** Hostinger VPS
- **Logs:** `pm2 logs voisilab-api`

### Front-End (Site Vitrine) 🚧
- **URL:** https://fablab.voisilab.online *(à déployer)*
- **Port:** 3501 (interne)
- **Framework:** Next.js 16
- **Déploiement:** `cd front-end && ./deploy.sh`

### Admin Dashboard 🚧
- **URL:** https://admin.fablab.voisilab.online *(à déployer)*
- **Port:** 3502 (interne)
- **Framework:** Vite + React
- **Déploiement:** `cd admins && ./deploy.sh`

---

## 🔧 Configuration DNS

### Enregistrements DNS nécessaires

Chez votre registrar de domaine (ex: Hostinger, OVH, etc.):

```
Type  | Nom/Host                     | Valeur/Target      | TTL
------|------------------------------|-------------------|------
A     | api.fablab.voisilab.online   | 69.62.106.191     | 3600
A     | fablab.voisilab.online       | 69.62.106.191     | 3600
A     | admin.fablab.voisilab.online | 69.62.106.191     | 3600
```

---

## 📊 Architecture de Déploiement

```
Internet
    │
    ├─> https://api.fablab.voisilab.online
    │   └─> Nginx (reverse proxy) :80/:443
    │       └─> Backend Express :3500
    │           └─> MySQL :3306
    │
    ├─> https://fablab.voisilab.online
    │   └─> Nginx (static files) ou PM2 :3501
    │       └─> Next.js (standalone mode)
    │
    └─> https://admin.fablab.voisilab.online
        └─> Nginx (static files) ou PM2 serve :3502
            └─> React SPA (build statique)
```

---

## 🚀 Déploiement Rapide

### 1. Backend (✅ Déjà déployé)
```bash
ssh jean1@69.62.106.191
cd ~/voisilab/server
./deploy.sh
```

### 2. Front-End
```bash
ssh jean1@69.62.106.191
cd ~/voisilab/front-end
cp .env.production .env
./deploy.sh
```

### 3. Admin Dashboard
```bash
ssh jean1@69.62.106.191
cd ~/voisilab/admins
cp .env.production .env
./deploy.sh
pm2 serve dist 3502 --name voisilab-admin --spa
pm2 save
```

---

## 🔒 SSL/HTTPS

Installer les certificats SSL avec Let's Encrypt:

```bash
# Pour chaque domaine
sudo certbot --nginx -d api.fablab.voisilab.online
sudo certbot --nginx -d fablab.voisilab.online
sudo certbot --nginx -d admin.fablab.voisilab.online

# Renouvellement automatique (déjà configuré par certbot)
sudo certbot renew --dry-run
```

---

## 📝 Configuration Nginx

### Backend API

Fichier: `/etc/nginx/sites-available/voisilab-api`

```nginx
server {
    listen 80;
    server_name api.fablab.voisilab.online;
    
    location / {
        proxy_pass http://localhost:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Front-End

Fichier: `/etc/nginx/sites-available/voisilab-frontend`

```nginx
server {
    listen 80;
    server_name fablab.voisilab.online www.fablab.voisilab.online;
    
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

### Admin Dashboard

Fichier: `/etc/nginx/sites-available/voisilab-admin`

```nginx
server {
    listen 80;
    server_name admin.fablab.voisilab.online;
    
    root /home/jean1/voisilab/admins/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Activer toutes les configurations:**

```bash
sudo ln -s /etc/nginx/sites-available/voisilab-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/voisilab-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/voisilab-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Vérification du Déploiement

### Tester les URLs

```bash
# Backend API
curl -I https://api.fablab.voisilab.online/api/health
# ou
curl https://api.fablab.voisilab.online/api/pages

# Front-End
curl -I https://fablab.voisilab.online

# Admin
curl -I https://admin.fablab.voisilab.online
```

### Vérifier les processus PM2

```bash
pm2 status
# Devrait montrer:
# - voisilab-api (running)
# - voisilab-front (running)
# - voisilab-admin (running)
```

### Vérifier les logs

```bash
# Backend
pm2 logs voisilab-api --lines 50

# Front-End
pm2 logs voisilab-front --lines 50

# Admin
pm2 logs voisilab-admin --lines 50

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 Dépannage

### Service ne répond pas

```bash
# Vérifier le statut
pm2 status

# Redémarrer le service
pm2 restart voisilab-api
pm2 restart voisilab-front
pm2 restart voisilab-admin

# Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t
```

### Erreur 502 Bad Gateway

**Cause:** Le service PM2 n'est pas démarré ou a crashé.

**Solution:**
```bash
pm2 status
pm2 restart <service-name>
pm2 logs <service-name>
```

### Erreur CORS

**Cause:** Backend n'autorise pas le domaine frontend.

**Solution:**

Dans `server/.env`:
```env
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online
```

Puis:
```bash
pm2 restart voisilab-api
```

---

## 📊 Monitoring

### Surveillance des ressources

```bash
# Voir l'utilisation CPU/Mémoire
pm2 monit

# Dashboard web PM2 (optionnel)
pm2 plus
```

### Logs centralisés

```bash
# Tous les logs PM2
pm2 logs

# Logs d'un service spécifique
pm2 logs voisilab-api
```

---

## 🔄 Workflow de Mise à Jour

**Quand vous faites des changements:**

```bash
# 1. Sur votre machine locale
git add .
git commit -m "Nouvelle fonctionnalité"
git push

# 2. Sur le serveur
ssh jean1@69.62.106.191

# Backend
cd ~/voisilab/server && ./deploy.sh

# Front-End
cd ~/voisilab/front-end && ./deploy.sh

# Admin
cd ~/voisilab/admins && ./deploy.sh
pm2 restart voisilab-admin
```

---

## 📧 Support

- **Serveur SSH:** jean1@69.62.106.191
- **Hébergement:** Hostinger VPS
- **Base de données:** MySQL (Hostinger Cloud)
  - Host: srv1579.hstgr.io
  - Database: u705315732_fablab

---

**Dernière mise à jour:** 17 février 2026
**Version:** 2.0.0
