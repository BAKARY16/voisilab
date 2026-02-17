# Migration Authentification Admin - De Supabase vers Backend Custom MySQL

## Résumé des Changements

L'interface admin VoisiLab a été migrée de Supabase vers notre backend custom MySQL.

## Fichiers Modifiés

### 1. Nouveau Service d'Authentification
**Fichier**: `admins/src/lib/api/auth.service.ts` (NOUVEAU)

Ce service remplace complètement Supabase et communique directement avec notre backend MySQL.

**Fonctionnalités**:
- ✅ Login (signIn)
- ✅ Logout (signOut)
- ✅ Récupération utilisateur (getCurrentUser)
- ✅ Mise à jour profil (updateUserProfile)
- ✅ Refresh token
- ✅ Stockage JWT dans localStorage
- ✅ Vérification automatique du rôle admin

**API utilisée**: `http://localhost:5000/api/auth/*`

### 2. Context d'Authentification
**Fichier**: `admins/src/contexts/AuthContext.tsx` (MODIFIÉ)

Changements:
- ❌ Supprimé: Import de `@supabase/supabase-js`
- ❌ Supprimé: Variables `session` et `profile` Supabase
- ✅ Ajouté: Import du nouveau service `../lib/api/auth.service`
- ✅ Ajouté: Gestion du token JWT
- ✅ Ajouté: Stockage/récupération depuis localStorage

### 3. Configuration
**Fichier**: `admins/.env` (MODIFIÉ)

Avant:
```env
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:5173  # MAUVAIS
```

Après:
```env
VITE_API_URL=http://localhost:5000  # Backend MySQL
```

## Comment Tester le Login Admin

### 1. Vérifier que le Backend est en Marche

```bash
# Depuis la racine du projet
docker-compose ps

# Vérifier la santé du backend
curl http://localhost:5000/health
```

Résultat attendu:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-11T...",
  "database": "connected"
}
```

### 2. Démarrer l'Interface Admin

```bash
cd admins
npm run dev
```

L'admin devrait démarrer sur `http://localhost:3001` (ou le port configuré).

### 3. Tester le Login

**URL**: http://localhost:3001/login

**Identifiants admin**:
- Email: `admin@voisilab.fr`
- Mot de passe: `admin123`

### 4. Flux de Connexion

1. **Remplir le formulaire** avec les identifiants
2. Le formulaire appelle `AuthContext.signIn(email, password)`
3. `AuthContext` appelle `auth.service.ts → signIn()`
4. Le service envoie une requête POST à `http://localhost:5000/api/auth/login`
5. Le backend MySQL vérifie:
   - Email existe dans la table `users`
   - Password hash correspond (bcrypt)
   - Role = 'admin'
6. Le backend renvoie:
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
7. Le service stocke dans `localStorage`:
   - `voisilab_auth_token`: Le JWT token
   - `voisilab_auth_user`: Les infos utilisateur
8. Redirection vers `/dashboard/default`

### 5. Vérifier dans la Console du Navigateur

Ouvrir DevTools (F12) → Console:

Messages attendus:
```
✅ Connexion réussie: admin@voisilab.fr
🔐 Auth event: SIGNED_IN
```

Vérifier le localStorage (F12 → Application → Local Storage):
```
voisilab_auth_token: eyJhbGciOiJIUzI1NiIs...
voisilab_auth_user: {"id":"...","email":"admin@voisilab.fr",...}
```

## Débogage

### Erreur: "Erreur de base de données lors de l'interrogation du schéma"

❌ **Cause**: L'admin essaie encore d'utiliser Supabase

✅ **Solution**:
- Vérifier que `.env` utilise `VITE_API_URL=http://localhost:5000`
- Redémarrer le serveur de dev: `npm run dev`
- Vider le cache du navigateur (Ctrl+Shift+Delete)

### Erreur: "Email ou mot de passe incorrect"

Causes possibles:
1. **Backend non démarré**
   ```bash
   docker-compose up -d backend
   ```

2. **Mauvais hash password dans la DB**
   ```bash
   # Vérifier le hash
   docker exec voisilab-mysql mysql -u root -proot_password voisilab_db \
     -e "SELECT email, LENGTH(password_hash) FROM users WHERE email='admin@voisilab.fr';"

   # Doit retourner: length = 60
   ```

3. **Variables d'environnement backend**
   ```bash
   docker exec voisilab-backend env | grep DATABASE

   # Doit montrer:
   # DATABASE_USER=voisilab_user
   # DATABASE_PASSWORD=changez_moi_en_production
   ```

### Erreur: "Network Error" ou "Failed to fetch"

❌ **Cause**: Le backend n'est pas accessible depuis l'admin

✅ **Solutions**:
1. Vérifier que le backend est sur le port 5000:
   ```bash
   curl http://localhost:5000/health
   ```

2. Vérifier CORS dans le backend:
   Le backend doit autoriser `http://localhost:3001`

3. Vérifier la console réseau (F12 → Network):
   - Requête POST vers `http://localhost:5000/api/auth/login`
   - Status: 200 OK ou 401 Unauthorized

### Erreur: "Accès réservé aux administrateurs"

❌ **Cause**: L'utilisateur n'a pas le role 'admin'

✅ **Solution**:
```bash
# Vérifier le role
docker exec voisilab-mysql mysql -u root -proot_password voisilab_db \
  -e "SELECT email, role FROM users WHERE email='admin@voisilab.fr';"

# Mettre à jour si nécessaire
docker exec voisilab-mysql mysql -u root -proot_password voisilab_db \
  -e "UPDATE users SET role='admin' WHERE email='admin@voisilab.fr';"
```

## Fichiers et Pages Nécessitant encore Migration

13 pages utilisent encore Supabase (en attente de migration):

- admins/src/pages/pages-dynamiques/index.jsx
- admins/src/pages/blog/index.jsx
- admins/src/pages/mediatheque/index.jsx
- admins/src/pages/ppn/membres/index.jsx
- admins/src/pages/ppn/index.jsx
- admins/src/pages/materiels/index.jsx
- admins/src/pages/equipe/index.jsx
- admins/src/pages/services/index.jsx
- admins/src/pages/ateliers/index.jsx
- admins/src/pages/inscriptions/index.jsx
- admins/src/pages/contacts/index.jsx
- admins/src/pages/dashboard/default.jsx
- admins/src/pages/projets/index.jsx

**Note**: Ces pages pourront être migrées après avoir terminé les controllers backend correspondants.

## Prochaines Étapes

1. ✅ **FAIT**: Remplacer Supabase par backend custom pour l'authentification
2. 🔄 **EN COURS**: Tester le login admin
3. ⏳ **À FAIRE**: Corriger les 12 controllers backend restants
4. ⏳ **À FAIRE**: Migrer les pages admin vers le backend custom
5. ⏳ **À FAIRE**: Migrer le frontend utilisateur

---

Mis à jour: 11/02/2026
