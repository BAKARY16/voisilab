# 🚀 Redéploiement Backend (IMPORTANT)

## ⚠️ Endpoints actuellement cassés

D'après les tests :
- ❌ `/api/stats` → 500 (Table 'team' doesn't exist)
- ❌ `/api/media` → 500
- ❌ `/api/pages` → 500

✅ **12/15 endpoints fonctionnent** (Contacts, Projects, Team, Blog, Equipment, Innovations, Workshops, PPN, Notifications, Users, Services)

## 🔧 Corrections apportées localement

Les fichiers suivants ont été corrigés :
- `server/src/routes/statsRoutes.ts` : `team` → `team_members`
- `server/src/routes/projectSubmissionRoutes.ts` : `review_notes` → `admin_notes`

## 📦 Pour redéployer le backend

### 1. Commit et push (depuis Windows)
```powershell
cd server
git add -A
git commit -m "fix: Backend routes compatible schema production"
git push origin main
```

### 2. Sur le serveur Hostinger (via SSH)
```bash
cd /path/to/voisilab-app/server
git pull origin main
npm run build
pm2 restart voisilab-backend
pm2 logs voisilab-backend --lines 50
```

### 3. Vérifier
Après déploiement, testez :
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.fablab.voisilab.online/api/stats
```

Devrait retourner des stats sans erreur.

## ✅ Dashboard adapté

Le Dashboard admin a été **adapté** pour fonctionner SANS `/api/stats` :
- Récupère les données directement depuis `/api/contacts`, `/api/project-submissions`, `/api/team`
- Calcule les statistiques côté frontend
- **Fonctionne même si le backend n'est pas redéployé**

## 📝 Fichiers nettoyés

Supprimés :
- Scripts de test temporaires (test-api.js, verify-schema.js, etc.)
- Scripts de fix database (fix-users-table.js, migrate-contacts-table.js, etc.)
- Scripts de déploiement temporaires
- Documentation temporaire (BACKEND-CORRECTIONS.md, FIX-CORS.md)

Conservés :
- README.md, DEPLOIEMENT.md, PRODUCTION-URLS.md (documentation importante)
- create-production-admin.js (réutilisable)
- schema.sql, push-schema.js (base de données)
