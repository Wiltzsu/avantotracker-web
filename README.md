# AvantoTracker Web

React frontend for tracking ice baths. Connects to a Laravel backend via an API.

API repo: https://github.com/Wiltzsu/avantotracker-api

## Live demo

- Website: https://www.avantotracker.com
- API: https://api.avantotracker.com

## Local setup

1. Copy `.env.example` to `.env.local` (or `.env`) and set `VITE_API_URL`.
2. Install dependencies: `npm ci`
3. Start dev server: `npm run dev`
4. Run tests: `npm test`

Example:

```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

## Features

- React SPA with protected routes
- Session restore via `/api/me` on load
- Login and logout with Bearer tokens (registration disabled)
- History filters, CSV export, personal records, mood chart, optional selfies
- Create, edit, delete, and browse avanto entries
- PWA manifest for install/add-to-home-screen

## Tech

- React + React Router
- Vite
- Axios (API client with auth interceptors)
- Vitest + Testing Library
