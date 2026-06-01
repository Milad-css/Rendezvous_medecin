# Gestion des Médecins

## Vue d'ensemble

Un médecin dispose d'un profil enrichi (spécialité, photo, adresse), gère ses services médicaux et ses créneaux horaires disponibles. Son dashboard lui permet de suivre ses rendez-vous et d'organiser son planning.

---

## Modèle de données

**Table** : `medecins`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `user_id` | bigint FK | Référence vers `users` |
| `specialite` | string | Spécialité médicale |
| `photo` | string (nullable) | URL ou chemin de la photo |
| `adresse` | string | Adresse du cabinet |
| `created_at` | timestamp | Date de création |
| `updated_at` | timestamp | Date de mise à jour |

**Relations** :
- `belongsTo(User)` — nom, prénom, email
- `hasMany(Service)` — services proposés
- `hasMany(Creneau)` — créneaux horaires
- `hasOne(Secretaire)` — secrétaire associée

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/Medecin.php`

---

## Endpoints

### Créer un profil médecin (public)

```
POST /api/medecin/creer
```

**Corps de la requête**

```json
{
  "user_id": 2,
  "specialite": "Cardiologie",
  "adresse": "10 rue de la Paix, Paris",
  "photo": "https://example.com/photo.jpg"
}
```

**Réponse (201)**

```json
{
  "message": "Médecin créé avec succès",
  "medecin": { "id": 1, "specialite": "Cardiologie", ... }
}
```

---

### Récupérer un médecin par ID

```
GET /api/medecin/{id}
```

Accès public — utilisé lors de la prise de rendez-vous par un patient.

**Réponse (200)**

```json
{
  "medecin": {
    "id": 1,
    "specialite": "Cardiologie",
    "adresse": "10 rue de la Paix",
    "user": { "nom": "Martin", "prenom": "Sophie", "email": "s.martin@hopital.fr" }
  }
}
```

---

### Récupérer un médecin par user_id

```
GET /api/medecin/user/{user_id}
Authorization: Bearer {token}
```

Utilisé par le dashboard médecin pour charger le profil de l'utilisateur connecté.

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/MedecinController.php`

| Méthode | Route | Auth |
|---------|-------|------|
| `creer()` | POST `/medecin/creer` | Non |
| `getById()` | GET `/medecin/{id}` | Non |
| `getByUserId()` | GET `/medecin/user/{user_id}` | Oui |

---

## Dashboard Médecin (Frontend)

**Fichier** : `Project/rendez-vous-frontend/src/pages/medecin.jsx`

Le dashboard est le point d'entrée du médecin. Il charge le profil via `GET /api/medecin/user/{user_id}` et affiche la navigation vers :

- Profil médecin
- Gestion des services
- Gestion des créneaux
- Liste des rendez-vous
- Calendrier

### Profil Médecin

**Fichier** : `Project/rendez-vous-frontend/src/components/ProfilMedecin.jsx`

Affiche et permet la modification de la spécialité, adresse et photo du médecin.

### Calendrier

**Fichier** : `Project/rendez-vous-frontend/src/components/calendrier.jsx`

Utilise **FullCalendar** pour afficher les rendez-vous du médecin sous forme de calendrier interactif (vue jour, semaine, mois).

Dépendances FullCalendar utilisées :
- `@fullcalendar/react`
- `@fullcalendar/daygrid`
- `@fullcalendar/timegrid`
- `@fullcalendar/interaction`

---

## Flux typique de configuration médecin

1. Compte `User` créé via `/register` avec `role: medecin`
2. Profil `Medecin` créé via `POST /api/medecin/creer`
3. Services ajoutés via `POST /api/service/creer`
4. Créneaux ajoutés via `POST /api/creneau/creer`
5. Les patients peuvent désormais réserver des créneaux disponibles
