# VoisiLab Backend - Guide Complet

## 📋 Vue d'ensemble

Backend complet pour VoisiLab avec PostgreSQL, Express.js et TypeScript. Remplace Supabase par une solution auto-hébergée complète.

## 🛠 Stack Technique

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4
- **Langage**: TypeScript 5
- **Base de données**: PostgreSQL 16
- **ORM**: pg (PostgreSQL native client)
- **Authentication**: JWT (jsonwebtoken)
- **Upload de fichiers**: Multer
- **Logging**: Winston
- **Sécurité**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator

## 🗂 Structure du Projet

```
server/
├── src/
│   ├── config/          # Configuration (DB, Auth, Logger)
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── logger.ts
│   ├── controllers/     # Logique métier
│   │   ├── authController.ts
│   │   ├── workshopController.ts
│   │   ├── serviceController.ts
│   │   ├── contactController.ts
│   │   ├── teamController.ts
│   │   ├── ppnController.ts
│   │   ├── equipmentController.ts
│   │   ├── blogController.ts
│   │   ├── mediaController.ts
│   │   ├── pageController.ts
│   │   ├── settingsController.ts
│   │   ├── projectController.ts
│   │   └── userController.ts
│   ├── middlewares/     # Middlewares
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   └── errors.ts
│   ├── routes/          # Routes API
│   │   ├── authRoutes.ts
│   │   ├── workshopRoutes.ts
│   │   └── ... (13 routes)
│   └── server.ts        # Point d'entrée principal
├── uploads/             # Fichiers uploadés (généré)
├── logs/                # Logs (généré)
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

## 📦 Installation

### 1. Prérequis

- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- npm ou yarn

### 2. Installation des dépendances

```bash
cd server
npm install
```

### 3. Configuration des variables d'environnement

Copiez `.env.example` vers `.env` et configurez:

```bash
cp .env.example .env
```

Éditez `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=voisilab_db
DATABASE_USER=voisilab_user
DATABASE_PASSWORD=votre_mot_de_passe_securise

JWT_SECRET=changez_moi_secret_jwt_super_securise
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### 4. Initialisation de la base de données

#### Option A: PostgreSQL local

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE voisilab_db;
CREATE USER voisilab_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE voisilab_db TO voisilab_user;

\c voisilab_db
ALTER SCHEMA public OWNER TO voisilab_user;
\q

# Appliquer le schéma
psql -U voisilab_user -d voisilab_db -f ../database/postgresql-schema.sql
```

#### Option B: Docker (recommandé)

```bash
# Depuis la racine du projet
docker-compose up -d postgres

# Le schéma est automatiquement appliqué au premier démarrage
```

### 5. Démarrage du serveur

#### Mode développement

```bash
npm run dev
```

#### Mode production

```bash
npm run build
npm start
```

## 🚀 Utilisation avec Docker

### Démarrer tous les services

```bash
# Depuis la racine du projet
docker-compose up -d
```

Services disponibles:
- **PostgreSQL**: localhost:5432
- **Backend API**: localhost:5000
- **Frontend**: localhost:3000
- **Admin**: localhost:3001

### Vérifier les logs

```bash
# Logs du backend
docker-compose logs -f backend

# Logs de PostgreSQL
docker-compose logs -f postgres
```

### Arrêter tous les services

```bash
docker-compose down
```

### Supprimer les données (⚠️ Attention)

```bash
docker-compose down -v
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `GET /api/auth/me` - Profil utilisateur (authentifié)

### Workshops (Ateliers)
- `GET /api/workshops` - Liste des ateliers
- `GET /api/workshops/:id` - Détails d'un atelier
- `POST /api/workshops` - Créer un atelier (admin)
- `PUT /api/workshops/:id` - Modifier un atelier (admin)
- `DELETE /api/workshops/:id` - Supprimer un atelier (admin)
- `POST /api/workshops/:id/register` - S'inscrire à un atelier

### Services
- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détails d'un service
- `POST /api/services` - Créer un service (admin)
- `PUT /api/services/:id` - Modifier un service (admin)
- `DELETE /api/services/:id` - Supprimer un service (admin)

### Contact Messages
- `POST /api/contacts` - Envoyer un message
- `GET /api/contacts` - Liste des messages (admin)
- `GET /api/contacts/:id` - Détails d'un message (admin)
- `PUT /api/contacts/:id` - Marquer comme lu (admin)
- `DELETE /api/contacts/:id` - Supprimer (admin)

### Team Members
- `GET /api/team` - Liste des membres
- `GET /api/team/:id` - Détails d'un membre
- `POST /api/team` - Ajouter un membre (admin)
- `PUT /api/team/:id` - Modifier un membre (admin)
- `DELETE /api/team/:id` - Supprimer un membre (admin)

### PPN (Points Réseau)
- `GET /api/ppn/locations` - Liste des points PPN
- `GET /api/ppn/locations/:id` - Détails d'un point PPN
- `POST /api/ppn/locations` - Créer un point PPN (admin)
- `PUT /api/ppn/locations/:id` - Modifier un point PPN (admin)
- `DELETE /api/ppn/locations/:id` - Supprimer un point PPN (admin)
- `GET /api/ppn/members` - Liste des membres PPN (admin)
- `POST /api/ppn/members` - Ajouter un membre PPN (admin)

### Equipment (Équipements)
- `GET /api/equipment` - Liste des équipements
- `GET /api/equipment/:id` - Détails d'un équipement
- `POST /api/equipment` - Ajouter un équipement (admin)
- `PUT /api/equipment/:id` - Modifier un équipement (admin)
- `DELETE /api/equipment/:id` - Supprimer un équipement (admin)

### Blog
- `GET /api/blog` - Liste des articles publiés
- `GET /api/blog/slug/:slug` - Article par slug
- `GET /api/blog/:id` - Détails d'un article
- `POST /api/blog` - Créer un article (admin)
- `PUT /api/blog/:id` - Modifier un article (admin)
- `DELETE /api/blog/:id` - Supprimer un article (admin)

### Media Library
- `GET /api/media` - Liste des fichiers
- `POST /api/media/upload` - Upload de fichier (admin)
- `PUT /api/media/:id` - Modifier métadonnées (admin)
- `DELETE /api/media/:id` - Supprimer un fichier (admin)

### Dynamic Pages
- `GET /api/pages` - Liste des pages
- `GET /api/pages/slug/:slug` - Page par slug
- `POST /api/pages` - Créer une page (admin)
- `PUT /api/pages/:id` - Modifier une page (admin)
- `DELETE /api/pages/:id` - Supprimer une page (admin)

### Settings
- `GET /api/settings` - Tous les paramètres
- `GET /api/settings/:key` - Paramètre par clé
- `PUT /api/settings/:key` - Modifier un paramètre (admin)

### Projects
- `POST /api/projects` - Soumettre un projet
- `GET /api/projects` - Liste des projets (admin)
- `PUT /api/projects/:id/status` - Modifier le statut (admin)

### Users
- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur (admin)
- `PUT /api/users/:id` - Modifier un utilisateur (admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

## 🔐 Authentication

L'API utilise JWT pour l'authentification. Pour les requêtes authentifiées:

```javascript
fetch('http://localhost:5000/api/workshops', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
})
```

## 📤 Upload de fichiers

Pour uploader des fichiers (images, documents):

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'Mon fichier');

fetch('http://localhost:5000/api/media/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
})
```

Fichiers supportés:
- Images: JPG, PNG, GIF, WebP
- Documents: PDF
- Vidéos: MP4, WebM
- Audio: MP3, WAV

Taille maximale: 10 MB

## 🗄 Base de données

### Schéma

Le schéma complet est dans `../database/postgresql-schema.sql`

Tables principales:
1. `users` - Utilisateurs et admins
2. `workshops` - Ateliers
3. `workshop_registrations` - Inscriptions aux ateliers
4. `services` - Services offerts
5. `contact_messages` - Messages de contact
6. `team_members` - Équipe
7. `ppn_locations` - Points PPN
8. `ppn_members` - Membres PPN
9. `equipment` - Équipements
10. `blog_posts` - Articles de blog
11. `dynamic_pages` - Pages dynamiques
12. `media_library` - Médiathèque
13. `project_submissions` - Soumissions de projets
14. `site_settings` - Paramètres du site
15. `navigation_menus` - Menus de navigation
16. `system_logs` - Logs système

### Compte admin par défaut

**Email**: admin@voisilab.fr
**Mot de passe**: admin123

⚠️ **IMPORTANT**: Changez immédiatement ce mot de passe en production !

## 🛡 Sécurité

- ✅ Helmet pour headers de sécurité
- ✅ Rate limiting (100 req/15min par IP)
- ✅ CORS configuré
- ✅ Validation des données avec express-validator
- ✅ Mots de passe hashés avec bcrypt
- ✅ JWT avec expiration
- ✅ Protection contre injection SQL (requêtes paramétrisées)
- ✅ Upload de fichiers sécurisé (type, taille)

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:5000/health
```

Réponse:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-11T10:30:00.000Z",
  "database": "connected"
}
```

### Logs

Les logs sont stockés dans le dossier `logs/`:
- `logs/error.log` - Erreurs
- `logs/combined.log` - Tous les logs

## 🚨 Dépannage

### Erreur de connexion à PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs
docker-compose logs postgres

# Redémarrer PostgreSQL
docker-compose restart postgres
```

### Port déjà utilisé

```bash
# Changer le PORT dans .env
PORT=5001

# Ou arrêter le processus existant
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Problèmes de migration

```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d postgres

# Attendre que PostgreSQL soit prêt
docker-compose logs -f postgres

# Appliquer le schéma manuellement
docker-compose exec postgres psql -U voisilab_user -d voisilab_db -f /docker-entrypoint-initdb.d/01-schema.sql
```

## 📝 Développement

### Ajouter une nouvelle table

1. Modifier `database/postgresql-schema.sql`
2. Créer le controller dans `src/controllers/`
3. Créer les routes dans `src/routes/`
4. Enregistrer les routes dans `src/server.ts`
5. Appliquer la migration

### Commandes utiles

```bash
# Développement avec rechargement automatique
npm run dev

# Compiler TypeScript
npm run build

# Linter (si configuré)
npm run lint

# Tests (si configurés)
npm test
```

## 🎯 Prochaines étapes

- [ ] Ajouter des tests unitaires (Jest)
- [ ] Implémenter la pagination automatique
- [ ] Ajouter l'envoi d'emails (nodemailer)
- [ ] Implémenter le cache (Redis optionnel)
- [ ] Ajouter les websockets pour notifications temps réel
- [ ] Améliorer la documentation API (Swagger/OpenAPI)

## 📄 Licence

MIT - VoisiLab Team
