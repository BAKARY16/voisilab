# 🔄 Guide de Migration: Supabase → Backend Custom

## 📋 Vue d'ensemble

Ce guide vous aide à migrer de Supabase vers le backend custom VoisiLab (PostgreSQL + Express).

## ⚡ Changements Principaux

### Avant (Supabase)
- Backend hébergé sur Supabase
- Authentification via Supabase Auth
- Stockage via Supabase Storage
- Row Level Security (RLS)
- Client Supabase dans le front

### Après (Backend Custom)
- Backend auto-hébergé (Express + PostgreSQL)
- Authentification JWT
- Stockage local (Multer)
- Contrôle d'accès via middlewares
- Appels API REST standards

## 🗄 Migration de la Base de Données

### 1. Exporter les données depuis Supabase

```sql
-- Se connecter à Supabase via psql ou Dashboard SQL Editor

-- Exporter users
COPY user_profiles TO '/tmp/users.csv' CSV HEADER;

-- Exporter workshops
COPY workshops TO '/tmp/workshops.csv' CSV HEADER;

-- Etc. pour chaque table...
```

Ou utiliser le Dashboard Supabase:
1. Allez dans Table Editor
2. Sélectionnez la table
3. Export → CSV

### 2. Importer dans PostgreSQL local

```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d postgres

# Importer les données
docker-compose exec -T postgres psql -U voisilab_user -d voisilab_db <<EOF
\copy users(id, email, full_name, role, avatar_url, created_at) FROM '/tmp/users.csv' CSV HEADER;
\copy workshops FROM '/tmp/workshops.csv' CSV HEADER;
-- Etc.
EOF
```

### 3. Ajuster les mots de passe

Les mots de passe Supabase ne sont pas exportables. Il faut:

**Option A: Réinitialiser tous les mots de passe**
```sql
-- Générer un mot de passe temporaire pour tous les utilisateurs
UPDATE users SET password_hash = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'
WHERE role = 'user';
-- Ce hash correspond à "password123"
-- Les utilisateurs devront changer leur mot de passe
```

**Option B: Système de réinitialisation**
Créer un flux qui:
1. Envoie un email à chaque utilisateur
2. Lien de réinitialisation de mot de passe
3. L'utilisateur définit son nouveau mot de passe

## 🔐 Migration de l'Authentification

### Frontend (Next.js)

#### Avant - Supabase:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Get user
const { data: { user } } = await supabase.auth.getUser()

// API calls
const { data } = await supabase
  .from('workshops')
  .select('*')
```

#### Après - API Custom:
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()

  // Stocker le token
  localStorage.setItem('token', data.token)
  return data
}

async function getUser() {
  const token = localStorage.setItem'token')
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return res.json()
}

async function getWorkshops() {
  const res = await fetch(`${API_URL}/workshops`)
  return res.json()
}
```

### Admin (Vite + React)

#### Avant - Supabase:
```typescript
// services/workshopService.ts
export const getWorkshops = async () => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Après - API Custom:
```typescript
// services/api.ts
const API_URL = import.meta.env.VITE_API_URL
const getToken = () => localStorage.getItem('token')

const apiClient = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    if (!res.ok) throw new Error('API Error')
    return res.json()
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('API Error')
    return res.json()
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('API Error')
    return res.json()
  },

  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    if (!res.ok) throw new Error('API Error')
    return res.json()
  }
}

// services/workshopService.ts
export const getWorkshops = async () => {
  return apiClient.get('/workshops')
}

export const createWorkshop = async (workshop: any) => {
  return apiClient.post('/workshops', workshop)
}
```

## 📤 Migration du Stockage de Fichiers

### Avant - Supabase Storage:
```typescript
const { data, error } = await supabase.storage
  .from('media')
  .upload(`images/${file.name}`, file)

const { data: { publicUrl } } = supabase.storage
  .from('media')
  .getPublicUrl(`images/${file.name}`)
```

### Après - Upload Local (Multer):
```typescript
async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', file.name)

  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/media/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  const data = await res.json()
  // data.file_url contient l'URL du fichier uploadé
  // Ex: http://localhost:5000/uploads/media/abc123.jpg
  return data
}
```

## 🔄 Correspondance des Tables

| Supabase Table | Backend Custom Table | Notes |
|----------------|---------------------|-------|
| user_profiles | users | Ajout de password_hash |
| workshops | workshops | Identique |
| workshop_registrations | workshop_registrations | Identique |
| innovations | ❌ Supprimée | Non utilisée |
| services | services | Identique |
| contact_messages | contact_messages | Identique |
| team_members | team_members | Identique |
| ppn_locations | ppn_locations | Identique |
| ppn_members | ppn_members | Identique |
| equipment | equipment | Identique |
| blog_posts | blog_posts | Identique |
| media_library | media_library | file_path ajouté |
| dynamic_pages | dynamic_pages | Identique |
| page_sections | ❌ Intégré | Dans dynamic_pages JSONB |
| seo_metadata | ❌ Intégré | Dans tables respectives |
| navigation_menus | navigation_menus | Identique |
| site_settings | site_settings | Identique |
| project_submissions | project_submissions | Nouvelle |

## 🛠 Étapes de Migration Complète

### 1. Préparation

```bash
# Cloner le projet
git clone <repo>
cd voisilab-app

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

### 2. Démarrer le Backend

```bash
# Option Docker
docker-compose up -d postgres backend

# Option Locale
cd server
npm install
npm run dev
```

### 3. Migrer les Données

```bash
# Exporter depuis Supabase (voir section Export ci-dessus)

# Importer vers PostgreSQL
# Utiliser les scripts SQL fournis dans database/migration/
```

### 4. Mettre à Jour le Frontend

```bash
cd front-end

# Supprimer Supabase
npm uninstall @supabase/supabase-js

# Créer lib/api.ts avec les fonctions API
# Remplacer tous les appels Supabase par des appels API

# Mettre à jour .env
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Mettre à Jour l'Admin

```bash
cd admins

# Supprimer Supabase
npm uninstall @supabase/supabase-js

# Remplacer tous les services Supabase
# Voir exemples ci-dessus

# Mettre à jour .env
# VITE_API_URL=http://localhost:5000/api
```

### 6. Tester

```bash
# Tester le backend
curl http://localhost:5000/health

# Tester le login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@voisilab.fr","password":"admin123"}'

# Tester les ateliers
curl http://localhost:5000/api/workshops
```

## ✅ Checklist de Migration

- [ ] Exporter toutes les données depuis Supabase
- [ ] Démarrer PostgreSQL local
- [ ] Importer les données
- [ ] Réinitialiser les mots de passe utilisateurs
- [ ] Migrer les fichiers du stockage Supabase vers uploads/
- [ ] Remplacer Supabase Client par API dans frontend
- [ ] Remplacer Supabase Client par API dans admin
- [ ] Mettre à jour les variables d'environnement
- [ ] Tester toutes les fonctionnalités
- [ ] Tester l'authentification
- [ ] Tester l'upload de fichiers
- [ ] Déployer en production

## 🚨 Points d'Attention

1. **Mots de passe**: Les hashs Supabase ne sont pas compatibles. Prévoir une réinitialisation.

2. **URLs des fichiers**: Changer toutes les références d'URLs Supabase Storage vers les nouvelles URLs locales.

3. **RLS**: Le Row Level Security Supabase est remplacé par des middlewares backend. Vérifier les permissions.

4. **Realtime**: Supabase Realtime n'est pas implémenté. À ajouter via WebSockets si nécessaire.

5. **Auth Providers**: OAuth (Google, Facebook, etc.) nécessite une implémentation avec Passport.js.

## 📞 Support

Si vous rencontrez des problèmes durant la migration:

1. Vérifiez les logs: `docker-compose logs -f backend`
2. Vérifiez le health check: `curl http://localhost:5000/health`
3. Consultez la documentation: `server/README.md`

## 🎯 Avantages de la Migration

✅ **Contrôle total** sur votre backend
✅ **Pas de coûts** Supabase
✅ **Déploiement flexible** (VPS, cloud, local)
✅ **Performance** optimisée pour votre use case
✅ **Sécurité** maîtrisée
✅ **Évolutivité** sans limites Supabase

Bonne migration ! 🚀
