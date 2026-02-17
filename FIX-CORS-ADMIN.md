# 🔧 FIX CORS Admin Dashboard - Solution Rapide (2 min)

## ❌ Problème
```
Access to fetch at 'https://api.fablab.voisilab.online/api/auth/login' 
from origin 'https://admin.fablab.voisilab.online' has been blocked by CORS policy
```

## ⚡ Solution Ultra-Rapide (Sans redéployer le code)

### Étape 1 : Se connecter au serveur
```bash
ssh root@srv1579.hstgr.io
# ou
ssh votre_user@votre_serveur
```

### Étape 2 : Éditer le fichier .env du backend
```bash
cd ~/voisilab-app/server
nano .env
```

### Étape 3 : Modifier la ligne ALLOWED_ORIGINS
Trouver cette ligne :
```env
ALLOWED_ORIGINS=https://fablab.voisilab.online
```

Et la remplacer par :
```env
ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502
```

**Sauvegarder** : `Ctrl+O` puis `Entrée`, puis `Ctrl+X` pour quitter

### Étape 4 : Redémarrer PM2 (prend 2 secondes)
```bash
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 20
```

Vous devriez voir dans les logs :
```
CORS configuré pour: https://fablab.voisilab.online, https://admin.fablab.voisilab.online, ...
```

### Étape 5 : Tester
Retourner sur `https://admin.fablab.voisilab.online` et essayer de se connecter.

✅ **Ça devrait fonctionner immédiatement !**

---

## 🚫 Pourquoi il n'y a pas de solution frontend ?

CORS est une **sécurité du navigateur** qui empêche les sites malveillants d'accéder à vos APIs. 

Seul le serveur backend peut autoriser des origines spécifiques en envoyant le header :
```
Access-Control-Allow-Origin: https://admin.fablab.voisilab.online
```

Aucune configuration frontend ne peut contourner cela (heureusement pour la sécurité !).

---

## 📋 Une seule commande (si vous avez déjà accès SSH)

```bash
ssh root@srv1579.hstgr.io "cd ~/voisilab-app/server && \
  sed -i 's|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502|' .env && \
  pm2 restart voisilab-backend"
```

---

## ⏱️ Temps total : **2 minutes maximum**

C'est la solution la plus rapide et sûre. Pas besoin de rebuild ni de redéployer le code !
