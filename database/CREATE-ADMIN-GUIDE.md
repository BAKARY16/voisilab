# 🔑 GUIDE: Créer un Administrateur en Production

## ⚡ Méthode Rapide (Recommandée)

### Sur le serveur (SSH):

```bash
# 1. Connectez-vous au serveur
ssh jean1@69.62.106.191

# 2. Allez dans le dossier database
cd ~/voisilab/database

# 3. Récupérez les derniers scripts
git pull

# 4. Exécutez le script de création admin
node create-production-admin.js
```

## 📋 Identifiants par Défaut

Le script créera automatiquement un compte admin avec:

- **Username:** `admin`
- **Email:** `admin@fablab.voisilab.online`
- **Password:** `Admin@2026!Voisilab`
- **Role:** `admin`

## ⚠️ IMPORTANT - Sécurité

1. **Connectez-vous immédiatement** après création
2. **Changez le mot de passe** via votre profil
3. **Ne partagez jamais** ces identifiants

## 🌐 Connexion

Une fois le compte créé:

1. Allez sur: **https://admin.fablab.voisilab.online**
2. Connectez-vous avec les identifiants ci-dessus
3. Allez dans **Profil** → **Changer le mot de passe**

## 🔄 Autres Méthodes

### Méthode 1: Script Interactif (create-admin.js)

```bash
cd ~/voisilab/server
node create-admin.js
```

Vous demandera:
- Votre username
- Votre email
- Votre mot de passe

### Méthode 2: Insertion SQL Manuelle

Si vous préférez créer un admin manuellement via phpMyAdmin:

1. **Connectez-vous à phpMyAdmin Hostinger**
2. **Sélectionnez la base:** `u705315732_fablab`
3. **Exécutez cette requête:**

```sql
-- Générer un hash bcrypt pour le mot de passe "VotreMotDePasse"
-- Utilisez un générateur en ligne: https://bcrypt-generator.com/
-- Coût: 10 rounds

INSERT INTO users (username, email, password, role, created_at, updated_at)
VALUES (
  'admin',
  'admin@fablab.voisilab.online',
  '$2a$10$VotreHashBcryptIci',  -- Remplacez par votre hash
  'admin',
  NOW(),
  NOW()
);
```

**Note:** Vous devez générer le hash bcrypt de votre mot de passe avant d'exécuter cette requête.

## 🐛 Dépannage

### Erreur "Access Denied"

**Problème:** Vous essayez d'exécuter depuis votre machine locale.

**Solution:** Exécutez sur le serveur via SSH.

### Erreur "User already exists"

**Problème:** Un utilisateur avec cet email existe déjà.

**Solutions:**
1. Utilisez le compte existant
2. Modifiez l'email dans le script
3. Supprimez l'utilisateur existant si nécessaire:

```sql
DELETE FROM users WHERE email = 'admin@fablab.voisilab.online';
```

### Erreur "Table users doesn't exist"

**Problème:** Le schéma de base de données n'a pas été créé.

**Solution:**

```bash
cd ~/voisilab/database
node push-schema.js
```

## ✅ Vérification

Pour vérifier que l'admin a été créé:

```bash
cd ~/voisilab/server
node check-admin-users.js
```

Ou via SQL dans phpMyAdmin:

```sql
SELECT id, username, email, role, created_at 
FROM users 
WHERE role = 'admin';
```

---

**Temps estimé:** 2-3 minutes
**Dernière mise à jour:** 17 février 2026
