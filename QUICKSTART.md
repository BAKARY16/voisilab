# 🚀 VoisiLab - Démarrage Rapide

## 🎯 Backend Custom avec PostgreSQL

Le projet VoisiLab utilise maintenant un backend custom (Express + PostgreSQL) au lieu de Supabase.

## ⚡ Installation Rapide

### Option 1: Docker (Recommandé)

```bash
# 1. Copier le fichier environnement
cp .env.example .env

# 2. Démarrer tous les services
docker-compose up -d

# 3. Accéder aux services
# - Frontend: http://localhost:3000
# - Admin: http://localhost:3001
# - API Backend: http://localhost:5000
# - PostgreSQL: localhost:5432
```

### Option 2: Développement Local

```bash
# 1. Installer PostgreSQL localement (ou utiliser Docker uniquement pour PostgreSQL)
docker-compose up -d postgres

# 2. Installer et démarrer le backend
cd server
npm install
cp .env.example .env
# Éditer .env avec vos configurations
npm run dev

# 3. Installer et démarrer le frontend (dans un nouveau terminal)
cd front-end
nom install
npm run dev

# 4. Installer et démarrer l'admin (dans un nouveau terminal)
cd admins
npm install
npm start
```

## 📁 Structure du Projet

```
voisilab-app/
├── server/              # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/ # Logique métier
│   │   ├── routes/      # Routes API
│   │   ├── middlewares/ # Middlewares
│   │   ├── config/      # Configuration
│   │   └── server.ts    # Point d'entrée
│   ├── Dockerfile
│   └── package.json
├── front-end/           # Application utilisateur (Next.js)
├── admins/              # Interface admin (Vite + React)
├── database/            # Schémas SQL
│   └── postgresql-schema.sql
├── docker-compose.yml   # Orchestration Docker
└── .env.example         # Variables d'environnement
```

## 🔐 Compte Admin Par Défaut

**URL Admin**: http://localhost:3001

**Email**: admin@voisilab.fr
**Mot de passe**: admin123

⚠️ **IMPORTANT**: Changez ce mot de passe immédiatement !

## 🌐 URLs des Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Application utilisateur |
| Admin | http://localhost:3001 | Interface d'administration |
| API Backend | http://localhost:5000 | API REST |
| PostgreSQL | localhost:5432 | Base de données |

## API Health Check

Vérifier que le backend fonctionne:

```bash
curl http://localhost:5000/health
```

## 📚 Documentation Complète

- **Backend**: [server/README.md](server/README.md)
- **Database**: [database/README.md](database/README.md)
- **Frontend**: [front-end/README.md](front-end/README.md)
- **Admin**: [admins/README.md](admins/README.md)

## 🛠 Commandes Docker Utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend

# Arrêter tous les services
docker-compose down

# Redémarrer un service
docker-compose restart backend

# Supprimer tout (⚠️ données incluses)
docker-compose down -v
```

## 🗄 Base de Données

### Connexion directe à PostgreSQL

```bash
# Via Docker
docker-compose exec postgres psql -U voisilab_user -d voisilab_db

# Localement (si PostgreSQL est installé)
psql -U voisilab_user -d voisilab_db -h localhost
```

### Réinitialiser la base de données

```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer (le schéma sera automatiquement appliqué)
docker-compose up -d postgres
```

## 🔧 Configuration

### Variables d'Environnement Importantes

Éditez `.env`:

```env
# Base de données
DATABASE_USER=voisilab_user
DATABASE_PASSWORD=changez_moi_en_production
DATABASE_NAME=voisilab_db

# JWT
JWT_SECRET=changez_moi_secret_super_securise

# Ports
BACKEND_PORT=5000
FRONTEND_PORT=3000
ADMIN_PORT=3001
```

## 🚨 Problèmes Courants

### Port déjà utilisé

Changez les ports dans `.env`:

```env
BACKEND_PORT=5001
FRONTEND_PORT=3002
ADMIN_PORT=3003
```

### Base de données ne démarre pas

```bash
# Vérifier les logs
docker-compose logs postgres

# Redémarrer
docker-compose restart postgres
```

### Backend ne se connecte pas à PostgreSQL

Attendez que PostgreSQL soit complètement démarré (peut prendre 10-20 secondes):

```bash
# Vérifier le statut
docker-compose ps

# Redémarrer le backend
docker-compose restart backend
```

## 📊 Fonctionnalités

### Backend API (16 tables)

- ✅ Authentication (JWT)
- ✅ Ateliers & Inscriptions
- ✅ Services
- ✅ Messages de contact
- ✅ Équipe
- ✅ Points PPN (carte)
- ✅ Équipements
- ✅ Blog
- ✅ Médiathèque
- ✅ Pages dynamiques
- ✅ Projets
- ✅ Paramètres du site
- ✅ Gestion utilisateurs
- ✅ Upload de fichiers
- ✅ Logs système

### Frontend

- Page d'accueil
- À propos
- Services
- Ateliers
- Carte PPN
- Blog
- Contact
- Inscription aux ateliers

### Admin

- Dashboard
- Gestion ateliers
- Gestion services
- Messages de contact
- Gestion équipe
- Points PPN
- Équipements
- Blog
- Médiathèque
- Pages dynamiques
- Projets soumis
- Utilisateurs
- Paramètres

## 🎨 Stack Technique

### Backend
- Node.js 20
- Express.js 4
- TypeScript 5
- PostgreSQL 16
- JWT Authentication
- Multer (upload)
- Winston (logs)

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Admin
- Vite 7
- React 19
- Material-UI 7
- TypeScript

## 📞 Support

Pour toute question ou problème:

1. Consultez la documentation dans chaque dossier
2. Vérifiez les logs: `docker-compose logs -f`
3. Vérifiez le health check: `curl http://localhost:5000/health`

## 🎯 Prochaines Étapes

1. ✅ Démarrer les services
2. ✅ Se connecter à l'admin
3. ✅ Changer le mot de passe admin
4. Configurer les paramètres du site
5. Ajouter du contenu (ateliers, services, etc.)
6. Personnaliser le frontend

Bon développement ! 🚀
