# Base de données VoisiLab - Supabase

## Vue d'ensemble

Ce dossier contient le schéma complet de la base de données Supabase pour la plateforme VoisiLab (admin + utilisateur).

## Fichiers

- **`supabase-schema.sql`** : Schéma complet avec 16 tables, RLS, triggers et indexes
- **`seed-data.sql`** : Données de démonstration pour le développement

## Tables créées

1. `user_profiles` - Profils utilisateurs avec rôles (admin/user)
2. `workshops` - Ateliers et événements
3. `workshop_registrations` - Inscriptions aux ateliers
4. `innovations` - Projets d'innovation
5. `services` - Services proposés
6. `contact_messages` - Messages de contact
7. `team_members` - Membres de l'équipe
8. `ppn_locations` - Points du réseau PPN
9. `ppn_members` - Membres du réseau PPN
10. `equipment` - Équipements disponibles
11. `page_sections` - Sections de pages (CMS dynamique)
12. `media_library` - Médiathèque
13. `blog_posts` - Articles de blog
14. `seo_metadata` - Métadonnées SEO par page
15. `navigation_menus` - Menus de navigation
16. `site_settings` - Paramètres globaux du site

**Note:** La table `project_submissions` existe déjà dans votre base Supabase et sera conservée.

## Storage Buckets à créer

Dans Supabase Storage, créez les buckets suivants :

1. `project-files` (déjà existant)
2. `workshop-images`
3. `innovation-images`
4. `team-avatars`
5. `media-library`
6. `blog-images`
7. `ppn-images`

## Installation

### Option 1 : Via l'interface Supabase (Recommandé)

1. Connectez-vous à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet VoisiLab
3. Allez dans **SQL Editor**
4. Copiez le contenu de `supabase-schema.sql`
5. Cliquez sur **Run**
6. Une fois terminé, copiez le contenu de `seed-data.sql`
7. Cliquez sur **Run**

### Option 2 : Via Supabase CLI

```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Se connecter
supabase login

# Lier au projet
supabase link --project-ref <votre-project-ref>

# Exécuter les migrations
supabase db push --db-url <votre-database-url>

# Ou exécuter directement les fichiers
psql <votre-database-url> -f database/supabase-schema.sql
psql <votre-database-url> -f database/seed-data.sql
```

## Row Level Security (RLS)

Toutes les tables ont RLS activé avec deux politiques principales :

### Politique Admin
- **Accès complet** (SELECT, INSERT, UPDATE, DELETE) pour les utilisateurs avec `role = 'admin'` dans `user_profiles`

### Politique Public
- **Lecture seule** des données publiques (ateliers à venir, services actifs, etc.)
- **Insertion** autorisée pour certaines tables (contact_messages, workshop_registrations, project_submissions)

## Créer un utilisateur admin

Après avoir exécuté le schéma :

1. Créez un compte via l'interface utilisateur ou Supabase Auth
2. Dans Supabase Dashboard > Authentication > Users, notez l'UUID du user
3. Dans SQL Editor, exécutez :

```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = '<uuid-de-votre-utilisateur>';
```

Ou créez un admin directement :

```sql
-- Insérer dans auth.users (remplacer les valeurs)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@voisilab.fr',
  crypt('VotreMotDePasse123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin VoisiLab"}',
  NOW(),
  NOW(),
  '',
  ''
) RETURNING id;

-- Puis mettre à jour le profil avec le rôle admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@voisilab.fr');
```

## Vérification

Après l'installation, vérifiez que tout fonctionne :

```sql
-- Vérifier les tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vérifier RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Vérifier les données de test
SELECT COUNT(*) as workshops FROM public.workshops;
SELECT COUNT(*) as services FROM public.services;
SELECT COUNT(*) as team_members FROM public.team_members;
```

## Maintenance

### Réinitialiser la base de données

⚠️ **ATTENTION: Cela supprimera toutes les données !**

```sql
-- Supprimer toutes les tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Puis ré-exécuter supabase-schema.sql et seed-data.sql
```

### Sauvegarder les données

```bash
# Sauvegarder toutes les tables
pg_dump <database-url> > backup.sql

# Sauvegarder une table spécifique
pg_dump <database-url> -t public.workshops > workshops_backup.sql
```

## Troubleshooting

### Erreur "relation already exists"
Les tables existent déjà. Vous pouvez :
- Supprimer les tables existantes avant de ré-exécuter
- Ou modifier le script pour utiliser `CREATE TABLE IF NOT EXISTS`

### Erreur de permissions
Assurez-vous d'utiliser le service_role_key (pas anon_key) pour les opérations d'admin.

### RLS bloque mes requêtes
Vérifiez que :
1. L'utilisateur est authentifié
2. Le rôle est correct dans `user_profiles`
3. Les politiques RLS sont bien créées

## Support

Pour plus d'informations :
- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
