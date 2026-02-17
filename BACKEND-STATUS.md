# ✅ BACKEND - VÉRIFICATION COMPLÈTE AVANT DÉPLOIEMENT

## 📋 État actuel du backend (17 février 2026)

### ✅ Configuration CORS (.env)
```env
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502
```
**Status** : ✅ Correct - inclut bien admin.fablab.voisilab.online

### ✅ Serveur (server.ts)
- **CORS** : ✅ Utilise bien `process.env.ALLOWED_ORIGINS` avec fallback
- **Body limits** : ✅ 50MB configuré (json + urlencoded)
- **Callbacks dynamiques** : ✅ Fonction callback pour origine flexible
- **Headers** : ✅ Tous les headers nécessaires (Content-Type, Authorization, Accept)
- **Credentials** : ✅ Activé (`credentials: true`)

### ✅ Routes Contact (contactRoutes.ts)
**POST /api/contacts/submit**
- Validation : ✅ lastname, firstname, email, phone, subject, message
- Sécurité : ✅ ip_address, user_agent capturés
- Colonnes DB : ✅ replied_by, reply_content présents
- Notifications : ✅ Admins notifiés
- Erreurs : ✅ Gestion détaillée (ER_BAD_FIELD_ERROR, etc.)

### ✅ Routes Projets (projectSubmissionRoutes.ts)
**POST /api/project-submissions/submit**
- Validation : ✅ name, email, phone, projectType, description
- Upload : ✅ Multer configuré (5 fichiers max, 10MB chacun)
- Colonnes DB : ✅ ip_address, user_agent, submission_source, timeline
- Fichiers : ✅ Stockage dans `uploads/confidential/projects/YYYY-MM/`
- Table submission_files : ✅ Métadonnées fichiers enregistrées
- Notifications : ✅ Admins notifiés

### ✅ Base de données
**Table contact_messages**
- ✅ lastname, firstname, email, phone, subject, message
- ✅ ip_address, user_agent (sécurité)
- ✅ replied_by, reply_content (gestion réponses)
- ✅ status, created_at, updated_at, read_at, replied_at

**Table project_submissions**
- ✅ name, email, phone, project_type, budget, timeline, description
- ✅ files_json (métadonnées)
- ✅ ip_address, user_agent, submission_source
- ✅ status, reviewed_by, reviewed_at, admin_notes

**Table submission_files** (nouvelle)
- ✅ submission_id, original_filename, stored_filename
- ✅ file_path, file_size, mime_type, file_extension
- ✅ Clé étrangère vers project_submissions

## 🔧 Ce qui a été corrigé

### Problèmes résolus
1. ✅ **CORS localhost:3501** : Ajouté dans ALLOWED_ORIGINS
2. ✅ **Upload 50MB** : Body limits augmentés de 10MB → 50MB
3. ✅ **Colonnes manquantes** : Migration exécutée avec succès
   - contact_messages : +4 colonnes (ip_address, user_agent, replied_by, reply_content)
   - project_submissions : +4 colonnes (ip_address, user_agent, submission_source, timeline)
   - submission_files : Table créée
4. ✅ **PPN Service** : Refactored avec error handling
5. ✅ **Couleurs admin** : Palette VoisiLab (#a306a1) appliquée

### Scripts créés
- ✅ `database/check-tables-structure.js` : Vérification structure BDD
- ✅ `database/migrate-forms-complete.js` : Migration colonnes manquantes
- ✅ `database/fix-forms-tables.js` : Migration initiale (obsolète)

## ⚠️ ACTION REQUISE SUR LE SERVEUR

### Le seul problème restant
Le fichier `.env` sur le serveur de production n'a **PAS** la variable ALLOWED_ORIGINS à jour.

### Solution (2 minutes)
```bash
# 1. SSH vers le serveur
ssh root@srv1579.hstgr.io

# 2. Naviguer vers le dossier server
cd ~/voisilab-app/server

# 3. Éditer le .env
nano .env

# 4. Modifier/Ajouter cette ligne :
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502

# 5. Sauvegarder (Ctrl+O, Entrée, Ctrl+X)

# 6. Redémarrer PM2
pm2 restart voisilab-backend

# 7. Vérifier les logs
pm2 logs voisilab-backend --lines 20
```

Vous devriez voir dans les logs :
```
CORS configuré pour: https://fablab.voisilab.online, https://admin.fablab.voisilab.online, https://www.fablab.voisilab.online, http://localhost:3501, http://localhost:3502
```

## 🚀 Déploiement complet (si git pull)

Si vous préférez faire un `git pull` complet :

```bash
# Sur le serveur
cd ~/voisilab-app
git pull origin main

cd server
npm install  # Au cas où
npm run build
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 50
```

## 🧪 Tests après déploiement

### 1. Test CORS Admin
```bash
# Depuis votre machine locale
curl -I -X OPTIONS https://api.fablab.voisilab.online/api/auth/login \
  -H "Origin: https://admin.fablab.voisilab.online" \
  -H "Access-Control-Request-Method: POST"
```

Réponse attendue :
```
Access-Control-Allow-Origin: https://admin.fablab.voisilab.online
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Credentials: true
```

### 2. Test formulaire contact
Visiter : https://fablab.voisilab.online/about
Soumettre le formulaire → Devrait retourner "Message envoyé avec succès!"

### 3. Test formulaire projet
Visiter : https://fablab.voisilab.online/projet
Soumettre avec fichiers → Devrait retourner "Projet soumis avec succès!"

### 4. Test admin login
Visiter : https://admin.fablab.voisilab.online
Se connecter → Devrait fonctionner sans erreur CORS

## 📊 Résumé

| Item | Status | Note |
|------|--------|------|
| CORS configuré | ✅ | Inclut admin.fablab.voisilab.online |
| Upload 50MB | ✅ | Backend configuré (Nginx à vérifier) |
| BDD migrée | ✅ | Toutes colonnes présentes |
| Routes testées | ✅ | Contacts et projets OK |
| .env serveur | ⚠️ | **À METTRE À JOUR** |

## ⚡ Action immédiate

**LA SEULE CHOSE À FAIRE** : Mettre à jour le fichier `.env` sur le serveur de production avec la ligne ALLOWED_ORIGINS correcte, puis `pm2 restart voisilab-backend`.

Tout le reste du code est **déjà prêt et correct** ! 🎉
