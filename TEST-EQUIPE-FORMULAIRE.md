# 🧪 Test Formulaire Ajout Équipe - VoisiLab Admin

## 📋 Pré-requis

**Serveurs démarrés** :
- ✅ Backend: http://localhost:5000
- ✅ Admin: http://localhost:3001
- ✅ Base de données MySQL avec table `team`

## 🎯 Objectif du Test

Tester le formulaire d'ajout de membre d'équipe selon la maquette fournie avec les 3 sous-onglets :
1. **Aperçu** - Prévisualisation de la page équipe côté utilisateur
2. **Gérer l'équipe** - Tableau avec liste des membres
3. **Ajouter un membre** - Formulaire détaillé selon la maquette

---

## 🔐 Étape 1 : Connexion Admin

1. Ouvrir http://localhost:3001
2. Se connecter avec :
   - Email: `admin@voisilab.fr`
   - Password: `admin123`

---

## 📊 Étape 2 : Accéder à Équipe

1. Dans le menu latéral, cliquer sur **"Équipe"** (sous Organisation)
2. Vérifier que les **3 onglets** sont bien visibles :
   - Aperçu
   - Gérer l'équipe
   - Ajouter un membre

---

## 👁️ Étape 3 : Onglet "Aperçu"

**Ce qu'on doit voir** :
- Titre "Notre Équipe" centré
- Cards avec les 3 membres de test :
  - Jean-Luc Kouassi (Professeur Titulaire)
  - Marie Diabaté (Directrice Administrative)
  - Amadou Traoré (Technicien FabLab)
- Chaque card affiche : Avatar, Nom, Titre, Département, Bio

**À vérifier** :
- ✅ Seuls les membres avec `is_active = true` sont affichés
- ✅ Layout en grille responsive
- ✅ Design épuré et professionnel

---

## 📋 Étape 4 : Onglet "Gérer l'équipe"

**Ce qu'on doit voir** :
- Bouton **"Nouveau membre"** en haut
- Tableau avec colonnes :
  - Photo
  - Nom
  - Titre
  - Département
  - Ordre
  - Statut
  - Actions (Modifier/Supprimer)
- Les 3 membres de test dans le tableau

**Tests à faire** :
1. ✅ Cliquer sur icône **Modifier** (crayon)
   - Doit basculer vers l'onglet "Modifier le membre"
   - Le formulaire doit se pré-remplir avec les données du membre

2. ✅ Cliquer sur icône **Supprimer** (poubelle)
   - Doit afficher une confirmation
   - Après confirmation, le membre doit disparaître du tableau

3. ✅ Cliquer sur **"Nouveau membre"**
   - Doit basculer vers l'onglet "Ajouter un membre"
   - Le formulaire doit être vide

---

## ✍️ Étape 5 : Onglet "Ajouter un membre" (PRINCIPAL)

### 🎨 Vérification du Design (selon maquette)

**Layout général** :
- ✅ Titre "Ajouter un Membre de l'Équipe"
- ✅Section "Photo de Profil" avec zone de drop
- ✅ Formulaire en 2 colonnes :
  - Gauche (70%) : Informations personnelles + Contact
  - Droite (30%) : Paramètres + Conseil Admin

### 📸 Section "Photo de Profil"

**Éléments à vérifier** :
- ✅ Zone pointillée pour upload
- ✅ Icône upload au centre
- ✅ Texte "Télécharger la photo (400x400px)"
- ✅ Champ texte "Ou entrez l'URL de la photo"
- ✅ Preview de l'avatar quand URL est entrée

**Test** :
```
URL de test : https://i.pravatar.cc/400?img=12
```
Entrer cette URL → L'avatar doit s'afficher

---

### 👤 Section "Informations Personnelles"

**Champs obligatoires** :
1. **Prénom** : "Ex: Jean-Luc"
2. **Nom** : "Ex: Kouassi"
3. **Titre** : "Ex: Professeur Titulaire"

**Champs optionnels** :
4. **Département** : Select avec options
   - Aucun
   - Génie Informatique
   - Administration
   - Technique
   - Recherche
   - Direction

5. **Biographie simplifiée** : Textarea (4 lignes)

**Tests** :
- ✅ Entrer "Test" dans Prénom → Doit accepter
- ✅ Laisser Nom vide → Formulaire ne doit pas se soumettre
- ✅ Sélectionner un département → Doit s'afficher dans le select
- ✅ Taper une longue bio → Doit tenir dans la textarea

---

### 📧 Section "Contact & Réseaux Sociaux"

**Champs** :
1. **Email Académique** : `j.kouassi@univ-ivoire.ci`
2. **LinkedIn** : `https://linkedin.com/in/...`
3. **X / Twitter** : `https://x.com/...`

**Tests de validation** :
- ✅ Email invalide (`test`) → Doit montrer erreur
- ✅ Email valide → Doit accepter
- ✅ URLs réseaux sociaux sont optionnelles

---

### ⚙️ Section "Paramètres"

**1. Ordre d'affichage**
- Field numérique
- Hint: "Définit la position dans la liste (0 en premier)"
- Valeur par défaut: 0

**Tests** :
- ✅ Entrer `-5` → Doit accepter ou bloquer?
- ✅ Entrer `999` → Doit accepter
- ✅ Laisser vide → Doit defaulter à 0

**2. Statut Actif**
- Switch toggle
- Label "Visible sur le site public"
- Activé par défaut

**Tests** :
- ✅ Cliquer sur switch → Doit basculer ON/OFF
- ✅ Nouveau membre avec statut OFF → Ne doit PAS apparaître dans l'aperçu

**3. Boutons**
- **"Enregistrer le Profil"** (bleu, primaire)
- **"Annuler"** (blanc, outlined)

**Tests** :
- ✅ Clic "Annuler" → Retour à l'onglet "Gérer l'équipe"
- ✅ Clic "Enregistrer" sans remplir champs requis → Erreur
- ✅ Clic "Enregistrer" avec données valides → Succès

**4. Conseil Admin**
- Card bleue avec icône
- Texte explicatif sur l'email académique

---

## 🧪 Test Complet : Ajouter un nouveau membre

### Données de test

```
Photo : https://i.pravatar.cc/400?img=15
Prénom : Sophie
Nom : Koné
Titre : Chargée de Communication
Département : Administration
Bio : Responsable de la communication digitale et des événements du FabLab depuis 2023.
Email : s.kone@voisilab.fr
LinkedIn : https://linkedin.com/in/sophie-kone
Twitter : https://x.com/sophie_voisilab
Ordre : 3
Statut : Actif (ON)
```

### Procédure

1. Cliquer sur onglet **"Ajouter un membre"**
2. Remplir tous les champs avec les données ci-dessus
3. Vérifier que la photo preview s'affiche
4. Cliquer **"Enregistrer le Profil"**

### Résultats attendus

**✅ Message de succès** :
- Alert vert "Profil enregistré avec succès!"
- Disparaît après 2 secondes

**✅ Redirection automatique** :
- Retour à l'onglet "Gérer l'équipe"

**✅ Nouveau membre dans le tableau** :
- Sophie Koné doit apparaître dans la liste
- Ordre d'affichage = 3

**✅ Aperçu mis à jour** :
- Onglet "Aperçu" doit montrer 4 membres (incluant Sophie)

---

## 🔄 Test CRUD Complet

### ✏️ Modification

1. Dans "Gérer l'équipe", cliquer **Modifier** sur Sophie Koné
2. Changer Titre → "Responsable Communication"
3. Changer Ordre → 1
4. Cliquer **"Enregistrer le Profil"**

**Résultat attendu** :
- Sophie doit maintenant être en position 1 (avant Jean-Luc)
- Son titre doit être mis à jour

### 🗑️ Suppression

1. Dans "Gérer l'équipe", cliquer **Supprimer** sur Sophie Koné
2. Confirmer la suppression

**Résultat attendu** :
- Sophie disparaît du tableau
- L'aperçu ne montre plus que 3 membres

---

## 🐛 Debug Console

**Ouvrir DevTools (F12) > Console**

### Requêtes API à vérifier

**Au chargement de la page** :
```
GET http://localhost:5000/api/team
Authorization: Bearer <token>
→ Status: 200
→ Response: { success: true, data: [array of members] }
```

**À la création** :
```
POST http://localhost:5000/api/team
Authorization: Bearer <token>
Body: { first_name, last_name, title, ... }
→ Status: 201
→ Response: { success: true, data: {new member} }
```

**À la modification** :
```
PUT http://localhost:5000/api/team/4
Authorization: Bearer <token>
Body: { title: "Responsable Communication", ... }
→ Status: 200
→ Response: { success: true, data: {updated member} }
```

**À la suppression** :
```
DELETE http://localhost:5000/api/team/4
Authorization: Bearer <token>
→ Status: 200
→ Response: { success: true, message: "Supprimé" }
```

---

## ❌ Problèmes Connus & Solutions

### Problème 1 : Tableau vide
**Symptôme** : "Aucun membre" affiché
**Cause possible** : Token invalide ou expiré
**Solution** :
1. Se déconnecter
2. Effacer localStorage (F12 > Application > Local Storage)
3. Se reconnecter

### Problème 2 : Erreur 401 Unauthorized
**Symptôme** : `{"error":"Authentification requise"}`
**Cause** : Token manquant ou invalide
**Solution** :
```javascript
// Dans Console
localStorage.getItem('token')  // Doit retourner un JWT
```
Si null, se reconnecter.

### Problème 3 : Preview photo ne s'affiche pas
**Symptôme** : Avatar reste vide après entrée URL
**Cause** : URL invalide ou CORS
**Solution** : Utiliser une URL publique compatible CORS
Exemple : `https://i.pravatar.cc/400?img=15`

### Problème 4 : Formulaire ne se soumet pas
**Symptôme** : Clic sur "Enregistrer" sans effet
**Vérifier** :
1. Console pour erreurs JS
2. Champs requis remplis (Prénom, Nom, Titre)
3. Network tab pour voir si requête part

---

## ✅ Checklist Finale

**Design & UX** :
- [ ] Les 3 onglets sont visibles et cliquables
- [ ] Layout 2 colonnes dans le formulaire (70/30)
- [ ] Photo preview fonctionne
- [ ] Tous les champs sont présents selon maquette
- [ ] Messages d'erreur clairs
- [ ] Message de succès s'affiche

**Fonctionnalités** :
- [ ] **CREATE** : Ajouter un nouveau membre fonctionne
- [ ] **READ** : Aperçu affiche les membres actifs
- [ ] **READ** : Tableau affiche tous les membres
- [ ] **UPDATE** : Modifier un membre fonctionne
- [ ] **DELETE** : Supprimer un membre fonctionne

**API** :
- [ ] GET `/api/team` retourne les données
- [ ] POST `/api/team` crée un membre
- [ ] PUT `/api/team/:id` met à jour
- [ ] DELETE `/api/team/:id` supprime
- [ ] Token JWT envoyé dans headers

**Base de données** :
- [ ] Table `team` existe
- [ ] Données insérées persistent
- [ ] Champs correspondent au modèle

---

## 🎯 Résultat attendu final

Après tous les tests, l'onglet Équipe doit permettre de :
1. ✅ Visualiser l'équipe comme sur le site public
2. ✅ Gérer tous les membres dans un tableau
3. ✅ Ajouter/Modifier/Supprimer des membres facilement
4. ✅ Formulaire complet et professionnel selon la maquette
5. ✅ Données synchronisées avec MySQL en temps réel

---

**Prêt pour le test ! 🚀**

Ouvre http://localhost:3001 et commence par la connexion.
