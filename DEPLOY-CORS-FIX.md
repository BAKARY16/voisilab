# 🚀 DÉPLOIEMENT RAPIDE - SOLUTION CORS ADMIN

## ⚡ Solution 1 : Modification manuelle (2 minutes)

### Sur le serveur (SSH)
```bash
# Se connecter au serveur
ssh root@srv1579.hstgr.io  # ou votre user

# Éditer le .env
cd ~/voisilab-app/server
nano .env
```

**Modifier/Ajouter cette ligne :**
```env
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502
```

**Sauvegarder** : `Ctrl+O` → `Entrée` → `Ctrl+X`

```bash
# Redémarrer
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 20
```

✅ **Terminé !** Tester sur https://admin.fablab.voisilab.online

---

## ⚡ Solution 2 : Script automatique

### Sur le serveur (SSH)
```bash
# Se connecter
ssh root@srv1579.hstgr.io

# Télécharger et exécuter le script
cd ~/voisilab-app
git pull origin main
bash deploy-backend-cors-fix.sh
```

Le script fait tout automatiquement :
- ✅ Backup du .env
- ✅ Mise à jour ALLOWED_ORIGINS
- ✅ Redémarrage PM2
- ✅ Affichage des logs

---

## ⚡ Solution 3 : Une seule commande SSH

Depuis votre machine locale :

```bash
ssh root@srv1579.hstgr.io "cd ~/voisilab-app/server && \
  cp .env .env.backup.\$(date +%Y%m%d_%H%M%S) && \
  sed -i '/^ALLOWED_ORIGINS=/d' .env && \
  echo 'ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502' >> .env && \
  pm2 restart voisilab-backend && \
  pm2 logs voisilab-backend --lines 20 --nostream"
```

Copier-coller cette commande → Appuyer sur Entrée → C'est fait !

---

## 🧪 Vérification

### Test CORS
```bash
curl -I -X OPTIONS https://api.fablab.voisilab.online/api/auth/login \
  -H "Origin: https://admin.fablab.voisilab.online" \
  -H "Access-Control-Request-Method: POST"
```

**Réponse attendue** :
```
HTTP/2 204
access-control-allow-origin: https://admin.fablab.voisilab.online
access-control-allow-methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
access-control-allow-credentials: true
```

### Test manuel
1. Visiter https://admin.fablab.voisilab.online
2. Ouvrir la console (F12)
3. Se connecter
4. ✅ Aucune erreur CORS !

---

## 🔄 Déploiement complet (optionnel)

Si vous voulez aussi déployer les dernières modifications du code :

```bash
ssh root@srv1579.hstgr.io

cd ~/voisilab-app
git pull origin main

cd server
npm install
npm run build
pm2 restart voisilab-backend
pm2 logs voisilab-backend
```

---

## 📋 Checklist finale

- [ ] .env mis à jour avec ALLOWED_ORIGINS
- [ ] pm2 restart voisilab-backend exécuté
- [ ] Logs vérifiés (message "CORS configuré pour...")
- [ ] Test connexion admin OK
- [ ] Test formulaire contact OK (/about)
- [ ] Test formulaire projet OK (/projet)
- [ ] Console navigateur sans erreur CORS

---

## ⚠️ En cas de problème

### Restaurer le backup
```bash
cd ~/voisilab-app/server
ls -lt .env.backup.*  # Voir les backups
cp .env.backup.XXXXXXXX .env  # Restaurer
pm2 restart voisilab-backend
```

### Vérifier les logs
```bash
pm2 logs voisilab-backend --lines 100
pm2 logs voisilab-backend --err  # Erreurs uniquement
```

### Vérifier PM2
```bash
pm2 status
pm2 monit
pm2 describe voisilab-backend
```

---

## 🎯 Temps total : 2-5 minutes max

**Recommandation** : Utilisez la **Solution 1** (manuelle) pour plus de contrôle, ou la **Solution 3** (une commande) pour la rapidité.
