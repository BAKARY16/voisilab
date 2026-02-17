# Guide de Déploiement - Voisilab Backend

## 📦 Prérequis

- Node.js 18+ installé sur le serveur
- npm installé
- MySQL/MariaDB (Hostinger ou autre)
- PM2 pour la gestion des processus
- Accès SSH au serveur

## 🚀 Déploiement Initial

### 1. Sur votre machine locale

```bash
# Pousser les derniers changements
git add .
git commit -m "Prêt pour le déploiement backend"
git push
```

### 2. Sur le serveur (SSH)

```bash
# Se connecter au serveur
ssh jean1@69.62.106.191

# Naviguer vers le dossier du projet
cd ~/voisilab/server

# Récupérer les dernières modifications
git pull

# Installer les dépendances
npm install

# Build TypeScript (IMPORTANT!)
npm run build

# Vérifier que le dossier dist existe
ls -la dist/

# Si le dossier dist est vide ou n'existe pas, rebuild
npm run build

# Lancer avec PM2
pm2 start npm --name "voisilab-api" -- start
pm2 save
```

**Note importante:** Le build TypeScript est essentiel. Sans lui, le fichier `dist/server.js` n'existera pas et le serveur ne démarrera pas.

## 🔄 Mise à jour du déploiement

Quand vous faites des modifications :

```bash
# Sur le serveur
cd ~/voisilab/server
git pull
npm install  # Si de nouvelles dépendances
npm run build
pm2 restart voisilab-api
```

## ⚙️ Configuration Production

### Variables d'environnement

Le fichier `.env` sur le serveur doit contenir :

```env
# Serveur
PORT=3500
NODE_ENV=production

# Base de données (Production Hostinger)
DB_HOST=srv1579.hstgr.io
DB_PORT=3306
DB_USER=u705315732_fablab
DB_PASSWORD=UvciMalickFall@2026
DB_NAME=u705315732_fablab

# JWT
JWT_SECRET=votre_secret_jwt_production
JWT_EXPIRES_IN=7d

# CORS (ajuster selon votre domaine)
ALLOWED_ORIGINS=https://uvci.online,https://www.uvci.online

# Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Important :** 
- Changez `JWT_SECRET` en production
- Ajustez `ALLOWED_ORIGINS` avec votre nom de domaine

### Structure des dossiers uploads

```bash
# Créer les dossiers si nécessaire
mkdir -p uploads/team
mkdir -p uploads/confidential/contacts
mkdir -p uploads/confidential/projects
```

## 🗄️ Base de données

### Initialisation du schéma

```bash
# Sur le serveur
cd ~/voisilab/database
node push-schema.js
```

### Migration des données d'équipement

Si vous avez des problèmes avec la table equipment :

```bash
cd ~/voisilab/database
node fix-equipment-table.js
```

## 🐛 Résolution de problèmes

### Erreur "Cannot find module '/home/jean1/voisilab/server/dist/server.js'"

**Cause :** Le build TypeScript n'a pas été exécuté ou a échoué silencieusement.

**Solution :**
```bash
cd ~/voisilab/server

# Supprimer le dossier dist s'il existe
rm -rf dist

# Rebuild complet
npm run build

# Vérifier que les fichiers sont créés
ls -la dist/

# Vous devriez voir des fichiers .js
ls -lR dist/

# Redémarrer PM2
pm2 restart voisilab-api

# Ou si PM2 n'est pas encore lancé
pm2 start npm --name "voisilab-api" -- start
pm2 save
```

**Alternative avec le script de build :**
```bash
chmod +x build.sh
./build.sh
```

### Erreur de connexion à la base de données

**Vérifier la connexion :**
```bash
cd ~/voisilab/server
node test-db.js
```

**Solutions :**
- Vérifiez que les credentials dans `.env` sont corrects
- Vérifiez que le serveur MySQL autorise les connexions externes
- Vérifiez les règles de firewall

### Port déjà utilisé

Si le port 3500 est déjà utilisé :

```bash
# Voir qui utilise le port
lsof -i :3500

# Arrêter le processus
pm2 stop voisilab-api
# ou
kill -9 <PID>
```

### Erreur 500 dans les requêtes

**Voir les logs :**
```bash
pm2 logs voisilab-api

# ou voir les logs du fichier
tail -f ~/voisilab/server/logs/error.log
```

### Problèmes avec les uploads

**Vérifier les permissions :**
```bash
cd ~/voisilab/server
chmod -R 755 uploads
```

## 📊 Commandes PM2 utiles

```bash
# Voir les logs
pm2 logs voisilab-api

# Logs en temps réel
pm2 logs voisilab-api --lines 100

# Voir le status
pm2 status

# Redémarrer
pm2 restart voisilab-api

# Arrêter
pm2 stop voisilab-api

# Supprimer
pm2 delete voisilab-api

# Voir l'utilisation mémoire/CPU
pm2 monit
```

## 🔐 Créer un administrateur

```bash
cd ~/voisilab/server
node create-admin.js
```

Suivre les instructions pour créer un compte admin.

## 🔒 Sécurité

- Les fichiers `.env` ne sont **jamais** committés dans Git
- Changez `JWT_SECRET` en production
- Utilisez des mots de passe forts pour les comptes admin
- Limitez les `ALLOWED_ORIGINS` aux domaines autorisés
- Mettez à jour régulièrement les dépendances : `npm audit fix`

## 📝 Notes

- L'application utilise le port **3500** par défaut
- Les logs sont dans `server/logs/`
- Les uploads sont dans `server/uploads/`
- Le backend utilise TypeScript compilé en JavaScript dans `dist/`

## 🌐 Configuration Nginx (optionnel)

Si vous utilisez Nginx comme reverse proxy :

```nginx
server {
    server_name api.uvci.online;
    
    location / {
        proxy_pass http://localhost:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 Script de déploiement automatique

Créer un fichier `deploy.sh` :

```bash
#!/bin/bash
cd ~/voisilab/server
git pull
npm install
npm run build
pm2 restart voisilab-api
echo "Backend déployé avec succès !"
```

Rendre exécutable :
```bash
chmod +x deploy.sh
```

Utiliser :
```bash
./deploy.sh
```
