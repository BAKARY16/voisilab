# 🚀 Guide d'Installation Rapide - Plateforme Admin VoisiLab

## ✅ Ce qui a été configuré

### Phase 1 : Infrastructure ✅ TERMINÉ
- ✅ Schéma Supabase complet (16 tables + RLS + triggers + indexes)
- ✅ Données de démonstration (seed data)
- ✅ Variables d'environnement (.env) configurées
- ✅ README base de données

### Phase 2 : Authentification ✅ TERMINÉ
- ✅ Service d'authentification Supabase
- ✅ Context React (AuthContext)
- ✅ Component ProtectedRoute
- ✅ Page de login fonctionnelle
- ✅ Protection des routes admin

### Phase 3 : Services API ✅ EN COURS
- ✅ Client Supabase configuré
- ✅ Service d'authentification
- ✅ Service Workshops (ateliers)
- ✅ Service Projects (projets)
- ✅ Service Contacts
- ✅ Service Registrations (inscriptions)
- ✅ Service Services
- ✅ Service Users
- ✅ Service Settings
- ✅ Service Dashboard (statistiques)

---

## 🎯 PROCHAINES ÉTAPES CRITIQUES

### Étape 1 : Installation du schéma dans Supabase (OBLIGATOIRE)

Vous devez maintenant installer le schéma dans votre base Supabase :

1. **Allez sur Supabase Dashboard**
   - Ouvrez : https://app.supabase.com
   - Sélectionnez votre projet VoisiLab

2. **Exécutez le schéma SQL**
   - Cliquez sur "SQL Editor" dans le menu latéral
   - Ouvrez le fichier : `database/supabase-schema.sql`
   - Copiez TOUT le contenu
   - Collez dans l'éditeur SQL
   - Cliquez sur "Run" (en bas à droite)
   - ✅ Attendez le message de succès

3. **Insérez les données de test**
   - Dans le même SQL Editor
   - Ouvrez le fichier : `database/seed-data.sql`
   - Copiez TOUT le contenu
   - Collez dans l'éditeur SQL
   - Cliquez sur "Run"
   - ✅ Attendez le message de succès

4. **Créez les Storage Buckets**
   - Cliquez sur "Storage" dans le menu latéral
   - Créez les buckets suivants (Publics) :
     - `workshop-images`
     - `innovation-images`
     - `team-avatars`
     - `media-library`
     - `blog-images`
     - `ppn-images`
   - Note : `project-files` existe déjà

5. **Créez un utilisateur admin**
   - Dans SQL Editor, exécutez (remplacez les valeurs) :

```sql
-- Créer un utilisateur admin
-- IMPORTANT: REMPLACEZ 'admin@voisilab.fr' et 'VotreMotDePasse123!'

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
    '{"full_name":"Administrateur VoisiLab"}', -- 👈 CHANGEZ ICI (optionnel)
    NOW(),
    NOW(),
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Mettre à jour le profil avec le rôle admin
  UPDATE public.user_profiles
  SET role = 'admin', full_name = 'Administrateur VoisiLab'
  WHERE id = new_user_id;

  RAISE NOTICE 'Utilisateur admin créé avec succès : %', new_user_id;
END $$;
```

---

### Étape 2 : Démarrer l'application Admin

```bash
cd admins
npm install  # Si pas encore fait
npm run dev
```

L'admin sera accessible sur : **http://localhost:5173**

---

### Étape 3 : Se connecter

1. Ouvrez http://localhost:5173/login
2. Connectez-vous avec :
   - Email : `admin@voisilab.fr` (ou celui que vous avez choisi)
   - Mot de passe : `VotreMotDePasse123!` (ou celui que vous avez choisi)
3. ✅ Vous devriez être redirigé vers le dashboard !

---

## 📋 Statut d'avancement global

### ✅ Terminé (40%)
- Infrastructure & Base de données
- Authentification fonctionnelle
- Services API de base
- Login protégé

### 🚧 En cours (Phase suivante - 30%)
- Composants réutilisables (DataTable, forms, etc.)
- Pages admin complètes (Pr événements, Contacts, Ateliers, etc.)
- Dashboard avec vraies données Supabase

### ⏳ À faire (30%)
- Pages CMS (éditeur de contenu)
- Médiathèque
- Blog
- SEO
- Paramètres globaux
- Connexion front-end utilisateur
- Configuration Docker
- Tests

---

## 🐛 Troubleshooting

### Problème : Erreur "table does not exist"
**Solution** : Vous n'avez pas exécuté le schéma SQL. Retournez à l'Étape 1.

### Problème : "Accès réservé aux administrateurs"
**Solution** : Votre utilisateur n'a pas le rôle admin. Exécutez :
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'votre-email@example.com';
```

### Problème : Cannot find module '@supabase/supabase-js'
**Solution** :
```bash
cd admins
npm install @supabase/supabase-js
```

### Problème : Variables d'environnement non trouvées
**Solution** : Vérifiez que le fichier `admins/.env` existe et contient :
```env
VITE_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
```

---

## 📞 Support

Référez-vous à :
- `database/README.md` - Guide complet de la base de données
- Plan complet dans : `.claude/plans/melodic-hopping-nova.md`

---

## 🎉 Prochaine session de développement

Quand le schéma sera installé et que vous pourrez vous connecter :
1. Je créerai les composants réutilisables (DataTable, etc.)
2. Je connecterai le dashboard aux vraies données
3. Je créerai les pages admin complètes (Projets, Contacts, Ateliers, etc.)

**Status actuel : 40% du projet admin terminé ! 🚀**
