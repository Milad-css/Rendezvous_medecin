# Gestion des Rendez-Vous

## Vue d'ensemble

Le rendez-vous est l'entité centrale de l'application. Il lie un patient, un service médical et un créneau horaire. Son statut évolue de `en_attente` → `confirme` ou `annule`.

---

## Modèle de données

**Table** : `rendez_vous`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `patient_id` | bigint FK | Référence vers `patients` |
| `service_id` | bigint FK | Référence vers `services` |
| `creneau_id` | bigint FK | Référence vers `creneaux` |
| `date` | date | Date du rendez-vous |
| `heure` | time | Heure du rendez-vous |
| `status` | enum | `en_attente`, `confirme`, `annule` |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relations** :
- `belongsTo(Patient)`
- `belongsTo(Service)`
- `belongsTo(Creneau)`

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/RendezVous.php`

---

## Cycle de vie d'un rendez-vous

```
Patient prend RDV → [en_attente] → Secrétaire confirme → [confirme]
                                 → Secrétaire/Patient annule → [annule]
                                   (libère le créneau)
```

---

## Endpoints

### Prendre un rendez-vous

```
POST /api/rendez-vous/prendre
Authorization: Bearer {token}
```

**Corps de la requête**

```json
{
  "service_id": 2,
  "creneau_id": 5,
  "date": "2026-06-15",
  "heure": "10:00"
}
```

**Logique interne** :
1. Vérifie que le créneau est disponible (`disponible: true`)
2. Crée le `RendezVous` avec `status: en_attente`
3. Met à jour le créneau : `disponible: false`

**Réponse (201)**

```json
{
  "message": "Rendez-vous créé avec succès",
  "rendez_vous": {
    "id": 10,
    "patient_id": 1,
    "service_id": 2,
    "creneau_id": 5,
    "date": "2026-06-15",
    "heure": "10:00",
    "status": "en_attente"
  }
}
```

**Erreur si créneau indisponible (409)**

```json
{
  "message": "Ce créneau n'est plus disponible"
}
```

---

### Annuler un rendez-vous (patient)

```
PUT /api/rendez-vous/annuler/{id}
Authorization: Bearer {token}
```

- Passe le statut à `annule`
- Remet `creneau.disponible` à `true`

**Réponse (200)**

```json
{
  "message": "Rendez-vous annulé"
}
```

---

### Mes rendez-vous (patient)

```
GET /api/rendez-vous
Authorization: Bearer {token}
```

Retourne tous les rendez-vous du patient connecté, avec service et créneau inclus.

**Réponse (200)**

```json
{
  "rendez_vous": [
    {
      "id": 10,
      "date": "2026-06-15",
      "heure": "10:00",
      "status": "en_attente",
      "service": { "nom": "Consultation", "duree": 30, "prix": 50 },
      "creneau": { "heure_debut": "10:00", "heure_fin": "10:30" }
    }
  ]
}
```

---

### Détail d'un rendez-vous

```
GET /api/rendez-vous/{id}
Authorization: Bearer {token}
```

Retourne un rendez-vous précis avec toutes ses relations chargées.

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/RendezVousController.php`

| Méthode | Route | Acteur |
|---------|-------|--------|
| `prendre()` | POST `/rendez-vous/prendre` | Patient |
| `annuler()` | PUT `/rendez-vous/annuler/{id}` | Patient |
| `mesRendezVous()` | GET `/rendez-vous` | Patient |
| `show()` | GET `/rendez-vous/{id}` | Patient |

Actions réservées à la secrétaire dans `SecretaireController` :
- `confirmerRDV()` → PUT `/secretaire/rendez-vous/confirmer/{id}`
- `annulerRDV()` → PUT `/secretaire/rendez-vous/annuler/{id}`
- `supprimerRDV()` → DELETE `/secretaire/rendez-vous/supprimer/{id}`

---

## Composants Frontend

### Prendre un RDV

**Fichier** : `Project/rendez-vous-frontend/src/components/prendreRDV.jsx`

Étapes du formulaire :
1. Sélection du médecin
2. Chargement et sélection d'un service (`GET /api/services/{medecin_id}`)
3. Affichage des créneaux disponibles (`GET /api/creneaux/{medecin_id}`)
4. Sélection d'un créneau
5. Confirmation → `POST /api/rendez-vous/prendre`

### Mes Rendez-Vous

**Fichier** : `Project/rendez-vous-frontend/src/components/mesRDV.jsx`

Affiche la liste des RDV du patient avec :
- Statut coloré (orange = en attente, vert = confirmé, rouge = annulé)
- Bouton "Annuler" visible uniquement pour les RDV `en_attente`

### Liste des RDV (secrétaire)

**Fichier** : `Project/rendez-vous-frontend/src/components/listeRDV.jsx`

Vue complète pour la secrétaire avec actions : Confirmer / Annuler / Supprimer.

---

## Règles métier

- Un patient ne peut annuler que ses propres rendez-vous.
- Un créneau est automatiquement libéré lors de l'annulation.
- Seule la secrétaire peut confirmer ou supprimer un rendez-vous.
- Un rendez-vous `confirme` ou `annule` ne peut plus être modifié par le patient.
