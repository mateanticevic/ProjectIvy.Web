# Project Ivy

Personal tracking app for money, travel, and day-to-day records. It is a single-page React app that talks to the Ivy API and signs in through Keycloak.

Live: [ivy.anticevic.net](https://ivy.anticevic.net)

## What it covers

The home dashboard shows recent expenses, beer, movies, location, distance, and weight. The rest of the app is grouped the same way as the navigation bar.

| Area | Pages |
| --- | --- |
| Finance | Accounts, expenses, incomes, expense types |
| Travel | Flights, places, points of interest, tracking, routes, trips, cars |
| Other | Beer, calendar, inventory, journal, todos, calls, movies |

Features are shown according to the signed-in user’s scopes.

## Stack

- React 19 and TypeScript
- Vite
- Bootstrap 5 and react-bootstrap
- React Router
- Keycloak (`client_id=web`, realm `ivy`)
- SignalR for job updates
- API types generated from the Ivy OpenAPI spec

Dates use `moment`. The locale is Croatian and the week starts on Monday. API dates are `YYYY-MM-DD`. Light and dark theme is stored in `localStorage.theme` and applied with `data-bs-theme`.

## Requirements

- Node.js 26 or newer
- npm
- A host entry so the dev server is reachable as `local.anticevic.net` (the Vite allow-list only accepts that host)

## Local development

```bash
npm install
npm run dev
```

Open [http://local.anticevic.net:5173](http://local.anticevic.net:5173).

The dev server listens on `0.0.0.0` and proxies:

- `/api` → `https://api.anticevic.net`
- `/auth` → the Keycloak host configured in `vite.config.js`

Point `VITE_API_URL` at `/api` in `.env.local` so browser calls stay on the dev origin and go through that proxy. Auth still uses `VITE_AUTH_URL`.

## Environment

Values come from Vite env files (`.env`, `.env.local`, `.env.production`). Do not hardcode hosts in source.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Ivy API base URL. Use `/api` locally so the Vite proxy is used. |
| `VITE_AUTH_URL` | Keycloak base URL |
| `VITE_APP_URL` | This app’s public URL, used as the OAuth redirect |
| `VITE_ACCESS_TOKEN_COOKIE_DOMAIN` | Domain of the `AccessToken` cookie |
| `VITE_CDN_URL` | CDN for icons and media |
| `VITE_HUB_URL` | SignalR hub base URL |

Sign-in stores the access token in the `AccessToken` cookie. API calls send `credentials: 'include'` and clear that cookie on 401.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint on `ts`/`tsx` (warnings fail the run) |

There is no test runner.

## Layout

```
src/
  root.tsx            auth, theme, routes, toasts
  pages/<feature>/    one folder per route; entry is index.tsx
  components/         shared UI
  api/main/           one REST module per resource
  api/config.ts       get, post, put, patch, del, postFile
  api/hub/            SignalR (JobHub)
  types/ivy-types.ts  generated OpenAPI types
  types/              hand-written view models and filters
  styles/             global SCSS
```

Imports use the `src` aliases: `api/...`, `components`, `pages/...`, `types/...`, `utils/...`, `consts/...`, `contexts/...`.

Older list pages are class components that extend `Page`. Newer pages (`journal`, `todo`, `accounts`, `flights-v2`, and similar) are function components. New routes go in `src/root.tsx`; add a nav link in `src/components/navigation-bar.tsx` when the page should appear in the bar.

ESLint expects 4-space indent, single quotes, semicolons, and Unix line endings.

## API types

Regenerate types when the backend contract changes. Do not edit `src/types/ivy-types.ts` by hand.

```bash
npx openapi-typescript https://api.anticevic.net/swagger/v1/swagger.json --output src/types/ivy-types.ts
```

REST modules live in `src/api/main/` and are registered on the default export of `src/api/main/index.ts`. Type requests and responses from `components` and `paths` in `types/ivy-types`. Path strings are lowercase resource paths (`expense`, `journal/entry`), not the OpenAPI path keys.

## License

[MIT](LICENSE)
