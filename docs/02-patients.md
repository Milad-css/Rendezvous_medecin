# Gestion des Patients

## Vue d'ensemble

Un patient est un utilisateur avec le rôle `patient`. À l'inscription, un enregistrement `Patient` est automatiquement créé et lié à l'utilisateur. Le patient peut consulter et modifier son profil, prendre des rendez-vous et les annuler.

---

## Modèle de données

**Table** : `patients`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `user_id` | bigint FK | Référence vers `users` |
| `telephone` | string | Numéro de téléphone |
| `created_at` | timestamp | Date de création |
| `updated_at` | timestamp | Date de mise à jour |

**Relations** :
- `belongsTo(User)` — informations de base (nom, prénom, email)
- `hasMany(RendezVous)` — tous les rendez-vous du patient

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/Patient.php`

---

## Endpoints

Toutes ces routes nécessitent le header `Authorization: Bearer {token}`.

### Profil du patient connecté

```
GET /api/patient/profil
```

**Réponse (200)**

```json
{
  "patient": {
    "id": 1,
    "telephone": "0612345678",
    "user": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com"
    }
  }
}
```

---

### Modifier le profil

```
PUT /api/patient/modifier
```

**Corps de la requête**

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "telephone": "0699887766"
}
```

**Réponse (200)**

```json
{
  "message": "Profil mis à jour avec succès"
}
```

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/PatientController.php`

| Méthode | Route | Description |
|---------|-------|-------------|
| `profil()` | GET `/patient/profil` | Retourne le profil du patient via `auth()->user()->patient` |
| `modifier()` | PUT `/patient/modifier` | Met à jour `User` (nom, prénom, email) et `Patient` (téléphone) |

---

## Composants Frontend

### Page Dashboard Patient

**Fichier** : `Project/rendez-vous-frontend/src/pages/Dashboard.jsx`

Point d'entrée du patient connecté. Affiche la navigation vers les différentes sections.

### Profil Patient

**Fichier** : `Project/rendez-vous-frontend/src/components/profil.jsx`

- Affiche les informations du profil (nom, prénom, email, téléphone)
- Formulaire de modification en ligne
- Appel `PUT /api/patient/modifier` à la soumission

### Mes Rendez-Vous

**Fichier** : `Project/rendez-vous-frontend/src/components/mesRDV.jsx`

- Liste tous les rendez-vous du patient
- Statut coloré : `en_attente` (orange), `confirme` (vert), `annule` (rouge)
- Bouton d'annulation pour les rendez-vous en attente

### Prendre un Rendez-Vous

**Fichier** : `Project/rendez-vous-frontend/src/components/prendreRDV.jsx`

- Sélection du médecin et du service
- Affichage du calendrier avec les créneaux disponibles
- Confirmation de la réservation

---

## Cas d'utilisation typiques

### Prendre un rendez-vous

1. Patient se connecte → Dashboard
2. Ouvre "Prendre un RDV"
3. Choisit un médecin → un service → un créneau disponible
4. Confirme → `POST /api/rendez-vous/prendre`
5. Le créneau passe à `disponible: false`

### Annuler un rendez-vous

1. Patient consulte "Mes RDV"
2. Clique sur "Annuler" sur un RDV `en_attente`
3. → `PUT /api/rendez-vous/annuler/{id}`
4. Le créneau repasse à `disponible: true`
