# ASD Management Frontend

Frontend React/Vite per la gestione di un'associazione sportiva.

Il progetto si concentra attualmente su:
- accesso riservato con login interno
- struttura modulare per CRUD amministrativi e documentali
- sidebar e dashboard gia' predisposte anche per moduli futuri

## Stack

- React 19
- Vite 6
- React Router 7
- Axios
- Tailwind CSS 4

## Stato attuale

Moduli attivi:
- Atleti
- Allenatori
- Medici sportivi
- Compensi
- Certificati medici

Moduli pianificati / placeholder:
- Societa' partner
- Iscrizioni atleti
- Movimenti finanziari
- Fatture
- Ricevute
- Generazione documenti
- Bandi regionali

## Struttura del progetto

La struttura e' organizzata per responsabilita':

- `src/app/` configurazione applicativa e catalogo moduli
- `src/features/` funzionalita' di dominio
- `src/shared/` componenti, config e utility condivise

File principali:
- `src/app/router.jsx`
- `src/app/moduleCatalog.js`
- `src/features/resources/resourceRegistry.js`
- `src/shared/config/env.js`

## Avvio locale

Prerequisiti:
- Node.js 20+ consigliato
- npm

Installazione:

```bash
npm install
```

Avvio in sviluppo:

```bash
npm run dev
```

Build produzione:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Configurazione ambiente

Copia `.env.example` in `.env` e valorizza le variabili necessarie.

Variabili disponibili:

```dotenv
VITE_API_BASE_URL=
VITE_ENABLE_MOCK_AUTH=false
VITE_AUTH_LOGIN_PATH=

VITE_APP_NAME=ASD Management
VITE_ASSOCIATION_NAME=
VITE_APP_TAGLINE=
VITE_SUPPORT_EMAIL=
```

Note:
- `VITE_ENABLE_MOCK_AUTH=true` abilita un login fittizio utile per sviluppo/demo
- `VITE_API_BASE_URL` e `VITE_AUTH_LOGIN_PATH` sono richieste per usare il backend JWT reale
- le variabili `VITE_*` sono pubbliche lato frontend: non inserire segreti

## Autenticazione

Il frontend e' predisposto per autenticazione JWT.

Comportamento attuale:
- in ambiente demo/sviluppo puoi usare `VITE_ENABLE_MOCK_AUTH=true`
- con backend reale il login usa l'endpoint configurato in `VITE_AUTH_LOGIN_PATH`

Le route applicative sono protette e accessibili solo dopo login.

## UI e branding

Il branding base dell'interfaccia e' configurabile via env:
- nome applicazione
- nome associazione
- tagline
- email supporto

La favicon e' gestita nella cartella `public/`.

## Testing

Al momento non sono presenti test automatici reali.

Lo script corrente:

```bash
npm test
```

restituisce solo un placeholder. La pipeline CI esegue comunque installazione, build e test script corrente.

## Roadmap breve

- collegamento completo al backend Django/DRF
- introduzione ruoli utente reali
- attivazione dei moduli placeholder
- aggiunta test frontend reali
- generazione documenti e gestione bandi
