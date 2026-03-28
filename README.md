# ASD Management Frontend

![React](https://img.shields.io/badge/Built%20with-React-61DAFB)
![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6)
![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF)
[![CI](https://github.com/aleattene/asd-management-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/aleattene/asd-management-frontend/actions/workflows/test.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/8d5c1b60-cbc3-4e95-8602-30949fbc942d/deploy-status)](https://app.netlify.com/sites/asd-management/deploys)
[![codecov](https://codecov.io/gh/aleattene/asd-management-frontend/graph/badge.svg?token=TBZQE4DBR3)](https://codecov.io/gh/aleattene/asd-management-frontend)
[![GitHub commits](https://badgen.net/github/commits/aleattene/asd-management-frontend)](https://github.com/aleattene/asd-management-frontend/commits/)
[![GitHub last commit](https://img.shields.io/github/last-commit/aleattene/asd-management-frontend)](https://github.com/aleattene/asd-management-frontend/commits/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/aleattene/asd-management-frontend/pulls)
[![License](https://img.shields.io/github/license/aleattene/asd-management-frontend?color=blue)](https://github.com/aleattene/asd-management-frontend/blob/main/LICENSE)

## Moduli implementati

- Atleti
- Allenatori
- Medici sportivi
- Societa' partner
- Iscrizioni atleti
- Fatture
- Ricevute
- Certificati medici

#### Moduli pianificati o in standby:

- Movimenti finanziari
- Generazione documenti
- Bandi regionali

## Stack tecnologico:

- React 19
- TypeScript
- Vite 7
- React Router 7
- Axios
- Tailwind CSS 4
- ESLint 9

## Requisiti locali

- Node.js `>= 22.18.0`
- npm

Versione consigliata per sviluppo locale:
- Node 24 (`.nvmrc`)

## Script disponibili

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm test
```

Nota:
- `npm test` e' ancora un placeholder
- i controlli reali oggi sono `lint`, `typecheck` e `build`

## Struttura del progetto

- `src/app/` bootstrap applicativo, router e catalogo moduli
- `src/features/` pagine e logica per dominio
- `src/shared/` API client, auth, config, tipi e componenti riusabili

File centrali:
- `src/app/router.tsx`
- `src/app/moduleCatalog.ts`
- `src/features/resources/resourceRegistry.ts`
- `src/shared/api/client.ts`
- `src/shared/api/createCrudService.ts`
- `src/shared/auth/AuthProvider.tsx`
- `src/shared/config/env.ts`

## Configurazione ambiente

Copia `.env.example` in `.env` e valorizza solo variabili non sensibili lato frontend.

Variabili attualmente supportate:

```dotenv
VITE_API_BASE_URL=
VITE_ENABLE_MOCK_AUTH=false
VITE_AUTH_LOGIN_PATH=
VITE_AUTH_REFRESH_PATH=

VITE_APP_NAME=ASD Management
VITE_ASSOCIATION_NAME=
VITE_APP_TAGLINE=
VITE_SUPPORT_EMAIL=
```

Linee guida:
- non inserire segreti, token, password o chiavi private
- le variabili `VITE_*` sono esposte al bundle frontend
- usare dati di branding e configurazione pubblica, non dati riservati

## Autenticazione

Il frontend supporta due modalita':

- mock auth, solo se `VITE_ENABLE_MOCK_AUTH=true`
- JWT reale con backend Django/DRF

Per il backend reale servono almeno:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_AUTH_LOGIN_PATH=auth/token
VITE_AUTH_REFRESH_PATH=auth/token/refresh
VITE_ENABLE_MOCK_AUTH=false
```

Il profilo autenticato viene recuperato tramite `users/me`.

## Convenzioni API

- `VITE_API_BASE_URL` deve puntare alla base API, ad esempio `.../api/v1`
- i path delle risorse nel frontend sono relativi a quella base
- le liste backend paginate vengono gia' normalizzate dal service layer

## Qualita' del codice

Controlli attuali:
- ESLint
- TypeScript typecheck
- build Vite

## Prossime Feature e miglioramenti:

- collegamento del frontend a backend dev con seed data
- verifica manuale dei moduli reali contro API non produttive
- valutazione eventuale di MSW per sviluppo isolato e test
- miglioramento UI per filtri, ricerca e paginazione
