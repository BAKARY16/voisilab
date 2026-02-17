# Base de données VoisiLab - MySQL

## Vue d'ensemble

Ce dossier contient le schéma complet de la base de données MySQL pour la plateforme VoisiLab.

## Fichier

- **`schema.sql`** : Schéma complet avec toutes les tables, indexes et données initiales

## Tables

| Table | Description |
|-------|-------------|
| `users` | Administrateurs et utilisateurs |
| `notifications` | Notifications système |
| `team_members` | Membres de l'équipe |
| `contacts` | Messages de contact |
| `project_submissions` | Soumissions de projets |
| `services` | Services proposés |
| `workshops` | Ateliers et événements |
| `workshop_registrations` | Inscriptions aux ateliers |
| `equipment` | Équipements/Matériels |
| `innovations` | Projets d'innovation |
| `blog_posts` | Actualités/Blog |
| `ppn_locations` | Points du réseau PPN |
| `pages` | Pages CMS |
| `settings` | Paramètres du site |
| `media` | Médiathèque |

## Installation

### Avec Docker (Recommandé)

La base de données est automatiquement créée au démarrage de Docker :

```bash
docker-compose up -d
```

Puis importer le schéma :

```bash
docker exec -i voisilab-mysql mysql -u root -ppassword voisilab_db < database/schema.sql
```

### Installation manuelle

1. Créer la base de données :
```sql
CREATE DATABASE voisilab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importer le schéma :
```bash
mysql -u root -p voisilab_db < database/schema.sql
```

## Accès phpMyAdmin

- URL: http://localhost:8080
- Serveur: mysql
- Utilisateur: root
- Mot de passe: (voir .env)

## Configuration

Variables d'environnement requises (fichier `.env` à la racine du projet) :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=voisilab_db
```

## Créer un admin

Exécuter le script :

```bash
cd server
node create-admin.js
```

Ou manuellement via SQL :

```sql
INSERT INTO users (email, password, name, role) VALUES (
  'admin@voisilab.ci',
  '$2b$10$...',  -- Hash bcrypt du mot de passe
  'Admin',
  'admin'
);
```

## Sauvegardes

Exporter la base de données :

```bash
docker exec voisilab-mysql mysqldump -u root -ppassword voisilab_db > backup.sql
```

Restaurer :

```bash
docker exec -i voisilab-mysql mysql -u root -ppassword voisilab_db < backup.sql
```

## Structure des dossiers uploads

```
server/uploads/
├── avatars/       # Photos de profil
├── team/          # Photos équipe
├── workshops/     # Images ateliers
├── equipment/     # Images équipements
├── innovations/   # Images innovations
├── blog/          # Images actualités
└── projects/      # Fichiers projets
```
