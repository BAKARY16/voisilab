# Guide de Déploiement - VoisiLab Admin Dashboard

## 📦 Prérequis

- Node.js 18+ installé sur le serveur
- npm installé
- Serveur web (Nginx recommandé) ou PM2
- Accès SSH au serveur

## 🚀 Déploiement Initial

### 1. Sur votre machine locale

```bash
# Pousser les derniers changements
git add .
git commit -m "Prêt pour le déploiement admin"
git push
```

### 2. Sur le serveur (SSH)

```bash
# Se connecter au serveur
ssh jean1@69.62.106.191

# Naviguer vers le dossier du projet
cd ~/voisilab/admins

# Récupérer les dernières modifications
git pull

# Installer les dépendances
npm install

# Copier le fichier de configuration de production
cp .env.production .env

# Ou éditer le .env pour ajuster l'URL de l'API
nano .env  # VITE_API_URL=https://api.fablab.voisilab.online

# Build l'application
npm run build

# Le dossier dist/ contient maintenant votre build de production
```

### 3. Options de Déploiement

#### Option A - PM2 avec serve (Simple & Rapide)

```bash
# Installer serve globalement si pas déjà fait
npm install -g serve

# Démarrer avec PM2
pm2 serve dist 3502 --name "voisilab-admin" --spa
pm2 save
pm2 startup
```

**Avantages:** Simple, redémarrage automatique, logs faciles

#### Option B - Nginx (Production recommandée)

**Configuration Nginx** (`/etc/nginx/sites-available/voisilab-admin`):

```nginx
server {
    listen 80;
    server_name admin.fablab.voisilab.online;

    root /home/jean1/voisilab/admins/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/voisilab-admin-access.log;
    error_log /var/log/nginx/voisilab-admin-error.log;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 6;

    # Cache pour les assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA - Toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Activer la configuration:**

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/voisilab-admin /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

**Ajouter SSL avec Let's Encrypt:**

```bash
sudo certbot --nginx -d admin.fablab.voisilab.online
```

#### Option C - Copier vers un serveur web existant

```bash
# Copier les fichiers build vers le dossier web
sudo cp -r dist/* /var/www/admin/
sudo chown -R www-data:www-data /var/www/admin
```

## 🔄 Mise à jour du déploiement

Quand vous faites des modifications :

```bash
# Sur le serveur
cd ~/voisilab/admins
git pull
npm install  # Si de nouvelles dépendances
npm run build

# Puis selon votre méthode de déploiement:

# Si PM2:
pm2 restart voisilab-admin

# Si Nginx:
# Les fichiers sont déjà à jour dans dist/
# Pas besoin de redémarrer Nginx

# Si copie manuelle:
sudo cp -r dist/* /var/www/admin/
```

### Script de déploiement automatique

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh

# Puis choisir votre option de service (PM2, Nginx, etc.)
```

## ⚙️ Configuration Production

### Variables d'environnement

Le fichier `.env.production` contient :

```env
VITE_API_URL=https://api.fablab.voisilab.online
VITE_APP_VERSION=v2.0.0
VITE_APP_BASE_NAME=/
VITE_APP_NAME=VoisiLab Admin
GENERATE_SOURCEMAP=false
```

**Important :** Ajustez `VITE_API_URL` selon votre configuration backend.

## 🐛 Résolution de problèmes

### Build qui échoue

**Cause :** Problème de dépendances ou erreurs de code.

**Solution :**
```bash
# Nettoyer complètement
rm -rf node_modules dist
npm install
npm run build
```

### Page blanche après déploiement

**Cause :** Problème de chemin de base ou configuration Nginx.

**Solutions :**

1. **Vérifier la console du navigateur** (F12) pour voir les erreurs
2. **Vérifier que `VITE_APP_BASE_NAME=/`** dans `.env`
3. **Si Nginx, vérifier la config `try_files`**:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

### Erreurs CORS avec l'API

**Cause :** Le backend n'autorise pas le domaine du dashboard.

**Solution :**

Sur le serveur backend, vérifier `server/.env`:
```env
ALLOWED_ORIGINS=https://admin.fablab.voisilab.online,https://fablab.voisilab.online
```

Puis redémarrer le backend:
```bash
cd ~/voisilab/server
pm2 restart voisilab-api
```

### Assets (images/CSS) ne se chargent pas

**Cause :** Problème de chemins relatifs.

**Solution :**
```bash
# Reconstruire avec la bonne base path
export VITE_APP_BASE_NAME=/
npm run build
```

## 📊 Commandes utiles

### Avec PM2

```bash
# Voir les logs
pm2 logs voisilab-admin

# Voir le statut
pm2 status

# Redémarrer
pm2 restart voisilab-admin

# Arrêter
pm2 stop voisilab-admin

# Supprimer
pm2 delete voisilab-admin
```

### Avec Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger
sudo systemctl reload nginx

# Redémarrer
sudo systemctl restart nginx

# Voir les logs
sudo tail -f /var/log/nginx/voisilab-admin-access.log
sudo tail -f /var/log/nginx/voisilab-admin-error.log
```

## 🔒 Sécurité

- Les fichiers `.env` ne sont **jamais** committés dans Git
- Utilisez `.env.production` comme template
- Activez SSL/HTTPS en production (Let's Encrypt gratuit)
- Configurez les headers de sécurité dans Nginx
- Limitez l'accès aux logs et fichiers sensibles

## 📝 Notes

- L'application est une SPA (Single Page Application) - toutes les routes doivent pointer vers `index.html`
- Le build génère des fichiers statiques dans `dist/`
- Pas besoin de Node.js en production (seulement pour le build)
- Utilisez Nginx pour de meilleures performances en production

## 🌐 Configuration DNS

Pour utiliser un sous-domaine comme `admin.fablab.voisilab.online`:

1. **Ajouter un enregistrement DNS** chez votre hébergeur:
   - Type: A
   - Nom: admin.fablab.voisilab.online
   - Valeur: IP de votre serveur (ex: 69.62.106.191)
   - TTL: 3600

2. **Attendre la propagation DNS** (quelques minutes à quelques heures)

3. **Configurer SSL**:
   ```bash
   sudo certbot --nginx -d admin.fablab.voisilab.online
   ```

## 🔄 Workflow de déploiement complet

```bash
# 1. Sur votre machine locale
git add .
git commit -m "Nouvelle fonctionnalité"
git push

# 2. Sur le serveur
ssh jean1@69.62.106.191
cd ~/voisilab/admins
./deploy.sh

# 3. Redémarrer le service
pm2 restart voisilab-admin
# ou simplement attendre (Nginx sert les nouveaux fichiers automatiquement)

# 4. Vérifier
curl -I https://admin.fablab.voisilab.online
```

## ✅ Checklist de déploiement

- [ ] Code poussé sur Git
- [ ] `.env.production` configuré avec la bonne URL API
- [ ] Build réussi (`npm run build`)
- [ ] Dossier `dist/` créé et contenant les fichiers
- [ ] Serveur web configuré (Nginx ou PM2)
- [ ] DNS configuré (si sous-domaine)
- [ ] SSL/HTTPS activé
- [ ] CORS configuré sur le backend
- [ ] Test de connexion à l'admin
- [ ] Test de fonctionnalités principales

---

**Développé avec ❤️ par l'équipe VoisiLab**
