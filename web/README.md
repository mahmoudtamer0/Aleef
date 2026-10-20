# ALEEF web

Next.js (App Router) + TypeScript + CSS Modules. Bootstrap is used only for its grid and helper classes.
Auth is a token in localStorage (no cookies).

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_USE_MOCK=true works without a backend
npm run dev
```

## Folders
| Folder | What lives there |
|---|---|
| `src/app/` | Pages. Each folder is a URL. `globals.css` holds the colors/fonts (CSS variables). |
| `src/components/` | One folder per component: `Name.tsx` + `Name.module.css`. |
| `src/hooks/` | Custom hooks: `usePets`, `useBestDoctors`, `useAuth`... |
| `src/lib/api/` | Everything that talks to the backend (axios client + one file per resource). |
| `src/lib/` | `storage.ts` (localStorage), `mock.ts` (fake data), `utils.ts`. |
| `src/context/` | `AuthContext` (who is logged in, demo account logic). |
| `src/types/` | The shape of User, Pet, Doctor, Product. |
| `src/config/` | `routes.ts`, `endpoints.ts`, `env.ts`. |

Data flow: `PetsHero.tsx` -> `usePets()` -> `getPets()` in `lib/api/pets.ts` -> backend.

## Server vs client components
- Default is a Server Component. Add `"use client"` only for hooks, events or browser APIs.
- No cookies, so anything that needs the logged-in user's data is fetched in a client component.
- Server: pages, `(user)/layout.tsx`, `QuickActions`, `FreeVisitCard`, `SectionHeader`, `DoctorCard`, `ProductCard`.
- Client: `AuthGuard`, `Navbar`, `UserMenu`, `DemoBanner`, `PetsHero`, `BestDoctors`, `PetEssentials`, `CareTip`.

## Styling rules
- Colors, radius and shadows are CSS variables in `app/globals.css`: use `var(--brand-600)` instead of a hex.
- Each component styles itself in its own `.module.css`.
- Bootstrap helpers (`row g-4`, `col-lg-3`, `d-flex`, `justify-content-between`) are fine for layout.

## Connecting the real backend
1. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`.
2. Edit `src/config/endpoints.ts`.
3. Edit the `to*` functions in `src/lib/api/*.ts` (the only places that know the backend response shape).
