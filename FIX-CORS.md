# 🔧 GUIDE RAPIDE: Correction CORS Serveur

## ❌ Problème
```
Access to fetch at 'https://api.fablab.voisilab.online/api/auth/login' 
from origin 'https://admin.fablab.voisilab.online' has been blocked by CORS policy
```

## ✅ Solution

### Sur le serveur (SSH):

```bash
# 1. Se connecter
ssh jean1@69.62.106.191

# 2. Aller dans le dossier server
cd ~/voisilab/server

# 3. Récupérer les dernières modifications
git pull

# 4. Vérifier le fichier .env
cat .env | grep ALLOWED_ORIGINS

# Si ALLOWED_ORIGINS n'existe pas ou est incorrect, l'ajouter/modifier:
nano .env
```

### Ajouter/Modifier cette ligne dans `.env`:

```env
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online
```

### Ou utiliser le script automatique:

```bash
# Option automatique (recommandé)
chmod +x fix-cors.sh
./fix-cors.sh
```

### Puis rebuild et redémarrer:

```bash
# Build le backend (important pour appliquer les changements)
npm run build

# Redémarrer PM2
pm2 restart voisilab-api

# Vérifier les logs
pm2 logs voisilab-api --lines 50
```

## 🔍 Vérification

Une fois redémarré, vous devriez voir dans les logs:
```
CORS configuré pour: https://fablab.voisilab.online, https://admin.fablab.voisilab.online, ...
```

Puis testez la connexion admin à nouveau!

## 📝 Fichiers modifiés

- `server/.env` - Ajout/mise à jour de ALLOWED_ORIGINS
- `server/src/server.ts` - Configuration CORS améliorée
- Les changements doivent être buildés avec `npm run build`

---

**Temps estimé:** 2-3 minutes
