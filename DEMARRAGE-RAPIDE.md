# Guide de Démarrage Rapide - VoisiLab

## Prérequis

- Docker Desktop installé et en cours d'exécution
- Node.js 20+ (pour le développement local)
- Git

## Démarrage avec Docker

### 1. Configuration initiale

Copiez le fichier d'exemple et configurez vos variables d'environnement:

```bash
cp .env.example .env
```

### 2. Démarrer tous les services

```bash
docker-compose up -d
```

Cette commande démarre:
- **MySQL 8.0** (port 3306)
- **phpMyAdmin** (port 8080) - http://localhost:8080
- **Backend API** (port 5000) - http://localhost:5000
- **Frontend** (port 3000) - http://localhost:3000
- **Admin Panel** (port 3001) - http://localhost:3001

### 3. Vérifier l'état des services

```bash
docker-compose ps
```

### 4. Accès aux interfaces

- **API Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **phpMyAdmin**: http://localhost:8080
  - Server: `mysql`
  - User: `root`
  - Password: `root_password` (défini dans .env)

## Identifiants par Défaut

### Base de données MySQL

- **Host**: localhost (ou `mysql` depuis Docker)
- **Port**: 3306
- **Database**: voisilab_db
- **User**: voisilab_user
- **Password**: changez_moi_en_production
- **Root Password**: root_password

### Utilisateur Admin

- **Email**: admin@voisilab.fr
- **Password**: admin123
- **Role**: admin

## API Endpoints Disponibles

### Authentication (`/api/auth`)

#### POST /api/auth/register
Inscription d'un nouvel utilisateur

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe"
  }'
```

Réponse:
```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Connexion utilisateur

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@voisilab.fr",
    "password": "admin123"
  }'
```

Réponse:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@voisilab.fr",
    "full_name": "Administrateur",
    "role": "admin",
    "avatar_url": null
  }
}
```

#### GET /api/auth/profile
Récupérer le profil utilisateur (authentifié)

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### PUT /api/auth/profile
Mettre à jour le profil utilisateur (authentifié)

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nouveau Nom",
    "avatar_url": "https://example.com/avatar.jpg"
  }'
```

#### POST /api/auth/refresh
Rafraîchir le token JWT (authentifié)

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### POST /api/auth/change-password
Changer le mot de passe (authentifié)

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "ancien_password",
    "new_password": "nouveau_password"
  }'
```

## Commandes Docker Utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Backend seulement
docker-compose logs -f backend

# MySQL seulement
docker-compose logs -f mysql
```

### Arrêter les services

```bash
docker-compose down
```

### Reconstruire les images

```bash
# Reconstruire tous les services
docker-compose build

# Reconstruire le backend seulement
docker-compose build backend

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Réinitialiser complètement

```bash
# Arrêter et supprimer les volumes (⚠️ SUPPRIME LES DONNÉES)
docker-compose down -v

# Redémarrer proprement
docker-compose up -d
```

## Développement Local (sans Docker)

### Backend

```bash
cd server
npm install
npm run build
npm start
```

Variables d'environnement requises (.env):
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=voisilab_db
DATABASE_USER=voisilab_user
DATABASE_PASSWORD=changez_moi_en_production

JWT_SECRET=changez_moi_secret_jwt
JWT_EXPIRES_IN=7d

PORT=5000
```

### Frontend

```bash
cd front-end
npm install
npm run dev
```

### Admin

```bash
cd admins
npm install
npm run dev
```

## Structure de la Base de Données

La base de données MySQL contient 16 tables:

1. **users** - Utilisateurs et administrateurs
2. **ppn** - Points Proximité Numérique
3. **projects** - Projets des utilisateurs
4. **workshops** - Ateliers et événements
5. **workshop_registrations** - Inscriptions aux ateliers
6. **equipment** - Matériels disponibles
7. **blog_posts** - Articles de blog
8. **media** - Bibliothèque média
9. **pages** - Pages dynamiques
10. **services** - Services offerts
11. **team_members** - Membres de l'équipe
12. **contact_messages** - Messages de contact
13. **settings** - Paramètres du site
14. **user_activities** - Logs d'activité
15. **notifications** - Notifications utilisateurs
16. **analytics** - Statistiques

Le schéma complet est dans `database/mysql-schema.sql`.

## Statut du Projet

### ✅ Fonctionnel

- Backend Express.js + TypeScript
- Base de données MySQL avec phpMyAdmin
- Authentication complète (JWT)
  - Inscription
  - Connexion
  - Profil utilisateur
  - Refresh token
  - Changement de mot de passe
- Docker Compose pour orchestration
- Health checks

### 🚧 En cours

- Autres endpoints API (blog, projets, workshops, etc.)
- Frontend Next.js
- Admin panel

## Dépannage

### Le backend ne démarre pas

Vérifiez que MySQL est bien démarré:
```bash
docker-compose ps mysql
```

Vérifiez les logs:
```bash
docker-compose logs backend
```

### Erreur de connexion MySQL

Vérifiez que les credentials dans `.env` correspondent aux variables d'environnement Docker.

### Rebuild après modifications

Après avoir modifié le code backend:
```bash
cd server && npm run build
docker-compose build backend
docker-compose up -d backend
```

## Support

Pour signaler un problème, consultez les logs:
```bash
docker-compose logs -f
```

---

Mis à jour: 11/02/2026
