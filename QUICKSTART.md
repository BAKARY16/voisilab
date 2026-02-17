# 🚀 Guide de Démarrage Ultra Rapide VoisiLab

## ⚡ En 3 étapes (5 minutes)

### 1️⃣ **Installer les dépendances**

```bash
npm run install:all
```

### 2️⃣ **Démarrer les services**

**Option A - Script automatique (Windows):**
```powershell
.\start-dev.ps1
```

**Option B - Script automatique (Linux/Mac):**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option C - Commande npm:**
```bash
npm run dev
```

### 3️⃣ **Accéder aux interfaces**

- 🌐 **Site Client** : http://localhost:3501
- 🎨 **Admin** : http://localhost:3502
  - Email: `admin@voisilab.ci`
  - Mot de passe: `admin123`
- ⚡ **API** : http://localhost:3500

---

## 📊 Ports et URLs

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend API | 3500 | http://localhost:3500 | API REST |
| Client | 3501 | http://localhost:3501 | Site public |
| Admin | 3502 | http://localhost:3502 | Dashboard |
| MySQL | 3306 | localhost:3306 | Base de données |
| phpMyAdmin | 8080 | http://localhost:8080 | Interface MySQL |

---

## 🔧 Commandes Utiles

### Vérifier la configuration
```powershell
.\check-config.ps1
```

### Démarrage manuel par service

```bash
# Backend API (port 3500)
cd server && npm run dev

# Client (port 3501)
cd front-end && npm run dev

# Admin (port 3502)
cd admins && npm run dev
```

### Docker

```bash
# Tout démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## 📚 Documentation Complète

- **[📖 DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Guide complet de déploiement
- **[🐳 DOCKER-README.md](DOCKER-README.md)** - Documentation Docker
- **[💾 database/README.md](database/README.md)** - Documentation BDD

---

## 🆘 Problèmes Courants

### Les ports sont déjà utilisés

```bash
# Windows - Trouver le processus
netstat -ano | findstr "3500"
netstat -ano | findstr "3501"
netstat -ano | findstr "3502"

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Erreur de connexion à MySQL

```bash
# Démarrer MySQL avec Docker
docker-compose up -d mysql

# Vérifier que MySQL est actif
docker-compose ps
```

### Problème d'authentification admin

Vérifier dans `DEBUG-CONNEXION.md` ou recréer l'admin :

```bash
docker exec -it voisilab-mysql mysql -uvoisilab_user -p
# Puis exécuter le script dans server/create-admin.js
```

---

## ✅ Checklist de Démarrage

- [ ] Node.js 18+ installé
- [ ] Docker Desktop démarré (si utilisation Docker)
- [ ] Ports 3500, 3501, 3502 disponibles
- [ ] Fichiers `.env` configurés
- [ ] Dépendances installées (`npm run install:all`)
- [ ] MySQL démarré
- [ ] Services lancés

---

## 🎯 Prochaines Étapes

1. ✅ Démarrer les services
2. 📝 Se connecter à l'admin (http://localhost:3502)
3. 🎨 Personnaliser le contenu
4. 🚀 Déployer en production

**Bonne création ! 🎉**
