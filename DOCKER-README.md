# 🐳 Docker - VoisiLab Platform

## 📋 Vue d'Ensemble

Ce projet contient la configuration Docker complète pour déployer la plateforme VoisiLab :

- **Front-End Utilisateur** : Next.js 16 + React 19 (Port 3000)
- **Admin Platform** : Vite 7 + React 19 + Material-UI 7 (Port 3001)
- **Backend** : Supabase (hébergé)

## 🚀 Démarrage Rapide

### Prérequis

- Docker Desktop installé
- Docker Compose v2.0+
- Compte Supabase configuré

### 1. Configuration des Variables

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos vraies valeurs
nano .env
```

**Variables essentielles à remplir :**
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé publique Supabase
- `VITE_SUPABASE_URL` - URL Supabase (même que ci-dessus)
- `VITE_SUPABASE_ANON_KEY` - Clé Supabase (même que ci-dessus)

### 2. Build et Démarrage

```bash
# Build des images
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

### 3. Accès aux Applications

- **Site utilisateur** : http://localhost:3000
- **Admin platform** : http://localhost:3001

### 4. Arrêt des Services

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 📦 Architecture Docker

```
voisilab-app/
├── docker-compose.yml          # Orchestration des services
├── .env.example                # Template des variables
├── front-end/
│   ├── Dockerfile              # Image Next.js
│   └── ...                     # Code source
└── admins/
    ├── Dockerfile              # Image Vite + Nginx
    ├── nginx.conf              # Configuration Nginx
    └── ...                     # Code source
```

## 🔧 Configuration des Services

### Front-End (Next.js)

**Dockerfile** : Multi-stage build optimisé
- Stage 1 : Installation dépendances
- Stage 2 : Build Next.js
- Stage 3 : Image production légère

**Port** : 3000
**Base Image** : node:20-alpine
**Healthcheck** : Actif (30s interval)

### Admin (Vite + React)

**Dockerfile** : Build statique servi par Nginx
- Stage 1 : Installation dépendances
- Stage 2 : Build Vite
- Stage 3 : Nginx Alpine

**Port** : 3001 (mappé depuis 80 interne)
**Base Image** : nginx:alpine
**Healthcheck** : Actif (30s interval)

### Réseau

**Network** : `voisilab-network` (bridge)
- Communication inter-services
- Isolation du réseau

## 🛠️ Commandes Utiles

### Development

```bash
# Rebuild un service spécifique
docker-compose build frontend
docker-compose build admin

# Redémarrer un service
docker-compose restart frontend

# Voir les logs d'un service
docker-compose logs -f frontend
docker-compose logs -f admin

# Exécuter une commande dans un container
docker-compose exec frontend sh
docker-compose exec admin sh
```

### Production

```bash
# Build sans cache (build propre)
docker-compose build --no-cache

# Démarrer en mode detached avec logs
docker-compose up -d && docker-compose logs -f

# Voir l'état des services
docker-compose ps

# Stats en temps réel
docker stats
```

### Maintenance

```bash
# Nettoyer les images non utilisées
docker system prune -a

# Voir l'utilisation disque
docker system df

# Supprimer tous les containers arrêtés
docker container prune

# Redémarrer tous les services
docker-compose restart
```

## 🔍 Troubleshooting

### Port déjà utilisé

```bash
# Error: "port is already allocated"

# Solution 1 : Changer le port dans docker-compose.yml
ports:
  - "3002:3000"  # Au lieu de 3000:3000

# Solution 2 : Arrêter le service qui utilise le port
# Sur Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Sur Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Build qui échoue

```bash
# Nettoyer et rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Variables d'environnement non prises en compte

```bash
# Vérifier que le .env est bien à la racine
ls -la .env

# Forcer le rebuild après changement .env
docker-compose down
docker-compose up -d --build
```

### Healthcheck qui échoue

```bash
# Voir les logs détaillés
docker inspect voisilab-frontend
docker inspect voisilab-admin

# Tester manuellement
docker-compose exec frontend wget -O- http://localhost:3000
docker-compose exec admin wget -O- http://localhost:80
```

## 📊 Monitoring

### Voir les logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Service spécifique avec timestamp
docker-compose logs -f --timestamps frontend

# Dernières 100 lignes
docker-compose logs --tail=100 admin
```

### Vérifier la santé des services

```bash
# Status général
docker-compose ps

# Détails healthcheck
docker inspect --format='{{json .State.Health}}' voisilab-frontend | jq

# Voir les métriques
docker stats voisilab-frontend voisilab-admin
```

## 🚢 Déploiement Production

### 1. Préparer l'environnement

```bash
# Sur le serveur de production
git clone <votre-repo>
cd voisilab-app

# Copier et configurer .env
cp .env.example .env
nano .env  # Remplir les vraies valeurs de production
```

### 2. Build et démarrage

```bash
# Build optimisé pour production
docker-compose build --no-cache

# Démarrer en mode production
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f
```

### 3. Configuration Nginx/Apache (Optionnel)

Si vous utilisez un reverse proxy :

```nginx
# /etc/nginx/sites-available/voisilab

# Front-end utilisateur
server {
    listen 80;
    server_name voisilab.fr www.voisilab.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin platform
server {
    listen 80;
    server_name admin.voisilab.fr;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir les certificats
sudo certbot --nginx -d voisilab.fr -d www.voisilab.fr
sudo certbot --nginx -d admin.voisilab.fr

# Renouvellement automatique
sudo certbot renew --dry-run
```

## 🔐 Sécurité

### Bonnes Pratiques

- ✅ Ne jamais commit le fichier `.env`
- ✅ Utiliser des secrets pour les clés API
- ✅ Mettre à jour régulièrement les images Docker
- ✅ Activer HTTPS en production
- ✅ Limiter l'accès SSH au serveur
- ✅ Configurer un firewall
- ✅ Faire des backups réguliers de Supabase

### Mise à jour des Images

```bash
# Pull les dernières versions des base images
docker-compose pull

# Rebuild avec les nouvelles bases
docker-compose up -d --build
```

## 📈 Performance

### Optimisations Appliquées

- ✅ **Multi-stage builds** : Images légères
- ✅ **Layer caching** : Build plus rapides
- ✅ **Compression Gzip** : Nginx compresse les assets
- ✅ **Cache des assets** : Headers Cache-Control optimisés
- ✅ **Healthchecks** : Redémarrage automatique si problème
- ✅ **Restart policy** : `unless-stopped` pour haute disponibilité

### Métriques

```bash
# Utilisation CPU/RAM/Réseau
docker stats

# Taille des images
docker images

# Espace disque utilisé
docker system df
```

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

---

**Version** : 1.0.0
**Dernière mise à jour** : 11 février 2025

Pour toute question, consultez la documentation ou ouvrez une issue.
