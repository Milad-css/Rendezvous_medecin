# Gestion d'État (Redux Toolkit)

## Vue d'ensemble

L'état global du frontend est géré avec **Redux Toolkit**. La seule tranche d'état (slice) gérée globalement est l'authentification. L'état local des composants (listes, formulaires) est géré avec `useState` / `useEffect` React.

---

## Configuration du Store

**Fichier** : `Project/rendez-vous-frontend/src/store/slices/index.js`

```js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});
```

Le store est injecté à la racine de l'application dans `main.jsx` via `<Provider store={store}>`.

---

## AuthSlice

**Fichier** : `Project/rendez-vous-frontend/src/store/slices/AuthSlice.js`

### État initial

```js
{
  user: null,            // Objet utilisateur (id, nom, prenom, email, role)
  token: null,           // Token Sanctum Bearer
  isAuthenticated: false // Statut de connexion
}
```

L'état initial est hydraté depuis `localStorage` au démarrage :

```js
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token')
};
```

---

### Actions

#### `setCredentials({ user, token })`

Appelée après un login ou register réussi.

```js
// Dispatché depuis Login.jsx
dispatch(setCredentials({ user: data.user, token: data.token }));
```

Effets :
- Met à jour `state.user`, `state.token`, `state.isAuthenticated = true`
- Persiste dans `localStorage` : `user` et `token`

---

#### `logout()`

Appelée lors de la déconnexion ou d'une erreur 401.

```js
// Dispatché depuis le bouton déconnexion ou l'intercepteur Axios
dispatch(logout());
```

Effets :
- Remet `state.user = null`, `state.token = null`, `state.isAuthenticated = false`
- Supprime `user` et `token` de `localStorage`

---

### Sélecteurs utilisés dans les composants

```js
import { useSelector, useDispatch } from 'react-redux';

const user = useSelector(state => state.auth.user);
const token = useSelector(state => state.auth.token);
const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
```

---

## Persistance localStorage

| Clé | Valeur | Description |
|-----|--------|-------------|
| `token` | `"1\|abc123..."` | Token API Sanctum |
| `user` | `{"id":1,"role":"patient",...}` | Objet utilisateur sérialisé |

La persistance permet de maintenir la session après un rechargement de page, sans nouvelle authentification.

---

## Dépendances

```json
"@reduxjs/toolkit": "2.11.2",
"react-redux": "9.2.0"
```

---

## Flux complet Login → Redux → API

```
1. User remplit le formulaire Login.jsx
2. POST /api/login via api.js (Axios)
3. Réponse { user, token }
4. dispatch(setCredentials({ user, token }))
5. Redux met à jour le store + localStorage
6. React Router redirige vers /dashboard selon user.role
7. Chaque composant lit user/token via useSelector
8. api.js injecte token dans Authorization header via intercepteur
```
