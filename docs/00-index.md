# Documentation RendezVousApp

Application de gestion de rendez-vous médicaux — Laravel 12 (API) + React 19 (SPA)

---

## Fonctionnalités documentées

| # | Fichier | Description |
|---|---------|-------------|
| 01 | [Authentification](01-authentification.md) | Inscription, connexion, déconnexion, rôles, JWT/Sanctum |
| 02 | [Patients](02-patients.md) | Profil patient, prise et annulation de rendez-vous |
| 03 | [Médecins](03-medecins.md) | Profil médecin, dashboard, calendrier |
| 04 | [Secrétaires](04-secretaires.md) | Gestion patients, confirmation/annulation/suppression RDV |
| 05 | [Rendez-Vous](05-rendez-vous.md) | Cycle de vie des RDV, statuts, règles métier |
| 06 | [Services Médicaux](06-services.md) | Création et suppression de prestations par le médecin |
| 07 | [Créneaux Horaires](07-creneaux.md) | Gestion des slots, disponibilité, intégration FullCalendar |
| 08 | [Routage Frontend](08-frontend-routing.md) | React Router, routes protégées par rôle, Axios interceptors |
| 09 | [Gestion d'État](09-state-management.md) | Redux Toolkit, AuthSlice, persistance localStorage |
| 10 | [Référence API](10-api-reference.md) | Tableau complet de tous les endpoints |
| 11 | [E-mails](11-email.md) | Vérification de compte, configuration SMTP |

---

## Architecture globale

```
┌─────────────────────────────────┐
│     React 19 (Frontend)         │
│  Vite · React Router · Redux    │
│  Axios · FullCalendar           │
│         Port 5173               │
└──────────────┬──────────────────┘
               │ REST API (JSON)
               │ Authorization: Bearer {token}
┌──────────────▼──────────────────┐
│     Laravel 12 (Backend)        │
│  Sanctum · Eloquent ORM         │
│         Port 8000               │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│         MySQL Database          │
│  users · patients · medecins    │
│  secretaires · services         │
│  creneaux · rendez_vous         │
└─────────────────────────────────┘
```

---

## Rôles et permissions

| Rôle | Dashboard | Actions |
|------|-----------|---------|
| `patient` | `/dashboard` | Profil · Prendre RDV · Mes RDV · Annuler RDV |
| `medecin` | `/dashboard/medecin` | Profil · Services · Créneaux · Calendrier · RDV |
| `secretaire` | `/dashboard/secretaire` | Profil · Patients · Confirmer/Annuler/Supprimer RDV |

---

## Démarrage rapide

```bash
# Backend
cd Project/rendez-vous-backend
composer install && cp .env.example .env
php artisan key:generate && php artisan migrate
php artisan serve

# Frontend
cd Project/rendez-vous-frontend
npm install && cp .env.example .env
npm run dev
```
