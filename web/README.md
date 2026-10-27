# ALEEF Web

The website for pet owners. Next.js (App Router) + TypeScript.

Part of the [ALEEF monorepo](../README.md). It talks to [`../backend`](../backend/README.md).

## Features

- Home with your pets, alerts, quick actions, best doctors and store picks
- Find doctors (search, sort, **near me**, infinite scroll), doctor profile with reviews
- Booking: pick pet, day and time, reason and notes
- Appointments: upcoming card, history, details, cancel with a reason
- **Real-time chat** with doctors (text and photos)
- **Real-time notifications** (bell, popups) and unread badges
- Pet store: search, sort, product page, cart (kept in `localStorage`), checkout, orders
- Pets (add, edit, remove) and profile pages

## Stack

Next.js · React · TypeScript · CSS Modules (+ Bootstrap grid/utilities only) · TanStack Query · Socket.IO client · Zustand

## Quick start

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

The default `.env.example` turns on **mock mode** (`NEXT_PUBLIC_USE_MOCK=true`): every request returns fake data, so the whole app (including chat and notifications) works with no backend.

## Use the real backend

Edit `.env.local`:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `false` to call the real API |
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server. Optional: defaults to the API URL without `/api` |
| `NEXT_PUBLIC_DEMO_TOKEN` | Token of the demo account. Visitors without a session are signed in with it |

Route paths are in `src/config/endpoints.ts`.

> The demo token ships in the browser bundle (`NEXT_PUBLIC_`), so the backend must only let that account do harmless things.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | TypeScript check |

## How it is organised

```
src/
├── app/          pages (each folder is a URL) + globals.css (design tokens)
├── components/   one folder per component: Name.tsx + Name.module.css
├── hooks/        custom hooks: usePets, useChats, useCart ...
├── lib/api/      everything that talks to the backend (one file per resource)
├── context/      AuthContext (session + demo account), SocketContext
├── types/        shared TypeScript types
└── config/       routes, endpoints, env
```

Data flow: `Component → hook (TanStack Query) → lib/api function → backend`.

- Server Components by default; `"use client"` only where hooks or events are needed.
- There are no cookies: the token lives in `localStorage` and pages are protected by `AuthGuard`.
- The socket never talks to components directly: `SocketContext` turns events into **TanStack Query cache updates**, and components just read the cache.
- Colors, radius and shadows are CSS variables in `src/app/globals.css`.
