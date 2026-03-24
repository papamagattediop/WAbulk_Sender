# WA Bulk Sender

Application web pour l'envoi massif de messages WhatsApp personnalisés à partir d'un fichier CSV ou Excel.

## Fonctionnalités

- Connexion WhatsApp via QR Code ou Code pairage
- Import de contacts depuis CSV ou Excel
- Personnalisation des messages avec `{{nom}}` et `{{numero}}`
- Aperçu du message avant envoi
- Envoi en masse avec délai anti-ban configurable
- Suivi en temps réel de la progression
- Rapport d'envoi détaillé

## Stack technique

- **Frontend** : React 18 + Vite
- **Backend** : Node.js + Express
- **WhatsApp** : WPPConnect
- **Parsing** : XLSX (CSV + Excel)

## Structure du projet

```
whatsapp-bulk-v2/
├── backend/
│   ├── index.js              # Serveur Express + routes API
│   ├── parser.js             # Lecture CSV/Excel
│   ├── queue.js              # File d'envoi anti-ban
│   ├── package.json
│   ├── .env
│   ├── uploads/              # Fichiers uploadés temporairement
│   ├── tokens/               # Session WhatsApp (généré automatiquement)
│   └── adapter/
│       ├── index.js          # Point de swap backend (1 ligne à changer)
│       └── wppconnect.js     # Implémentation WPPConnect
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── hooks/
        │   └── useWhatsApp.js
        └── components/
            ├── QRConnect.jsx
            ├── UploadCSV.jsx
            ├── MessageEditor.jsx
            ├── ContactTable.jsx
            └── SendProgress.jsx
```

## Installation

### Prérequis

- Node.js 20.0.0 ou supérieur
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## Configuration

Créez un fichier `.env` dans le dossier `backend/` :

```env
PORT=3001
```

## Format du fichier CSV/Excel

Le fichier doit contenir au minimum les colonnes `nom` et `numero` :

```csv
nom,numero
Moussa Diop,221785411XX2
Fatou Ndiaye,2217723XXX78
Aminata Fall,2217691XXX56
```

Colonnes acceptées pour le nom : `nom`, `name`, `prenom`, `prénom`

Colonnes acceptées pour le numéro : `numero`, `numéro`, `phone`, `tel`, `telephone`, `number`

## Utilisation

1. Lancer le backend puis le frontend
2. Scanner le QR Code ou utiliser le code pairage pour connecter WhatsApp
3. Importer votre fichier CSV ou Excel
4. Rédiger votre message avec `{{nom}}` pour personnaliser
5. Choisir le délai entre les messages (4s recommandé)
6. Cliquer sur Envoyer

## Changer de backend WhatsApp

Pour swapper WPPConnect par un autre backend (Baileys, Waha, etc.), modifiez **une seule ligne** dans `backend/adapter/index.js` :

```js
// Avant
export { ... } from "./wppconnect.js";

// Après
export { ... } from "./baileys.js";
```

## API Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Vérification du serveur |
| GET | `/api/status` | Statut connexion WhatsApp |
| GET | `/api/qr` | QR Code base64 |
| POST | `/api/pairing` | Demande code pairage |
| POST | `/api/disconnect` | Déconnexion WhatsApp |
| POST | `/api/upload` | Upload CSV/Excel |
| POST | `/api/send-test` | Envoi message test |
| POST | `/api/send` | Envoi en masse (SSE) |

## Déploiement

### Recommandé : Railway (5$/mois)

1. Pousser le code sur GitHub
2. Créer un compte Railway
3. New Project → Deploy from GitHub
4. Configurer les variables d'environnement
5. Railway détecte automatiquement Node.js

### Alternative : Ngrok (gratuit, PC local)

```bash
# Installer ngrok
winget install ngrok

# Exposer le backend
ngrok http 3001
```

Deployer le frontend sur Netlify en pointant vers l'URL ngrok.

## Notes importantes

- Ne pas utiliser pour du spam — respectez les conditions d'utilisation de WhatsApp
- Le délai anti-ban recommandé est de 4 secondes minimum entre chaque message
- La session WhatsApp est sauvegardée dans `tokens/` — ne pas supprimer ce dossier
- `useMultiFileAuthState` est déconseillé en production — préférer une base de données

## Licence

MIT
