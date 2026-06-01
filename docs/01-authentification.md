# Authentification

## Vue d'ensemble

Le système d'authentification repose sur **Laravel Sanctum** (tokens API) côté backend et **Redux Toolkit** côté frontend pour la gestion de l'état de session.

---

## Flux d'authentification

```
Client → POST /api/login → Laravel Sanctum → Token → Redux Store → localStorage
```

1. L'utilisateur soumet ses identifiants.
2. Le backend valide et retourne un token Bearer.
3. Le frontend stocke le token dans Redux et localStorage.
4. Chaque requête protégée envoie ce token dans le header `Authorization: Bearer {token}`.

---

## Endpoints

### Inscription

```
POST /api/register
```

**Corps de la requête**

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "password": "secret123",
  "password_confirmation": "secret123",
  "role": "patient"
}
```

**Réponse (201)**

```json
{
  "message": "Inscription réussie",
  "user": { "id": 1, "nom": "Dupont", "prenom": "Jean", "email": "jean@example.com", "role": "patient" },
  "token": "1|abc123..."
}
```

---

### Connexion

```
POST /api/login
```

**Corps de la requête**

```json
{
  "email": "jean@example.com",
  "password": "secret123"
}
```

**Réponse (200)**

```json
{
  "user": { "id": 1, "nom": "Dupont", "prenom": "Jean", "role": "patient" },
  "token": "1|abc123..."
}
```

---

### Déconnexion

```
POST /api/logout
Authorization: Bearer {token}
```

**Réponse (200)**

```json
{
  "message": "Déconnexion réussie"
}
```

Révoque le token actuel côté serveur.

---

### Vérification d'e-mail

```
GET /api/check-email?email={email}
```

Vérifie si un e-mail est déjà enregistré avant inscription.

```
GET /api/verification
```

Confirmation du compte par e-mail.

---

## Rôles utilisateurs

| Rôle | Description |
|------|-------------|
| `patient` | Peut prendre et gérer ses propres rendez-vous |
| `medecin` | Gère ses services, créneaux et consulte ses RDV |
| `secretaire` | Gère les patients et tous les RDV d'un médecin |

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/AuthController.php`

Méthodes principales :
- `register()` — crée un `User` + profil selon le rôle, retourne un token
- `login()` — valide les identifiants, crée un token Sanctum
- `logout()` — révoque `$request->user()->currentAccessToken()`

---

## Redux (Frontend)

**Fichier** : `Project/rendez-vous-frontend/src/store/slices/AuthSlice.js`

```js
// État initial
{
  user: null,
  token: null,
  isAuthenticated: false
}
```

| Action | Description |
|--------|-------------|
| `setCredentials({ user, token })` | Stocke l'utilisateur et le token après login |
| `logout()` | Vide l'état et supprime de localStorage |

L'état est synchronisé avec `localStorage` pour persister la session entre les rechargements de page.

---

## Protection des routes (Frontend)

**Fichier** : `Project/rendez-vous-frontend/src/Routes/protectedRoutes.jsx`

Redirige automatiquement vers `/login` si `isAuthenticated` est `false`, ou vers le dashboard correspondant au rôle si l'utilisateur tente d'accéder à une route non autorisée.

---

## Gestion des erreurs courantes

| Code | Cause |
|------|-------|
| 401 | Token absent ou expiré |
| 422 | Données de validation incorrectes |
| 403 | Rôle non autorisé pour cette ressource |
