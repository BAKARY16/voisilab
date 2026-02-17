# 🚀 Guide de Redéploiement Backend - Production

## 📊 Corrections apportées

### 1. Schéma Base de Données
- ✅ Table `users`: password_hash, full_name, active, email_verified
- ✅ Table `contacts` → `contact_messages` + colonne `read_at`
- ✅ Admin créé: admin@fablab.voisilab.online

### 2. Backend (TypeScript)
- ✅ statsRoutes.ts: `team` → `team_members`
- ✅ projectSubm issionRoutes.ts: `review_notes` → `admin_notes`
- ✅ Toutes les références aux colonnes mises à jour

### 3. Frontend Admin
- ✅ API_URL: https://api.fablab.voisilab.online
- ✅ CORS configuré pour: https://admin.fablab.voisilab.online

## 🔧 Étapes de Redéploiement

### Sur votre machine locale (Windows):

```powershell
# 1. Vérifier les modifications
git status

# 2. Ajouter tous les fichiers modifiés
git add -A

# 3. Commiter
git commit -m "Fix: Backend compatible schéma production (users, contact_messages, team_members, project_submissions)"

# 4. Pousser sur le dépôt
git push origin main
```

### Sur le serveur (via SSH):

```bash
# 1. Se connecter au serveur Hostinger
ssh user@your-server-ip

# 2. Aller dans le dossier du backend
cd /path/to/voisilab-app/server

# 3. Récupérer les dernières modifications
git pull origin main

# 4. Installer les dépendances (si nécessaire)
npm install

# 5. Build le projet TypeScript
npm run build

# 6. Redémarrer le processus PM2
pm2 restart voisilab-backend

# 7. Vérifier les logs
pm2 logs voisilab-backend --lines 50

# 8. Vérifier le statut
pm2 status
```

## ✅ Vérification

### 1. Test API Stats
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.fablab.voisilab.online/api/stats
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "contacts": { "total": 0, "unread": 0, ... },
      "projects": { "total": 0, "pending": 0, ... },
      "team": { "total": 0, "active": 0, ... }
    },
    "recent": {
      "contacts": [],
      "projects": []
    }
  }
}
```

### 2. Test Dashboard Admin
1. Ouvrir https://admin.fablab.voisilab.online
2. Se connecter avec: admin@fablab.voisilab.online / Admin@2026!Voisilab
3. Le dashboard devrait afficher les stats sans erreur

### 3. Vérifier les logs
```bash
# Logs PM2
pm2 logs voisilab-backend --lines 100

# Logs système
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔍 Dépannage

### Erreur 500 persistante
```bash
# Vérifier les logs détaillés
pm2 logs voisilab-backend --err --lines 200

# Vérifier que le build s'est bien passé
cd /path/to/voisilab-app/server
ls -la dist/

# Reconstruire si nécessaire
npm run build
pm2 restart voisilab-backend
```

### CORS toujours bloqué
```bash
# Vérifier le fichier .env du serveur
cd /path/to/voisilab-app/server
cat .env | grep ALLOWED_ORIGINS

# Devrait contenir:
# ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online

# Si absent, ajouter et redémarrer
echo "ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online" >> .env
pm2 restart voisilab-backend
```

### Base de données
```bash
# Tester la connexion
cd /path/to/voisilab-app/database
node verify-schema.js

# Si des tables manquent
node fix-users-table.js
node migrate-contacts-table.js
```

## 📝 Fichiers modifiés

### Backend
- `server/src/routes/statsRoutes.ts` - Correction team → team_members
- `server/src/routes/projectSubmissionRoutes.ts` - Correction review_notes → admin_notes
- `server/.env` - ALLOWED_ORIGINS ajouté

### Database
- `database/schema.sql` - Schéma mis à jour (users, contact_messages)
- `database/fix-users-table.js` - Script de migration users
- `database/migrate-contacts-table.js` - Script de migration contacts
- `database/create-production-admin.js` - Création admin
- `database/verify-schema.js` - Vérification du schéma

## 🎯 Prochaines étapes

Une fois le backend redéployé et fonctionnel :

1. **Tester toutes les pages admin:**
   - Dashboard ✅
   - Contacts ✅
   - Projets ✅
   - Équipe ✅
   - Blog ⚠️  (peut manquer de données)
   - Workshops ⚠️  (peut manquer de données)
   - Equipment ⚠️  (peut manquer de données)

2. **Migrer les tables restantes** (si nécessaire):
   - Créer scripts de migration pour workshops
   - Créer scripts de migration pour equipment
   - Créer scripts de migration pour blog_posts
   - Créer scripts de migration pour ppn_locations

3. **Changer le mot de passe admin:**
   - Se connecter avec Admin@2026!Voisilab
   - Aller dans Profil → Changer le mot de passe

## 📞 Support

Si problèmes persistants:
- Vérifier les logs PM2: `pm2 logs voisilab-backend`
- Vérifier les logs Nginx: `tail -f /var/log/nginx/error.log`
- Vérifier la base de données: `node verify-schema.js`
