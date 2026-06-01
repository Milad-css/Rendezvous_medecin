# Gestion des Créneaux Horaires

## Vue d'ensemble

Un créneau (slot) représente une plage horaire disponible dans l'agenda d'un médecin. Quand un patient prend rendez-vous sur ce créneau, celui-ci passe à `disponible: false` et ne peut plus être réservé par un autre patient. Il est libéré automatiquement si le rendez-vous est annulé.

---

## Modèle de données

**Table** : `creneaux`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `medecin_id` | bigint FK | Référence vers `medecins` |
| `date` | date | Date du créneau |
| `heure_debut` | time | Heure de début |
| `heure_fin` | time | Heure de fin |
| `disponible` | boolean | `true` = libre, `false` = réservé |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relations** :
- `belongsTo(Medecin)` — médecin propriétaire du créneau
- `hasOne(RendezVous)` — rendez-vous associé (s'il existe)

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/Creneau.php`

---

## Endpoints

### Lister les créneaux disponibles d'un médecin (public)

```
GET /api/creneaux/{medecin_id}
```

Retourne uniquement les créneaux où `disponible: true`.

**Réponse (200)**

```json
{
  "creneaux": [
    {
      "id": 5,
      "date": "2026-06-15",
      "heure_debut": "10:00",
      "heure_fin": "10:30",
      "disponible": true
    },
    {
      "id": 6,
      "date": "2026-06-15",
      "heure_debut": "11:00",
      "heure_fin": "11:30",
      "disponible": true
    }
  ]
}
```

---

### Créer un créneau

```
POST /api/creneau/creer
Authorization: Bearer {token}
```

**Corps de la requête**

```json
{
  "medecin_id": 1,
  "date": "2026-06-15",
  "heure_debut": "10:00",
  "heure_fin": "10:30"
}
```

Le champ `disponible` est automatiquement initialisé à `true`.

**Réponse (201)**

```json
{
  "message": "Créneau créé avec succès",
  "creneau": {
    "id": 7,
    "medecin_id": 1,
    "date": "2026-06-15",
    "heure_debut": "10:00",
    "heure_fin": "10:30",
    "disponible": true
  }
}
```

---

### Supprimer un créneau

```
DELETE /api/creneau/supprimer/{id}
Authorization: Bearer {token}
```

**Réponse (200)**

```json
{
  "message": "Créneau supprimé avec succès"
}
```

> **Attention** : Ne pas supprimer un créneau qui a un rendez-vous actif (`disponible: false`).

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/CreneauController.php`

| Méthode | Route | Auth | Acteur |
|---------|-------|------|--------|
| `index()` | GET `/creneaux/{medecin_id}` | Non | Public / Patient |
| `creer()` | POST `/creneau/creer` | Oui | Médecin |
| `supprimer()` | DELETE `/creneau/supprimer/{id}` | Oui | Médecin |

---

## Composant Frontend

**Fichier** : `Project/rendez-vous-frontend/src/components/GestionCreneau.jsx`

Interface du médecin pour gérer ses créneaux :

- Affichage du calendrier avec tous les créneaux créés
- Formulaire de création d'un nouveau créneau (date, heure début, heure fin)
- Suppression d'un créneau existant
- Indicateur visuel de disponibilité (libre / réservé)

**Flux d'affichage** :
1. Chargement : `GET /api/creneaux/{medecin_id}` (filtrés ou tous selon la vue)
2. Création : formulaire → `POST /api/creneau/creer` → mise à jour de la liste
3. Suppression : `DELETE /api/creneau/supprimer/{id}` → mise à jour de la liste

---

## Cycle de vie d'un créneau

```
[Création]       disponible: true
      ↓
[Réservation]    disponible: false  ← RendezVous créé
      ↓
[Annulation]     disponible: true   ← RendezVous annulé
      ↑
[Confirmation]   disponible: false  (inchangé, statut du RDV change)
```

---

## Intégration dans la prise de rendez-vous

Dans `prendreRDV.jsx` :

1. Après sélection du médecin et du service
2. `GET /api/creneaux/{medecin_id}` charge les créneaux libres
3. Affichage dans un calendrier ou une liste sélectionnable
4. Le créneau choisi est envoyé via `POST /api/rendez-vous/prendre` avec `creneau_id`

---

## Intégration avec FullCalendar

Dans `calendrier.jsx`, les créneaux sont formatés en événements FullCalendar :

```js
{
  title: "Disponible",
  start: `${creneau.date}T${creneau.heure_debut}`,
  end: `${creneau.date}T${creneau.heure_fin}`,
  color: creneau.disponible ? "#22c55e" : "#ef4444"
}
```
