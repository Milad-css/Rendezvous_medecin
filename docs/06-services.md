# Gestion des Services Médicaux

## Vue d'ensemble

Un service représente une prestation proposée par un médecin (ex : consultation générale, échographie, bilan sanguin). Chaque service a une durée et un prix. Les patients choisissent un service lors de la prise de rendez-vous.

---

## Modèle de données

**Table** : `services`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Clé primaire |
| `medecin_id` | bigint FK | Référence vers `medecins` |
| `nom` | string | Nom du service |
| `duree` | integer | Durée en minutes |
| `prix` | decimal | Prix en euros |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relations** :
- `belongsTo(Medecin)` — médecin propriétaire du service
- `hasMany(RendezVous)` — rendez-vous utilisant ce service

**Fichier modèle** : `Project/rendez-vous-backend/app/Models/Service.php`

---

## Endpoints

### Lister les services d'un médecin (public)

```
GET /api/services/{medecin_id}
```

Accès public — utilisé par les patients pour choisir un service lors de la réservation.

**Réponse (200)**

```json
{
  "services": [
    {
      "id": 1,
      "nom": "Consultation générale",
      "duree": 30,
      "prix": 50.00
    },
    {
      "id": 2,
      "nom": "Bilan cardiaque",
      "duree": 60,
      "prix": 120.00
    }
  ]
}
```

---

### Créer un service

```
POST /api/service/creer
Authorization: Bearer {token}
```

**Corps de la requête**

```json
{
  "medecin_id": 1,
  "nom": "Consultation générale",
  "duree": 30,
  "prix": 50.00
}
```

**Réponse (201)**

```json
{
  "message": "Service créé avec succès",
  "service": {
    "id": 1,
    "medecin_id": 1,
    "nom": "Consultation générale",
    "duree": 30,
    "prix": 50.00
  }
}
```

---

### Supprimer un service

```
DELETE /api/service/supprimer/{id}
Authorization: Bearer {token}
```

**Réponse (200)**

```json
{
  "message": "Service supprimé avec succès"
}
```

> **Attention** : La suppression d'un service peut affecter les rendez-vous qui y sont liés. S'assurer qu'aucun RDV actif n'utilise ce service avant de le supprimer.

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/ServiceController.php`

| Méthode | Route | Auth | Acteur |
|---------|-------|------|--------|
| `index()` | GET `/services/{medecin_id}` | Non | Public / Patient |
| `creer()` | POST `/service/creer` | Oui | Médecin |
| `supprimer()` | DELETE `/service/supprimer/{id}` | Oui | Médecin |

---

## Composant Frontend

**Fichier** : `Project/rendez-vous-frontend/src/components/GererService.jsx`

Interface du médecin pour gérer ses services :

- Affichage de la liste des services existants (nom, durée, prix)
- Formulaire d'ajout d'un nouveau service
- Bouton de suppression par service

**Flux d'affichage** :
1. Chargement : `GET /api/services/{medecin_id}`
2. Ajout : formulaire → `POST /api/service/creer` → rechargement de la liste
3. Suppression : clic → `DELETE /api/service/supprimer/{id}` → rechargement de la liste

---

## Utilisation dans la prise de rendez-vous

Lors de la réservation (`prendreRDV.jsx`) :

1. Patient sélectionne un médecin
2. `GET /api/services/{medecin_id}` charge la liste des services
3. Patient choisit le service souhaité
4. L'`id` du service est envoyé dans `POST /api/rendez-vous/prendre`
