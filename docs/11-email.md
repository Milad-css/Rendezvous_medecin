# Gestion des E-mails

## Vue d'ensemble

Le module e-mail gère l'envoi de notifications par e-mail, notamment pour la vérification de compte à l'inscription.

---

## Contrôleur backend

**Fichier** : `Project/rendez-vous-backend/app/Http/Controllers/emailController.php`

Responsable de l'envoi des e-mails transactionnels via le système de mail de Laravel (configuration SMTP).

---

## Endpoints liés

### Vérification d'e-mail existant

```
GET /api/check-email?email={email}
```

Utilisé avant l'inscription pour vérifier si l'adresse est déjà enregistrée.

**Réponse (200) — e-mail disponible**

```json
{
  "exists": false
}
```

**Réponse (200) — e-mail déjà pris**

```json
{
  "exists": true
}
```

---

### Vérification de compte

```
GET /api/verification
```

Route déclenchée depuis le lien envoyé par e-mail à l'inscription. Active le compte utilisateur.

---

## Configuration mail (`.env`)

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit          # mailpit pour le développement local
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@rendezvoussapp.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Pour la production

Remplacer par un fournisseur SMTP réel :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io    # ou SendGrid, Mailgun, etc.
MAIL_PORT=587
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_ENCRYPTION=tls
```

---

## Outil de test e-mail (développement)

**Mailpit** est recommandé en développement local. Il intercepte tous les e-mails sortants et les affiche dans une interface web :

```bash
# Interface Mailpit accessible sur :
http://localhost:8025
```

---

## Types d'e-mails envoyés

| Événement | Destinataire | Contenu |
|-----------|-------------|---------|
| Inscription | Patient | Lien de vérification du compte |

D'autres notifications peuvent être ajoutées (confirmation de RDV, annulation) en utilisant les `Mailable` de Laravel et en les déclenchant depuis `RendezVousController` ou `SecretaireController`.
