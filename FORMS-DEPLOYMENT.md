# 🚀 GUIDE DE DÉPLOIEMENT - CORRECTION FORMULAIRES

## ✅ Problème résolu
Les colonnes manquantes (`ip_address`, `user_agent`, `replied_by`, `reply_content`) ont été ajoutées aux tables `contact_messages` et `project_submissions`.

## 📋 Étapes de déploiement

### 1. Vérifier que Git est à jour
```bash
cd ~/voisilab-app
git pull origin main
```

### 2. Déployer le backend
```bash
cd ~/voisilab-app/server
npm install  # Au cas où de nouvelles dépendances
npm run build
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 50
```

### 3. Vérifier les logs
Cherchez des erreurs dans les logs :
```bash
pm2 logs voisilab-backend --err --lines 100
```

### 4. Tester les formulaires

#### Formulaire de contact (dans /about)
- Endpoint : `POST /api/contacts/submit`
- Champs : `lastname`, `firstname`, `email`, `phone`, `subject`, `message`
- Test : Remplir et soumettre depuis https://fablab.voisilab.online/about

#### Formulaire de projet (dans /projet)
- Endpoint : `POST /api/project-submissions/submit`  
- Champs : `name`, `email`, `phone`, `projectType`, `budget`, `timeline`, `description`, `files[]`
- Test : Remplir et soumettre depuis https://fablab.voisilab.online/projet

### 5. Configuration Nginx (IMPORTANT)
Pour permettre les uploads jusqu'à 50MB, éditer la config Nginx :

```bash
sudo nano /etc/nginx/sites-available/api.fablab.voisilab.online
```

Ajouter dans le bloc `server {}` :
```nginx
client_max_body_size 50M;
```

Puis redémarrer Nginx :
```bash
sudo nginx -t  # Vérifier la syntaxe
sudo systemctl reload nginx
```

## 🔍 Vérification

### Sur le serveur
```bash
# Vérifier que pm2 tourne
pm2 status

# Vérifier les logs en temps réel
pm2 logs voisilab-backend
```

### Sur le frontend (console navigateur)
- Aucune erreur CORS
- Aucune erreur "Champ invalide"
- Message de succès après soumission

## 📊 Structure finale des tables

### contact_messages
- ✅ lastname, firstname, email, phone, subject, message
- ✅ ip_address, user_agent (sécurité)
- ✅ replied_by, reply_content (gestion réponses)
- ✅ status, created_at, updated_at, read_at, replied_at

### project_submissions
- ✅ name, email, phone, project_type, budget, timeline, description
- ✅ files_json (stockage métadonnées fichiers)
- ✅ ip_address, user_agent, submission_source (sécurité)
- ✅ status, reviewed_by, reviewed_at, admin_notes

### submission_files (nouvelle)
- ✅ submission_id, original_filename, stored_filename
- ✅ file_path, file_size, mime_type, file_extension
- ✅ created_at

## ⚠️ Points d'attention

1. **CORS** : Le backend accepte maintenant `localhost:3501` pour le dev (déjà configuré)
2. **Upload limits** : 50MB configuré dans Express, mais Nginx doit aussi être configuré
3. **Fichiers** : Stockés dans `uploads/confidential/projects/YYYY-MM/`
4. **Notifications** : Les admins reçoivent une notification pour chaque soumission

## 🐛 Debugging

Si les formulaires ne fonctionnent toujours pas :

1. **Vérifier les logs backend** :
   ```bash
   pm2 logs voisilab-backend --lines 200
   ```

2. **Vérifier la console navigateur** (F12) :
   - Onglet Network : voir la requête et la réponse
   - Onglet Console : voir les erreurs JavaScript

3. **Tester l'API directement** :
   ```bash
   curl -X POST https://api.fablab.voisilab.online/api/contacts/submit \
     -H "Content-Type: application/json" \
     -d '{"lastname":"Test","firstname":"User","email":"test@example.com","phone":"0123456789","subject":"Test","message":"Test message"}'
   ```

## 📝 Commandes utiles

```bash
# Redémarrer tout
pm2 restart all

# Voir les logs d'erreur uniquement
pm2 logs --err

# Vérifier l'utilisation ressources
pm2 monit

# Recharger pm2 après changement ecosystem.config.js
pm2 reload ecosystem.config.js
```

## ✅ Test final
Une fois déployé, visiter :
- https://fablab.voisilab.online/about → Formulaire de contact
- https://fablab.voisilab.online/projet → Soumission de projet

Les deux formulaires doivent fonctionner sans erreur.
