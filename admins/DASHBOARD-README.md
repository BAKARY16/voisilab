# Dashboard VoisiLab - Configuration et Statistiques

## ✅ Ce qui a été implémenté

### 1. Backend - Routes Statistiques (`server/src/routes/statsRoutes.ts`)

#### Endpoint principal: `GET /api/stats`
Retourne les statistiques complètes du dashboard:

**Structure de réponse:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "contacts": {
        "total": 6,
        "unread": 3,
        "today": 1,
        "thisWeek": 4,
        "trend": 33.3  // % changement vs semaine précédente
      },
      "projects": {
        "total": 6,
        "pending": 3,
        "approved": 1,
        "reviewing": 2,
        "today": 1,
        "thisWeek": 4,
        "trend": 25.0
      },
      "team": {
        "total": 3,
        "active": 3,
        "inactive": 0
      },
      "workshops": {
        "total": 0,
        "upcoming": 0,
        "ongoing": 0,
        "completed": 0
      }
    },
    "recent": {
      "contacts": [...],  // 5 derniers messages
      "projects": [...]   // 5 dernières soumissions
    },
    "monthlyActivity": [...]  // 12 derniers mois
  }
}
```

#### Endpoint secondaire: `GET /api/stats/period/:period`
Paramètres: `day`, `week`, `month`, `year`

### 2. Frontend Admin - Service API (`admins/src/api/voisilab.js`)

Nouveau service ajouté:
```javascript
export const statsService = {
  async getDashboard() {
    // Récupère toutes les stats du dashboard
  },
  async getByPeriod(period) {
    // Récupère stats par période
  }
};
```

### 3. Frontend Admin - Nouveau Dashboard (`admins/src/pages/dashboard/default.jsx`)

#### Composants du dashboard:

1. **4 cartes statistiques principales** (Row 1):
   - Messages de Contact (total + non lus)
   - Soumissions de Projet (total + en attente)
   - Projets Approuvés (+ en cours de revue)
   - Membres de l'Équipe (actifs + total)

2. **Activité de la semaine** (Row 2):
   - Messages reçus cette semaine + tendance (%)
   - Projets soumis cette semaine + tendance (%)
   - Messages d'aujourd'hui
   - Projets d'aujourd'hui

3. **Listes des activités récentes** (Row 3):
   - **Messages de Contact Récents**: 5 derniers avec statut (non lu/lu/répondu)
   - **Soumissions de Projet Récentes**: 5 dernières avec statut (pending/reviewing/approved)
   - Cliquable pour accéder à la page détaillée

4. **Actions Rapides** (Row 4):
   4 cartes cliquables avec hover effect:
   - Messages non lus → `/voisilab/contacts`
   - Projets en attente → `/voisilab/contacts` (onglet projets)
   - Projets en revue → `/voisilab/contacts` (onglet projets)
   - Membres actifs → `/voisilab/team`

5. **Carte de bienvenue** (Row 5):
   Message d'introduction pour l'administrateur

## 🎨 Design

### Philosophie
- **Clean & Minimaliste**: Design épuré sans éléments extravagants
- **Professional**: Adapté à un environnement professionnel (FabLab)
- **Fonctionnel**: Chaque élément a un but précis
- **Navigation intuitive**: Clics directs vers les sections pertinentes

### Palette de couleurs (Material-UI)
- **Primary**: Bleu (branding VoisiLab)
- **Warning**: Orange (alertes, éléments en attente)
- **Success**: Vert (validations, approbations)
- **Error**: Rouge (messages non lus, urgences)
- **Info**: Bleu clair (informations)

### Interactions
- **Hover effects**: Transformation légère (-4px) sur les cartes d'action rapide
- **Chips colorés**: Statuts visuellement distincts
- **Loading state**: LinearProgress pendant le chargement
- **Error state**: Message clair en cas d'échec

## 📊 Calculs statistiques

### Tendances (trend)
```
trend = ((cette_semaine - semaine_précédente) / semaine_précédente) * 100
```
- Positif = croissance (vert)
- Négatif = baisse (rouge)

### Périodes
- **Aujourd'hui**: `DATE(created_at) = CURDATE()`
- **Cette semaine**: `DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
- **Semaine précédente**: Entre 14 et 7 jours

## 🔧 Configuration requise

### Server
1. Route montée dans `server.ts`:
   ```typescript
   import statsRoutes from './routes/statsRoutes';
   app.use('/api/stats', statsRoutes);
   ```

2. Dépendances: Déjà installées (mysql2, express)

### Admin
1. Service importé dans le dashboard
2. Navigation configurée vers pages existantes
3. Aucune dépendance supplémentaire

## 🚀 Pour démarrer

1. **Redémarrer le serveur backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Tester l'endpoint**:
   ```bash
   curl http://localhost:5000/api/stats
   ```

3. **Démarrer l'admin** (si pas déjà fait):
   ```bash
   cd admins
   npm run dev
   ```

4. **Accéder au dashboard**:
   - URL: `http://localhost:3001/dashboard/default`
   - Login: `admin@voisilab.fr` / `admin123`

## 📈 Données de test

Actuellement dans la base:
- **6 messages de contact** (3 non lus)
- **6 soumissions de projet** (3 pending, 2 reviewing, 1 approved)
- **3 membres d'équipe** (tous actifs)

Script pour ajouter plus de données de test si besoin:
```sql
-- Voir database/contacts-submissions-schema.sql
```

## 🔍 Debugging

Si l'endpoint `/api/stats` retourne 404:
1. Vérifier que `server/src/routes/statsRoutes.ts` existe
2. Vérifier l'import dans `server/src/server.ts`
3. Redémarrer le serveur
4. Vérifier les logs: `Failed to load resource` = serveur non démarré

Si le dashboard affiche "Erreur de chargement":
1. Ouvrir DevTools (F12) → Console
2. Vérifier l'erreur réseau
3. S'assurer que le backend tourne sur port 5000
4. Vérifier CORS dans `server.ts` (déjà configuré)

## 📝 Notes

- Backend protégé par authentication (JWT token)
- Toutes les routes stats nécessitent `authenticate` + `requireAdmin`
- Les données sont en temps réel (pas de cache)
- Format de dates: ISO 8601 (UTC)
- Les pourcentages sont arrondis à 1 décimale

## 🎯 Prochaines étapes possibles

1. Ajouter graphiques (Chart.js ou Recharts)
2. Exporter statistiques en CSV/Excel
3. Filtres par période (jour/semaine/mois)
4. Notifications temps réel (WebSocket)
5. Comparaisons année N vs année N-1
