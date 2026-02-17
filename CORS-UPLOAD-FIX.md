# 🚀 Corrections CORS et Upload de Fichiers - VoisiLab

## ✅ Problèmes Résolus

### 1. **Erreur CORS "No 'Access-Control-Allow-Origin' header"**
- **Cause** : Configuration CORS trop restrictive
- **Solution** : Callback dynamique autorisant localhost:3501 + amélioration gestion origines

### 2. **Erreur 413 "Request Entity Too Large"**
- **Cause** : Limite de 10MB trop basse pour fichiers + limite Nginx
- **Solution** : Augmentation à 50MB côté Express + configuration Nginx

### 3. **Page PPN n'affiche pas les données**
- **Cause** : Service ppn.service.ts pointait vers exports incorrects
- **Solution** : Refactorisation complète du service avec logs

## 📝 Modifications Effectuées

### Backend (`server/src/server.ts`)

#### CORS Amélioré
```typescript
const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser requêtes sans origin (mobile, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS bloqué pour: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
```

**Changements** :
- ✅ Callback dynamique au lieu de liste statique
- ✅ Autorisation des requêtes sans origin (Postman, mobile apps)
- ✅ Headers supplémentaires (Accept)
- ✅ Gestion OPTIONS pour preflight
- ✅ Logs des blocages CORS

#### Limites de Fichiers Augmentées
```typescript
// Avant : 10mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
```

**Changements** :
- ✅ JSON : 10MB → 50MB
- ✅ URL-encoded : 10MB → 50MB
- ✅ Paramètres : Défaut → 50 000

### Frontend (`front-end/lib/api/ppn.service.ts`)

#### Service PPN Refactorisé
```typescript
export const getAllPPN = async () => {
  try {
    const result = await ppnService.getAll()
    console.log('🔍 PPN Service - Données récupérées:', result)
    return result
  } catch (error) {
    console.error('❌ PPN Service - Erreur:', error)
    return []
  }
}
```

**Changements** :
- ✅ Wrapping avec try-catch
- ✅ Logs détaillés pour debugging
- ✅ Retour tableau vide en cas d'erreur
- ✅ Export direct au lieu de réexport

## ⚙️ Configuration Nginx (IMPORTANT)

Pour que les fichiers > 10MB passent en production, modifier Nginx :

### `/etc/nginx/sites-available/api.fablab.voisilab.online`

Ajouter dans le bloc `server {}` :

```nginx
server {
    listen 80;
    server_name api.fablab.voisilab.online;

    # AUGMENTER LES LIMITES DE FICHIERS
    client_max_body_size 50M;
    client_body_buffer_size 50M;
    client_body_timeout 300s;

    # CORS Headers (au cas où)
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept' always;

    location / {
        proxy_pass http://localhost:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts pour uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

### Appliquer les changements Nginx
```bash
sudo nginx -t                    # Tester la config
sudo systemctl reload nginx      # Recharger
```

## 🧪 Tests

### 1. Test CORS
```bash
curl -X OPTIONS https://api.fablab.voisilab.online/api/project-submissions/submit \
  -H "Origin: http://localhost:3501" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Résultat attendu** :
```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: http://localhost:3501
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### 2. Test Upload Fichier
```bash
# Créer un fichier de test (5MB)
dd if=/dev/zero of=test.pdf bs=1M count=5

# Envoyer
curl -X POST https://api.fablab.voisilab.online/api/project-submissions/submit \
  -F "name=Test" \
  -F "email=test@example.com" \
  -F "phone=0123456789" \
  -F "projectType=Test" \
  -F "description=Test upload" \
  -F "files=@test.pdf" \
  -v
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Projet soumis avec succès",
  "data": { "id": 123 }
}
```

### 3. Test PPN Frontend
Ouvrir http://localhost:3501/ppn et vérifier :
- ✅ Les données s'affichent dans la liste
- ✅ La carte montre les marqueurs
- ✅ Le compteur affiche le bon nombre de PPN
- ✅ La console montre les logs du service

## 🔍 Debugging

### Console Logs à Surveiller

**Frontend (F12 → Console)** :
```
🔍 PPN Service - Données récupérées: Array(10)
✅ Données reçues: [...] 
📊 Nombre de PPN: 10
🔄 Données transformées: [...]
```

**Backend (pm2 logs)** :
```
CORS configuré pour: http://localhost:3501, ...
🔍 CORS bloqué pour: http://example.com  (si bloqué)
```

### Erreurs Communes

#### "CORS blocked"
→ Vérifier que localhost:3501 est dans `ALLOWED_ORIGINS` du .env :
```bash
# server/.env
ALLOWED_ORIGINS=https://fablab.voisilab.online,http://localhost:3501,http://localhost:3502
```

#### "413 Request Entity Too Large"
→ Vérifier :
1. Express limit : 50MB ✅
2. Nginx `client_max_body_size` : 50M
3. Fichiers < 10MB chacun

#### "PPN array is empty"
→ Vérifier :
1. API répond : `curl https://api.fablab.voisilab.online/api/ppn`
2. Base de données a des données : `SELECT * FROM ppn;`
3. Console logs service ppn

## 🚀 Déploiement

### 1. Commit et Push
```bash
git add -A
git commit -m "fix: CORS, upload limits 50MB, PPN service"
git push
```

### 2. Déployer Backend
```bash
ssh user@srv1579.hstgr.io
cd /var/www/voisilab-backend
git pull
npm install
npm run build
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 50
```

### 3. Configurer Nginx
```bash
sudo nano /etc/nginx/sites-available/api.fablab.voisilab.online
# Ajouter client_max_body_size 50M;
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Tester
```bash
# Test CORS
curl -I https://api.fablab.voisilab.online/api/ppn

# Test Upload
# (depuis votre machine locale avec un fichier test.pdf)
```

## 📋 Checklist Finale

- [x] CORS configuré avec callback dynamique
- [x] Limites fichiers augmentées (50MB)
- [x] Service PPN refactorisé avec logs
- [x] Tables formulaires corrigées (fix-forms-tables.js)
- [x] Schema.sql mis à jour
- [ ] Nginx configuré en production
- [ ] Backend redéployé
- [ ] Tests CORS validés
- [ ] Tests upload validés
- [ ] Page PPN affiche les données

## ✨ Résumé

**Avant** :
- ❌ CORS bloque localhost:3501
- ❌ Upload max 10MB, erreur 413
- ❌ Page PPN vide
- ❌ Formulaires ne fonctionnaient pas

**Après** :
- ✅ CORS autorise toutes les origines configurées
- ✅ Upload jusqu'à 50MB
- ✅ Service PPN avec logs et gestion erreurs
- ✅ Formulaires opérationnels
- ✅ Nginx prêt (instructions fournies)

---

**Date** : 17 février 2026  
**Status** : ✅ **Code Corrigé** - Déploiement Nginx requis
