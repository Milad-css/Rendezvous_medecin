# Gestion des Secrétaires

## Vue d'ensemble

La secrétaire est liée à un médecin spécifique. Elle a accès à l'ensemble des rendez-vous du cabinet, peut confirmer ou annuler des rendez-vous, consulter la liste des patients et gérer le planning.

---

## Modèle de données

**Table** : `secretaires`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `user_id` | bigint FK | Référence vers `users` |
| `medecin_id` | bigint FK | Référence vers `medecins` |
| `created_at` | timestamp | Date de création |
| `updated_at` | timestamp | Date de mise à jour |

**Relations** :
- `belongsTo(User)` — nom, prénom, email
- `belongsTo(Medecin)` — médecin associé

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/Secretaire.php`

---

## Endpoints

### Créer un profil secrétaire (public)

```
POST /api/secretaire/creer
```

**Corps de la requête**

```json
{
  "user_id": 3,
  "medecin_id": 1
}
```

**Réponse (201)**

```json
{
  "message": "Secrétaire créée avec succès",
  "secretaire": { "id": 1, "user_id": 3, "medecin_id": 1 }
}
```

---

### Récupérer le profil d'une secrétaire

```
GET /api/secretaire/profil/{id}
Authorization: Bearer {token}
```

**Réponse (200)**

```json
{
  "secretaire": {
    "id": 1,
    "medecin_id": 1,
    "user": { "nom": "Leroy", "prenom": "Marie", "email": "m.leroy@hopital.fr" },
    "medecin": { "specialite": "Cardiologie", "user": { "nom": "Martin" } }
  }
}
```

---

### Liste de tous les patients

```
GET /api/secretaire/patients
Authorization: Bearer {token}
```

Retourne tous les patients enregistrés avec leurs informations de contact.

**Réponse (200)**

```json
{
  "patients": [
    {
      "id": 1,
      "telephone": "0612345678",
      "user": { "nom": "Dupont", "prenom": "Jean", "email": "jean@example.com" }
    }
  ]
}
```

---

### Tous les rendez-vous du cabinet

```
GET /api/secretaire/rendez-vous
Authorization: Bearer {token}
```

Retourne l'ensemble des rendez-vous associés au médecin de la secrétaire.

---

### Confirmer un rendez-vous

```
PUT /api/secretaire/rendez-vous/confirmer/{id}
Authorization: Bearer {token}
```

Passe le statut du rendez-vous à `confirme`.

**Réponse (200)**

```json
{
  "message": "Rendez-vous confirmé",
  "rendez_vous": { "id": 5, "status": "confirme" }
}
```

---

### Annuler un rendez-vous

```
PUT /api/secretaire/rendez-vous/annuler/{id}
Authorization: Bearer {token}
```

Passe le statut à `annule` et libère le créneau horaire (`disponible: true`).

---

### Supprimer un rendez-vous

```
DELETE /api/secretaire/rendez-vous/supprimer/{id}
Authorization: Bearer {token}
```

Supprime définitivement le rendez-vous de la base de données et libère le créneau associé.

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/SecretaireController.php`

| Méthode | Route | Description |
|---------|-------|-------------|
| `creer()` | POST `/secretaire/creer` | Crée le profil secrétaire |
| `profil()` | GET `/secretaire/profil/{id}` | Retourne le profil |
| `listePatients()` | GET `/secretaire/patients` | Tous les patients |
| `listeRendezVous()` | GET `/secretaire/rendez-vous` | Tous les RDV du cabinet |
| `confirmerRDV()` | PUT `/secretaire/rendez-vous/confirmer/{id}` | Confirme un RDV |
| `annulerRDV()` | PUT `/secretaire/rendez-vous/annuler/{id}` | Annule un RDV |
| `supprimerRDV()` | DELETE `/secretaire/rendez-vous/supprimer/{id}` | Supprime un RDV |

---

## Dashboard Secrétaire (Frontend)

**Fichier** : `Project/rendez-vous-frontend/src/pages/secretaire.jsx`

Point d'entrée du rôle secrétaire. Navigation vers :

- Profil secrétaire
- Liste des patients
- Liste des rendez-vous (avec actions confirmer/annuler/supprimer)

### Profil Secrétaire

**Fichier** : `Project/rendez-vous-frontend/src/components/profilSecretaire.jsx`

Affiche les informations de la secrétaire et du médecin associé.

### Liste des Patients

**Fichier** : `Project/rendez-vous-frontend/src/components/listePatient.jsx`

Tableau de tous les patients avec nom, prénom, email et téléphone.

### Liste des Rendez-Vous

**Fichier** : `Project/rendez-vous-frontend/src/components/listeRDV.jsx`

Tableau de tous les rendez-vous avec :
- Informations patient et service
- Date et heure
- Statut avec badge coloré
- Actions : Confirmer / Annuler / Supprimer

### Composant Secrétaire (partagé)

**Fichier** : `Project/rendez-vous-frontend/src/components/secretaire.jsx`

Composant réutilisable intégré dans d'autres vues.

### Service API Secrétaire

**Fichier** : `Project/rendez-vous-frontend/src/services/secretaire.jsx`

Fonctions d'appel API dédiées aux opérations secrétaire.

---

## Création d'une secrétaire (flux complet)

**Fichier** : `Project/rendez-vous-frontend/src/components/CreerSecretaire.jsx`

Interface permettant à un administrateur ou médecin de créer un compte secrétaire :

1. Saisie des informations (nom, prénom, email, mot de passe)
2. `POST /api/register` avec `role: secretaire` → création du `User`
3. `POST /api/secretaire/creer` avec `user_id` et `medecin_id` → création du profil
