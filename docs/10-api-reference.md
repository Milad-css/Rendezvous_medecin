# Référence API Complète

## Base URL

```
Développement : http://localhost:8000/api
Production    : https://votre-backend.railway.app/api
```

## Authentification

Toutes les routes marquées **Oui** nécessitent le header :

```
Authorization: Bearer {token}
```

---

## Routes publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Vérification santé du serveur |
| POST | `/register` | Inscription d'un patient |
| POST | `/login` | Connexion |
| GET | `/check-email` | Vérifier si un email existe |
| GET | `/verification` | Confirmation du compte |
| POST | `/medecin/creer` | Créer un profil médecin |
| POST | `/secretaire/creer` | Créer un profil secrétaire |
| GET | `/medecin/{id}` | Profil médecin par ID |
| GET | `/medecin/user/{user_id}` | Médecin lié à un user_id |
| GET | `/services/{medecin_id}` | Services d'un médecin |
| GET | `/creneaux/{medecin_id}` | Créneaux disponibles d'un médecin |

---

## Routes protégées

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/logout` | Déconnexion (révoque le token) |

---

### Patient

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/patient/profil` | Profil du patient connecté |
| PUT | `/patient/modifier` | Modifier le profil |

---

### Rendez-Vous (patient)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/rendez-vous/prendre` | Prendre un rendez-vous |
| PUT | `/rendez-vous/annuler/{id}` | Annuler un rendez-vous |
| GET | `/rendez-vous` | Tous mes rendez-vous |
| GET | `/rendez-vous/{id}` | Détail d'un rendez-vous |

---

### Services (médecin)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/service/creer` | Créer un service médical |
| DELETE | `/service/supprimer/{id}` | Supprimer un service |

---

### Créneaux (médecin)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/creneau/creer` | Créer un créneau horaire |
| DELETE | `/creneau/supprimer/{id}` | Supprimer un créneau |

---

### Secrétaire

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/secretaire/profil/{id}` | Profil de la secrétaire |
| GET | `/secretaire/patients` | Liste de tous les patients |
| GET | `/secretaire/rendez-vous` | Tous les rendez-vous du cabinet |
| PUT | `/secretaire/rendez-vous/confirmer/{id}` | Confirmer un RDV |
| PUT | `/secretaire/rendez-vous/annuler/{id}` | Annuler un RDV |
| DELETE | `/secretaire/rendez-vous/supprimer/{id}` | Supprimer un RDV |

---

## Codes de réponse HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Ressource créée |
| 401 | Non authentifié (token absent ou expiré) |
| 403 | Accès interdit (rôle non autorisé) |
| 404 | Ressource introuvable |
| 409 | Conflit (ex : créneau déjà réservé) |
| 422 | Données de validation incorrectes |
| 500 | Erreur serveur interne |

---

## Format des réponses d'erreur (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

## Configuration backend (`.env`)

```env
APP_NAME=RendezVousApp
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rendez_vous_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

---

## Démarrage du backend

```bash
cd Project/rendez-vous-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve    # Démarre sur http://localhost:8000
```
