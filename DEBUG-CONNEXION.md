# 🔧 Guide de Debug - Problème de Connexion Admin

## Problème : Impossible de se connecter

### ✅ Checklist de vérification

#### 1. Vérifier que le schéma Supabase est installé
```sql
-- Dans Supabase SQL Editor, exécutez :
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir ces tables :
- `blog_posts`
- `contact_messages`
- `equipment`
- `innovations`
- `media_library`
- `navigation_menus`
- `page_sections`
- `ppn_locations`
- `ppn_members`
- `project_submissions`
- `seo_metadata`
- `services`
- `site_settings`
- `team_members`
- `user_profiles` ⚠️ **CRITIQUE**
- `workshop_registrations`
- `workshops`

Si `user_profiles` n'existe pas → **Le schéma n'est pas installé correctement**

---

#### 2. Vérifier qu'un utilisateur admin existe

```sql
-- Vérifier dans auth.users
SELECT id, email, created_at
FROM auth.users
LIMIT 5;
```

Si vide → **Créez un utilisateur admin** (voir ci-dessous)

```sql
-- Vérifier le rôle admin
SELECT id, email, role
FROM auth.users au
JOIN user_profiles up ON au.id = up.id
WHERE up.role = 'admin';
```

Si vide → **Aucun admin configuré** (voir ci-dessous)

---

### 🛠️ Solution 1 : Créer un utilisateur admin

#### Option A : Via Supabase Dashboard (RECOMMANDÉ)

1. **Supabase Dashboard** → **Authentication** → **Users**
2. Cliquez sur **"Add user"** (ou "Invite")
3. Remplissez :
   - **Email**: `admin@voisilab.fr` (ou votre email)
   - **Password**: `VotreMotDePasse123!` (min 6 caractères)
   - Cochez **"Auto Confirm User"** ✅
4. Cliquez sur **"Create user"**

5. **Maintenant, donnez le rôle admin** :
   - Copiez l'**ID de l'utilisateur** créé (dans la colonne ID)
   - Allez dans **SQL Editor**
   - Exécutez :

```sql
-- Remplacez 'VOTRE-USER-ID-ICI' par l'ID copié
UPDATE user_profiles
SET role = 'admin', full_name = 'Administrateur VoisiLab'
WHERE id = 'VOTRE-USER-ID-ICI';

-- Vérifier
SELECT * FROM user_profiles WHERE id = 'VOTRE-USER-ID-ICI';
```

#### Option B : Via SQL Editor (Avancé)

```sql
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Créer l'utilisateur dans auth.users
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
    'admin@voisilab.fr', -- 👈 CHANGEZ ICI
    crypt('VotreMotDePasse123!', gen_salt('bf')), -- 👈 CHANGEZ ICI
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Administrateur VoisiLab"}',
    NOW(),
    NOW(),
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Le profil devrait être créé automatiquement par le trigger
  -- Mais on force le rôle admin
  UPDATE user_profiles
  SET role = 'admin', full_name = 'Administrateur VoisiLab'
  WHERE id = new_user_id;

  RAISE NOTICE 'Utilisateur admin créé : %', new_user_id;
END $$;
```

---

### 🛠️ Solution 2 : Vérifier les variables d'environnement

#### Dans `admins/.env`

```env
VITE_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
VITE_API_URL=http://localhost:5173
VITE_USER_APP_URL=http://localhost:3000
VITE_APP_VERSION=v1.0.0
VITE_APP_BASE_NAME=/
VITE_APP_NAME=VoisiLab Admin
VITE_ENV=development
GENERATE_SOURCEMAP=false
```

⚠️ **IMPORTANT** : Après modification du `.env`, **redémarrez le serveur** :

```bash
# Ctrl+C pour arrêter
cd admins
npm run dev
```

---

### 🛠️ Solution 3 : Debug dans la console navigateur

1. Ouvrez **Chrome DevTools** (F12)
2. Allez sur l'onglet **Console**
3. Tentez de vous connecter
4. Regardez les erreurs :

#### Erreur : "Failed to fetch" ou "CORS error"
→ Problème de connexion Supabase
- Vérifiez `VITE_SUPABASE_URL` dans `.env`
- Vérifiez que votre projet Supabase est actif

#### Erreur : "Invalid login credentials"
→ Email ou mot de passe incorrect
- Vérifiez que l'utilisateur existe dans auth.users
- Vérifiez le mot de passe

#### Erreur : "Accès réservé aux administrateurs"
→ L'utilisateur n'a pas le rôle admin
- Exécutez :
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'votre-email@example.com';
```

#### Erreur : "User not found" ou "Profile not found"
→ Le profil utilisateur n'existe pas dans `user_profiles`
- Créez le profil:
```sql
-- Remplacer par votre user ID
INSERT INTO user_profiles (id, full_name, role)
VALUES ('VOTRE-USER-ID', 'Admin VoisiLab', 'admin');
```

---

### 🛠️ Solution 4 : Vérifier RLS (Row Level Security)

Les politiques RLS peuvent bloquer l'accès. Vérifiez :

```sql
-- Désactiver temporairement RLS sur user_profiles (DEBUG SEULEMENT)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Essayer de se connecter

-- IMPORTANT: Réactiver après test !
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

---

### 🛠️ Solution 5 : Vérifier que le trigger handle_new_user fonctionne

```sql
-- Vérifier que le trigger existe
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Si vide → Le trigger n'existe pas. Ré-exécutez le schéma SQL.

---

## 📋 Commandes de debug rapides

### Lister tous les utilisateurs
```sql
SELECT
  au.id,
  au.email,
  au.created_at,
  up.role,
  up.full_name
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC;
```

### Transformer un user en admin
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'votre-email@example.com';
```

### Supprimer un utilisateur (si besoin de recommencer)
```sql
-- ATTENTION: Supprime définitivement !
DELETE FROM auth.users WHERE email = 'admin@voisilab.fr';
```

---

## 🎯 Processus de connexion étape par étape

1. **L'utilisateur entre email/password** → Form validation
2. **AuthContext.signIn()** est appelé
3. **Supabase Auth** vérifie les credentials dans `auth.users`
4. **getUserProfile()** récupère le profil depuis `user_profiles`
5. **Vérification rôle** : `if (profile.role !== 'admin')` → rejet
6. **Si admin** : `setUser() + setProfile() + redirect`

**Points de défaillance possibles :**
- Étape 3 : Email/password incorrect
- Étape 4 : Profil inexistant dans `user_profiles`
- Étape 5 : Rôle = 'user' au lieu de 'admin'

---

## ✅ Test de connexion réussi

Après corrections, vous devriez:
1. Voir la page de login : http://localhost:5173/login
2. Entrer vos credentials
3. Voir "Connexion..." pendant le chargement
4. Être redirigé vers : http://localhost:5173/dashboard/default
5. Voir votre email en haut à droite (si affiché)

---

## 🆘 Toujours bloqué ?

Envoyez-moi :
1. Les erreurs de la console navigateur (F12 → Console)
2. Le résultat de :
```sql
SELECT * FROM auth.users LIMIT 3;
SELECT * FROM user_profiles;
```

Je vous aiderai à diagnostiquer ! 💪
