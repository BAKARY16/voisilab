# Guide de Déploiement VoisiLab - PM2

## Table des matières
1. [Prérequis](#prérequis)
2. [Architecture](#architecture)
3. [Configuration serveur](#configuration-serveur)
4. [Installation](#installation)
5. [Configuration PM2](#configuration-pm2)
6. [Variables d'environnement](#variables-denvironnement)
7. [Base de données](#base-de-données)
8. [Nginx (Reverse Proxy)](#nginx-reverse-proxy)
9. [SSL avec Certbot](#ssl-avec-certbot)
10. [Commandes utiles](#commandes-utiles)
11. [Troubleshooting](#troubleshooting)

---

## Prérequis

- **Serveur**: Ubuntu 20.04+ ou Debian 11+
- **Node.js**: 20 LTS
- **PM2**: Installé globalement
- **Nginx**: Pour reverse proxy
- **Certbot**: Pour SSL (optionnel)

### Installation des prérequis
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# pnpm (pour le frontend)
sudo npm install -g pnpm

# Nginx
sudo apt-get install -y nginx

# Certbot (SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VoisiLab Platform                         │
├──────────────────┬───────────────────┬──────────────────────┤
│   Frontend       │   Admin Panel     │   Backend API        │
│   (Next.js)      │   (React/Vite)    │   (Express/TS)       │
│   Port: 3501     │   Port: 3502      │   Port: 3500         │
└────────┬─────────┴─────────┬─────────┴──────────┬───────────┘
         │                   │                    │
         └───────────────────┼────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   MySQL (Hostinger) │
                    │   srv1579.hstgr.io  │
                    └─────────────────────┘
```

### Ports
| Service      | Port  | Description              |
|--------------|-------|--------------------------|
| Backend API  | 3500  | API REST Express         |
| Frontend     | 3501  | Site public Next.js      |
| Admin Panel  | 3502  | Panel admin React/Vite   |

---

## Configuration serveur

### 1. Cloner le projet
```bash
cd /var/www
git clone https://github.com/votre-repo/voisilab-app.git
cd voisilab-app
```

### 2. Permissions
```bash
sudo chown -R $USER:$USER /var/www/voisilab-app
chmod -R 755 /var/www/voisilab-app
```

---

## Installation

### Backend (Express/TypeScript)
```bash
cd /var/www/voisilab-app/server
npm install
npm run build
```

### Frontend (Next.js)
```bash
cd /var/www/voisilab-app/front-end
pnpm install
pnpm build
```

### Admin Panel (React/Vite)
```bash
cd /var/www/voisilab-app/admins
npm install
npm run build
```

---

## Configuration PM2

### Créer le fichier ecosystem.config.js
Créer à la racine du projet `/var/www/voisilab-app/ecosystem.config.js` :

```javascript
module.exports = {
  apps: [
    {
      name: 'voisilab-backend',
      cwd: '/var/www/voisilab-app/server',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3500
      }
    },
    {
      name: 'voisilab-frontend',
      cwd: '/var/www/voisilab-app/front-end',
      script: 'node_modules/.bin/next',
      args: 'start -p 3501',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3501
      }
    },
    {
      name: 'voisilab-admin',
      cwd: '/var/www/voisilab-app/admins',
      script: 'node_modules/.bin/serve',
      args: '-s dist -l 3502',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Installer serve pour l'admin
```bash
cd /var/www/voisilab-app/admins
npm install serve --save-dev
```

### Démarrer les applications
```bash
cd /var/www/voisilab-app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Variables d'environnement

### Backend (.env dans /server)
Créer `/var/www/voisilab-app/server/.env` :

```env
NODE_ENV=production
PORT=3500

# Base de données Hostinger
DATABASE_HOST=srv1579.hstgr.io
DATABASE_PORT=3306
DATABASE_NAME=u705315732_fablab
DATABASE_USER=u705315732_sinon
DATABASE_PASSWORD=dHpLIN+M8h

# JWT - IMPORTANT: Générer une clé sécurisée
JWT_SECRET=votre_cle_jwt_super_securisee_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=https://votre-domaine.com
ADMIN_URL=https://admin.votre-domaine.com
CORS_ORIGINS=https://votre-domaine.com,https://admin.votre-domaine.com

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local dans /front-end)
Créer `/var/www/voisilab-app/front-end/.env.local` :

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

### Admin (.env dans /admins)
Créer `/var/www/voisilab-app/admins/.env` :

```env
VITE_API_URL=https://api.votre-domaine.com
VITE_APP_NAME=VoisiLab Admin
```

---

## Base de données

### Les tables sont déjà créées sur Hostinger
La base de données `u705315732_fablab` contient maintenant :
- ✅ users
- ✅ notifications  
- ✅ team_members
- ✅ contacts
- ✅ project_submissions
- ✅ services
- ✅ workshops
- ✅ workshop_registrations
- ✅ equipment
- ✅ innovations
- ✅ blog_posts
- ✅ ppn_locations
- ✅ pages
- ✅ settings
- ✅ media

### Créer un compte admin
```bash
cd /var/www/voisilab-app/server
node create-admin.js
```

Ou avec le script interactif, il vous demandera :
- Email
- Mot de passe
- Nom

---

## Nginx (Reverse Proxy)

### Configuration recommandée
Créer `/etc/nginx/sites-available/voisilab` :

```nginx
# Frontend (Site public)
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:3501;
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

# Backend API
server {
    listen 80;
    server_name api.votre-domaine.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Fichiers uploads statiques
    location /uploads {
        alias /var/www/voisilab-app/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Admin Panel
server {
    listen 80;
    server_name admin.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:3502;
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

### Activer la configuration
```bash
sudo ln -s /etc/nginx/sites-available/voisilab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL avec Certbot

### Générer les certificats
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
sudo certbot --nginx -d api.votre-domaine.com
sudo certbot --nginx -d admin.votre-domaine.com
```

### Renouvellement automatique
```bash
sudo certbot renew --dry-run
```

---

## Commandes utiles

### PM2
```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs
pm2 logs voisilab-backend
pm2 logs voisilab-frontend

# Redémarrer une app
pm2 restart voisilab-backend
pm2 restart all

# Arrêter
pm2 stop all

# Supprimer
pm2 delete all

# Monitoring
pm2 monit
```

### Mise à jour du code
```bash
cd /var/www/voisilab-app
git pull origin main

# Rebuild backend
cd server
npm install
npm run build
pm2 restart voisilab-backend

# Rebuild frontend
cd ../front-end
pnpm install
pnpm build
pm2 restart voisilab-frontend

# Rebuild admin
cd ../admins
npm install
npm run build
pm2 restart voisilab-admin
```

---

## Troubleshooting

### L'API ne répond pas
```bash
# Vérifier les logs
pm2 logs voisilab-backend --lines 50

# Vérifier si le port est utilisé
sudo lsof -i :3500

# Redémarrer
pm2 restart voisilab-backend
```

### Erreur de connexion DB
Vérifier que l'IP du serveur est autorisée dans Hostinger :
1. Aller sur hPanel Hostinger
2. Bases de données > MySQL
3. Accès distant > Ajouter l'IP du serveur

### Le frontend ne charge pas
```bash
# Vérifier le build
cd /var/www/voisilab-app/front-end
ls -la .next

# Si vide, rebuild
pnpm build
pm2 restart voisilab-frontend
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que les apps tournent
pm2 status

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Problèmes de permissions uploads
```bash
sudo chown -R www-data:www-data /var/www/voisilab-app/server/uploads
sudo chmod -R 755 /var/www/voisilab-app/server/uploads
```

---

## Checklist de déploiement

- [ ] Code cloné sur le serveur
- [ ] Node.js 20 installé
- [ ] PM2 installé globalement
- [ ] npm install dans /server
- [ ] pnpm install dans /front-end  
- [ ] npm install dans /admins
- [ ] Fichiers .env créés (server, front-end, admins)
- [ ] Backend buildé (`npm run build` dans /server)
- [ ] Frontend buildé (`pnpm build` dans /front-end)
- [ ] Admin buildé (`npm run build` dans /admins)
- [ ] ecosystem.config.js créé
- [ ] PM2 démarré (`pm2 start ecosystem.config.js`)
- [ ] Nginx configuré
- [ ] SSL activé avec Certbot
- [ ] Compte admin créé
- [ ] Test de l'API : `curl https://api.votre-domaine.com/api/health`

---

## Contacts

En cas de problème, vérifier :
1. Les logs PM2 : `pm2 logs`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. Le statut des services : `pm2 status`
