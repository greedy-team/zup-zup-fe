# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

세종 줍줍 (Sejong ZupZup) — a map-based lost-and-found web service for Sejong University. Users can register found items on a Kakao Map and go through a multi-step flow to claim lost items.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Typecheck then Vite production build
npm run lint         # ESLint
npm run typecheck    # tsc type checking only
npm run test         # Vitest (watch mode)
npm run coverage     # Vitest with v8 coverage report
npm run check        # lint + typecheck + test (what CI runs)
```

Run a single test file:
```bash
npx vitest run src/tests/find/FindLayout.test.tsx
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL |
| `VITE_KAKAO_MAP_API_KEY` | Kakao Maps JavaScript API key |

## Architecture

### Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7** — file-based routing
- **TanStack Query v5** — server state, query/mutation hooks
- **Zustand v5** — client-side global state (auth, admin)
- **React Context** (`AppContexts.tsx`) — shared UI state across the map/sidebar
- **MSW v2** — API mocking (browser worker + node server for tests)
- **Vitest** + **Testing Library** — unit/integration tests with jsdom
- **IndexedDB (idb)** — persists register form draft across page reloads

### Path Alias

`@` maps to `/src`. Use `@/component/...`, `@/api/...`, etc.

### Routing Structure (`src/App.tsx`)

```
RootLayout (Sidebar + main outlet)
├── /                           → MainPage (map + lost item list)
├── /login                      → LoginPage
├── /find/:lostItemId           → FindLayout
│   ├── info                    → FindInfo (item brief)
│   ├── quiz                    → FindQuiz (identity quiz, valuable items only)
│   ├── detail                  → FindDetail (full detail + images)
│   ├── pledge                  → FindPledge (pledge agreement)
│   └── deposit                 → FindDeposit (pickup location)
├── /register/:schoolAreaId     → RegisterLayout
│   ├── category                → RegisterCategory
│   ├── details                 → RegisterDetails
│   └── review                  → RegisterReview
├── /mypage                     → MyPage
├── /more                       → MorePage
└── /more/team                  → AboutTeamPage
/admin                          → AdminPage (outside RootLayout)
```

**Find flow**: valuable items follow `info → quiz → detail → pledge → deposit`; `categoryId === 11` (ETC) skips quiz and uses `info → detail → pledge → deposit`. The flow is determined by `ETC_CATEGORY_ID` in `src/constants/find/index.ts`.

**Register flow**: 3-step wizard (`category → details → review`) managed by `useRegisterLayout` / `useRegisterProcess`. Form state is persisted to IndexedDB via `src/utils/register/registerStorage.ts`.

### API Layer (`src/api/`)

- `src/api/common/apiClient.ts` — `apiFetch<T>()` base client (adds `Content-Type`, `credentials: 'include'`, throws `{ status, data }` on errors)
- `src/api/common/querySetting.ts` — `defaultQueryRetry` (retries on 5xx, not 4xx)
- `src/api/common/apiErrorToast.ts` — `showApiErrorToast` for mutation `onError`
- Domain modules: `src/api/{find,auth,admin,mypage}/index.ts` with TanStack Query hooks in `hooks/`
- **Note**: `src/api/register/index.ts` uses raw `fetch` (not `apiFetch`); `src/apis/main/mainApi.tsx` is a separate older module

### State Management

| Store | Location | Persistence |
|---|---|---|
| Auth flag (`isAuthenticated`) | `src/store/authStore.ts` (Zustand) | sessionStorage |
| Admin state | `src/store/adminStore.ts` (Zustand) | none |
| Map/UI state (categories, items, selected area/mode, modals) | `src/contexts/AppContexts.tsx` (React Context) | none |
| Register form draft | `src/utils/register/registerStorage.ts` (IndexedDB) | persisted |

`AppContexts.tsx` exports individual contexts (`CategoriesContext`, `SelectedModeContext`, etc.) — each consumed via `useContext` with a non-null assertion.

`SelectedMode` (`find | register | mypage | more`) drives sidebar active state and is updated by the `Sidebar` component on route change.

### Testing Setup (`src/tests/setup.ts`)

- Global MSW node server with handlers for all major endpoints
- `fake-indexeddb/auto` polyfills IndexedDB in jsdom
- `ResizeObserver` and `matchMedia` polyfilled
- `server` is exported so individual tests can override handlers via `server.use(...)`
- Tests live in `src/tests/` mirroring feature structure (`find/`, `register/`, `main/`)
- Test utilities: `src/tests/utils/renderFind.tsx`

### MSW Mocks (`src/mocks/`)

- Browser worker: `src/mocks/browser.ts` (used in dev via `public/mockServiceWorker.js`)
- In-memory DB: `src/mocks/db/` with seeds in `src/mocks/seeds/`
- Handlers in `src/mocks/handlers/` per domain

### Map Integration

Kakao Maps is loaded as a script tag in `index.html`. Types come from `@types/kakaomaps` + augmentations in `src/types/kakao-augment.d.ts`. Map hooks live in `src/hooks/map/`.

### CI/CD

GitHub Actions (`.github/workflows/prod-ci.yml`) on push to `main`: runs `npm run check`, then `vite build`, deploys to AWS S3, and invalidates CloudFront.
