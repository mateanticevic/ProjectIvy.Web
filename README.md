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
| `npm run test:e2e` | Run the Chromium browser suite |
| `npm run test:e2e:ui` | Debug browser tests in Playwright UI |
| `npm run test:e2e:report` | Open the last HTML report |
| `npm run test:e2e:types` | Type-check the test suite and configuration |

## Browser tests

Use Node 26 or newer. Install the Chromium browser once after installing dependencies:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

On Linux, use `npx playwright install --with-deps chromium` to install system dependencies too.

Playwright starts its own Vite server at `http://127.0.0.1:4173` in `e2e` mode. Keep that port free; an existing development server is deliberately not reused. No host entry or running Ivy API/Keycloak instance is needed. The server receives test-specific API, auth, hub, app URL and cookie-domain values; regular development and production environment values are unchanged. Test mode disables Vite hot reload and its WebSocket connection.

The suite seeds a synthetic login cookie and a representative user, fixes browser time to 3 October 2026, and uses the Europe/Zagreb timezone. Each test has a fresh browser context. All Ivy API responses come from synthetic fixtures; unhandled resources, methods, query parameters, auth/hub traffic, and live backend requests are blocked and fail the test. Vite dev-client probes of its disabled HMR socket are closed without being treated as backend traffic. Google Maps and Google Charts remain real and require internet access and working Google configuration. App styles, icons, and CDN media also remain real. Google-dependent failures are not skipped or hidden.

Current implemented routes have direct-navigation smoke tests, including calendar variants and car/trip details. The suite also checks navigation, theme persistence, mock isolation, and the network guard. Legacy flights/tracking pages, the unimplemented `/account` route, OAuth flows, editing workflows, visual snapshots, and SignalR jobs are excluded.

### Debugging and maintenance

```bash
npm run test:e2e:ui
npm run test:e2e -- --grep 'renders /journal'
npm run test:e2e -- --headed --workers=1
npm run test:e2e:report
npm run test:e2e:types
npx eslint e2e playwright.config.ts --max-warnings 0
```

Failed tests retain screenshots and traces in `test-results/`; the HTML report is in `playwright-report/`. Open a trace with `npx playwright show-trace <trace.zip>`. Browser exceptions and unexpected backend requests are attached to the report as JSON diagnostics. These output directories are ignored by Git.

To add a page:

1. Add synthetic records in `e2e/data.ts`, checked with `satisfies` against generated API schemas or existing view models. Do not copy personal API data or real access tokens into fixtures.
2. Add its initial endpoint responses to `e2e/scenarios.ts`. Resources and query keys are normalized to lowercase; explicitly list allowed query keys and required values when they select different responses. Every registered response must be requested at least once. `minimumCalls` can verify repeated calls.
3. Add a route entry in `e2e/smoke.spec.ts` with an assertion for loaded page content or controls. For Google Maps pages, also require the real Map region; Google Charts pages require their rendered chart. Avoid sleeps, `networkidle`, and checks that only prove the navbar appeared.
4. Run the new test, test type checking, and test-file lint. API changes require updating fixtures alongside regenerated API types; the suite cannot verify backend compatibility.

Azure Pipelines installs Node 26 and Chromium, runs the suite with two workers and one retry, publishes JUnit results plus HTML/trace artifacts, and only builds/pushes Docker images after the test stage passes. Local runs have no retries.

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
