# Routage Frontend & Protection des Routes

## Vue d'ensemble

Le frontend utilise **React Router DOM v7** pour la navigation. Les routes sont protégées par rôle : un patient ne peut pas accéder au dashboard médecin et vice-versa. Les utilisateurs non authentifiés sont redirigés vers `/login`.

---

## Structure des routes

**Fichier principal** : `Project/rendez-vous-frontend/src/App.jsx`

```
/login              → Login.jsx           (public)
/register           → Register.jsx        (public)
/dashboard          → Dashboard.jsx       (protégé - role: patient)
/dashboard/medecin  → medecin.jsx         (protégé - role: medecin)
/dashboard/secretaire → secretaire.jsx    (protégé - role: secretaire)
*                   → Redirect /login     (catch-all)
```

---

## Routes protégées

**Fichier** : `Project/rendez-vous-frontend/src/Routes/protectedRoutes.jsx`

Le composant `ProtectedRoute` vérifie deux conditions :

1. **Authentification** : `isAuthenticated` dans le store Redux doit être `true`
2. **Rôle** : le `user.role` doit correspondre au rôle attendu par la route

```jsx
// Logique de protection
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
if (allowedRole && user.role !== allowedRole) {
  return <Navigate to="/login" />;
}
return <Outlet />;
```

---

## Pages

### Login

**Fichier** : `Project/rendez-vous-frontend/src/pages/Login.jsx`

- Formulaire email + mot de passe
- Appel `POST /api/login`
- En cas de succès :
  - Dispatch `setCredentials({ user, token })` → Redux store
  - Redirection automatique selon le rôle :
    - `patient` → `/dashboard`
    - `medecin` → `/dashboard/medecin`
    - `secretaire` → `/dashboard/secretaire`

---

### Register

**Fichier** : `Project/rendez-vous-frontend/src/pages/Register.jsx`

- Formulaire d'inscription pour les patients
- Appel `POST /api/register` avec `role: patient`
- Redirection vers `/login` après inscription réussie

---

### Dashboard Patient

**Fichier** : `Project/rendez-vous-frontend/src/pages/Dashboard.jsx`

- Accès réservé au rôle `patient`
- Barre de navigation avec accès aux composants :
  - Profil patient
  - Prendre un RDV
  - Mes RDV

---

### Dashboard Médecin

**Fichier** : `Project/rendez-vous-frontend/src/pages/medecin.jsx`

- Accès réservé au rôle `medecin`
- Charge le profil médecin au montage
- Navigation vers :
  - Profil médecin
  - Gestion des services
  - Gestion des créneaux
  - Calendrier
  - Liste des RDV

---

### Dashboard Secrétaire

**Fichier** : `Project/rendez-vous-frontend/src/pages/secretaire.jsx`

- Accès réservé au rôle `secretaire`
- Navigation vers :
  - Profil secrétaire
  - Liste des patients
  - Liste des rendez-vous

---

## Client HTTP (Axios)

**Fichier** : `Project/rendez-vous-frontend/src/services/api.js`

Instance Axios configurée avec :

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL  // ex: http://localhost:8000/api
});
```

**Intercepteur de requête** : ajoute automatiquement le header `Authorization: Bearer {token}` à chaque requête si un token est présent dans le store Redux.

**Intercepteur de réponse** : gère les erreurs 401 (session expirée) en déclenchant un `logout()` et une redirection vers `/login`.

---

## Variables d'environnement

**Fichier** : `Project/rendez-vous-frontend/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

Pour la production (Railway) :

```env
VITE_API_URL=https://votre-backend.railway.app/api
```

---

## Démarrage du frontend

```bash
cd Project/rendez-vous-frontend
npm install
npm run dev     # Développement (Vite dev server - port 5173)
npm run build   # Build production
npm run preview # Prévisualiser le build
```
