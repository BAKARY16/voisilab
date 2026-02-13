# Guide de Tests - Plateforme Admin VoisiLab

## 📍 URLs
- **Backend**: http://localhost:5000 ✅ (Healthy - MySQL connecté)
- **Admin**: http://localhost:3001 ✅ (Démarré)
- **Front-end**: http://localhost:3000

---

## 🔐 Test 1: Authentification & Session

### Test 1.1: Login Initial
**URL**: http://localhost:3001/login

**Credentials de test**:
- Email: `admin@voisilab.fr`
- Password: `admin123`

**Étapes**:
1. Ouvrir http://localhost:3001
2. Vérifier redirection vers /login (car non authentifié)
3. Entrer credentials de test
4. Cliquer "Se connecter"

**Résultats attendus**:
- ✅ Redirection vers /dashboard/default
- ✅ Token stocké dans localStorage (clé: "token")
- ✅ User stocké dans localStorage (clé: "user")
- ✅ Pas d'erreur console
- ✅ Menu sidebar visible

**Vérification localStorage**:
```javascript
// Ouvrir DevTools > Console
localStorage.getItem('token')  // Doit retourner un token JWT
localStorage.getItem('user')   // Doit retourner {"id":..., "email":..., "role":"admin"}
```

---

### Test 1.2: Persistance de Session
**Étapes**:
1. Une fois connecté, rafraîchir la page (F5)
2. Fermer l'onglet et rouvrir http://localhost:3001

**Résultats attendus**:
- ✅ Reste connecté après rafraîchissement
- ✅ Reste connecté après réouverture (tant que localStorage n'est pas effacé)
- ✅ Pas de redirection vers /login

---

### Test 1.3: Protection des Routes
**Étapes**:
1. Se déconnecter (dans le menu Profil > Logout - si disponible)
   OU effacer localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Essayer d'accéder directement à: http://localhost:3001/dashboard/default

**Résultats attendus**:
- ✅ Redirection automatique vers /login
- ✅ Après connexion, retour à la page demandée

---

### Test 1.4: Validation Formulaire Login
**Étapes**:
1. Tenter de se connecter avec :
   - Email vide → Erreur "Email requis"
   - Email invalide (`test`) → Erreur "Email invalide"
   - Password vide → Erreur "Mot de passe requis"
   - Mauvais credentials → Erreur du serveur

**Résultats attendus**:
- ✅ Messages d'erreur appropriés
- ✅ Pas de soumission si validation échoue

---

## 📝 Test 2: CRUD - Blog

**URL**: http://localhost:3001/blog

### Test 2.1: Chargement Liste
**Étapes**:
1. Naviguer vers Blog
2. Vérifier requête API dans Network tab

**Résultats attendus**:
- ✅ Requête GET vers `/api/blog`
- ✅ Header `Authorization: Bearer <token>`
- ✅ Liste des articles affichée (ou message "Aucun article")
- ✅ Pas d'erreur 401/403

### Test 2.2: Créer Article
**Étapes**:
1. Cliquer "Nouvel article"
2. Remplir :
   - Titre: "Test Article"
   - Slug: Auto-généré à partir du titre
   - Extrait: "Ceci est un test"
   - Contenu: "Contenu de test"
   - Statut: "Brouillon"
3. Cliquer "Enregistrer"

**Résultats attendus**:
- ✅ Requête POST vers `/api/blog`
- ✅ Article créé dans la base
- ✅ Liste rafraîchie
- ✅ Nouvel article visible

### Test 2.3: Modifier Article
**Étapes**:
1. Cliquer icône "Modifier" sur un article
2. Changer le titre
3. Enregistrer

**Résultats attendus**:
- ✅ Requête PUT/PATCH vers `/api/blog/:id`
- ✅ Modifications sauvegardées
- ✅ Liste mise à jour

### Test 2.4: Supprimer Article
**Étapes**:
1. Cliquer icône "Supprimer"
2. Confirmer suppression

**Résultats attendus**:
- ✅ Modal de confirmation
- ✅ Requête DELETE vers `/api/blog/:id`
- ✅ Article retiré de la liste

---

## 📋 Test 3: CRUD - Projets

**URL**: http://localhost:3001/projects

### Test 3.1: Liste Projets
**Résultats attendus**:
- ✅ GET `/api/projects`
- ✅ Affichage statut (pending, approved, rejected)
- ✅ Boutons Approuver/Rejeter pour projets "pending"

### Test 3.2: Approuver Projet
**Étapes**:
1. Cliquer icône ✓ (Approuver)

**Résultats attendus**:
- ✅ Requête PATCH/PUT vers `/api/projects/:id/status`
- ✅ Body: `{"status": "approved"}`
- ✅ Statut mis à jour dans la liste

### Test 3.3: Rejeter Projet
**Résultats attendus** (similaire à approuver):
- ✅ Status = "rejected"

---

## 👥 Test 4: CRUD - Équipe

**URL**: http://localhost:3001/team

### Tests à effectuer:
- ✅ GET `/api/team` - Liste membres
- ✅ POST `/api/team` - Créer membre
- ✅ PUT `/api/team/:id` - Modifier
- ✅ DELETE `/api/team/:id` - Supprimer

**Champs requis**:
- name
- role
- email (optionnel)
- bio (optionnel)

---

## 📧 Test 5: Messages de Contact

**URL**: http://localhost:3001/contacts

### Tests à effectuer:
- ✅ GET `/api/contacts` - Liste messages
- ✅ SELECT pour changer statut (unread → read → replied → archived)
- ✅ Requête UPDATE lors du changement de statut
- ✅ DELETE message

---

## 📍 Test 6: Points PPN

**URL**: http://localhost:3001/ppn

### Tests à effectuer:
- ✅ GET `/api/ppn` - Liste localisations
- ✅ POST `/api/ppn` - Créer point
- ✅ PUT `/api/ppn/:id` - Modifier
- ✅ DELETE `/api/ppn/:id` - Supprimer

**Champs requis**:
- name
- address
- city
- latitude, longitude (pour carte)
- status (active/inactive/maintenance)

---

## 🎓 Test 7: Ateliers

**URL**: http://localhost:3001/workshops

### Tests à effectuer:
- ✅ GET `/api/workshops`
- ✅ POST - Créer atelier avec date
- ✅ PUT - Modifier
- ✅ DELETE
- ✅ Statuts: upcoming, ongoing, completed, cancelled

---

## 🛠️ Test 8: Équipements

**URL**: http://localhost:3001/equipment

### Tests à effectuer:
- ✅ GET `/api/equipment`
- ✅ CRUD complet
- ✅ Statuts: available, in_use, maintenance, unavailable

---

## 🖼️ Test 9: Médiathèque

**URL**: http://localhost:3001/media

### Tests à effectuer:
- ✅ GET `/api/media`
- ✅ POST - Upload média (pour l'instant URL seulement)
- ✅ DELETE
- ✅ Grid layout avec images

---

## 📄 Test 10: Gestion Pages CMS

**URL**: http://localhost:3001/pages

### Tests à effectuer:
- ✅ Tabs pour différentes pages (home, about, services, etc.)
- ✅ GET `/api/pages` filtré par page_name
- ✅ POST section
- ✅ JSON editor pour contenu

---

## 👤 Test 11: Utilisateurs

**URL**: http://localhost:3001/users

### Tests à effectuer:
- ✅ GET `/api/users`
- ✅ POST - Créer utilisateur (email, password, role)
- ✅ PUT - Modifier (password optionnel)
- ✅ SELECT inline pour changer rôle (user ↔ admin)
- ✅ DELETE

---

## 🎨 Test 12: Services

**URL**: http://localhost:3001/services

### Tests à effectuer:
- ✅ GET `/api/services`
- ✅ CRUD complet
- ✅ Ordre personnalisable (order_index)

---

## ⚙️ Test 13: Paramètres

**URL**: http://localhost:3001/settings

### Tests à effectuer:
- ✅ GET `/api/settings`
- ✅ POST/PUT paramètres clé-valeur
- ✅ Support JSON dans valeur
- ✅ Catégories: general, email, social, seo, advanced

---

## 👤 Test 14: Profil Utilisateur

**URL**: http://localhost:3001/profile

### Tests à effectuer:
- ✅ Affichage infos utilisateur depuis localStorage
- ✅ Modifier nom, email
- ✅ Changer mot de passe
- ✅ Validation (passwords match, min 6 chars)

---

## 🔔 Test 15: Notifications

**URL**: http://localhost:3001/notifications

### Tests à effectuer:
- ✅ GET `/api/notifications`
- ✅ Marquer comme lu (requête PATCH)
- ✅ Tout marquer comme lu
- ✅ DELETE notification
- ✅ Badge avec count non lues

---

## 🌐 Test 16: Vérifications Réseau

**Dans DevTools > Network pour chaque requête** :

### Headers à vérifier:
```
Request Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Response Headers:
  Content-Type: application/json
  Status: 200 OK (ou 201 Created)
```

### Erreurs à gérer:
- ✅ 401 Unauthorized → Redirection login
- ✅ 403 Forbidden → Message d'erreur
- ✅ 404 Not Found → Message approprié
- ✅ 500 Server Error → Message générique
- ✅ Network Error → "Erreur de connexion"

---

## 📊 Test 17: Dashboard

**URL**: http://localhost:3001/dashboard/default

### Tests à effectuer:
- ✅ Cartes statistiques affichées
- ✅ Graphiques chargés
- ✅ Données en temps réel depuis API

---

## ✅ Checklist Rapide

Pour chaque page VoisiLab:

**Formulaires**:
- [ ] Validation client-side fonctionne
- [ ] Messages d'erreur clairs
- [ ] Indicateur de soumission (spinner/disabled button)
- [ ] Réinitialisation après succès

**API Calls**:
- [ ] Token envoyé dans Authorization header
- [ ] Gestion d'erreurs (try/catch)
- [ ] Feedback utilisateur (success/error alerts)
- [ ] Rechargement données après mutation

**UX**:
- [ ] Confirmations avant suppression
- [ ] Fermeture modals après succès
- [ ] Tableaux triables/filtrables
- [ ] Pagination si beaucoup de données

---

## 🔍 Tests Console

**Commandes utiles dans DevTools Console**:

```javascript
// Vérifier token
localStorage.getItem('token')

// Vérifier user
JSON.parse(localStorage.getItem('user'))

// Simuler déconnexion
localStorage.clear()
location.reload()

// Tester authService
import('api/voisilab').then(m => console.log(m.authService.isAuthenticated()))
```

---

## 🐛 Problèmes Connus à Vérifier

1. **CORS**: Si erreurs CORS, vérifier backend autorise bien ports 3001, 5173, 5174, 5175
2. **Token expiration**: Actuellement pas de refresh token
3. **Validation**: Certains champs peuvent manquer de validation côté serveur
4. **Upload**: Médias utilisent URL pour l'instant (pas de vrai upload)

---

## 🎯 Résultats Attendus Globaux

**Après tous les tests**:
- ✅ Connexion + persistance session OK
- ✅ CRUD fonctionne sur toutes les pages
- ✅ API calls avec Authorization header
- ✅ Pas d'erreurs 401/403 quand connecté
- ✅ Messages d'erreur appropriés
- ✅ Formulaires validés
- ✅ Interface réactive et professionnelle

---

## 📝 Notes de Test

**À remplir pendant les tests**:

| Page | GET | POST | PUT | DELETE | Problèmes |
|------|-----|------|-----|--------|-----------|
| Blog | ☐ | ☐ | ☐ | ☐ |  |
| Projets | ☐ | ☐ | ☐ | ☐ |  |
| Équipe | ☐ | ☐ | ☐ | ☐ |  |
| Contacts | ☐ | ☐ | ☐ | ☐ |  |
| PPN | ☐ | ☐ | ☐ | ☐ |  |
| Ateliers | ☐ | ☐ | ☐ | ☐ |  |
| Équipements | ☐ | ☐ | ☐ | ☐ |  |
| Médias | ☐ | ☐ | ☐ | ☐ |  |
| Pages | ☐ | ☐ | ☐ | ☐ |  |
| Utilisateurs | ☐ | ☐ | ☐ | ☐ |  |
| Services | ☐ | ☐ | ☐ | ☐ |  |
| Paramètres | ☐ | ☐ | ☐ | ☐ |  |
| Notifications | ☐ | ☐ | ☐ | ☐ |  |

---

**IMPORTANT**: Ouvre http://localhost:3001 et commence les tests !

Le backend est déjà en marche sur http://localhost:5000 ✅
