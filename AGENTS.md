# ivy-web

Personal tracking SPA (expenses, trips, beer, calendar, tracking, and related pages). React 19, TypeScript, Vite, Bootstrap 5, and react-bootstrap. Data comes from the Ivy API; auth is Keycloak (`client_id=web`).

## Commands

- `npm run dev` — Vite dev server. Proxies `/api` to `https://api.anticevic.net` and `/auth` to the local Keycloak host. Allowed host: `local.anticevic.net`.
- `npm run build` — production build to `dist/`.
- `npm run lint` — ESLint on `ts`/`tsx`, max warnings 0. There is no test runner.

Requires Node `>=26`.

Regenerate API types after the backend contract changes. Do not edit the output by hand:

```bash
npx openapi-typescript https://api.anticevic.net/swagger/v1/swagger.json --output src/types/ivy-types.ts
```

## Layout

- `src/root.tsx` — auth bootstrap, theme, routes, toasts.
- `src/pages/<feature>/` — one folder per route. Entry is `index.tsx`.
- `src/components/` — shared UI. Re-export from `src/components/index.ts` when a component is used across pages.
- `src/api/main/` — REST modules, one file per resource, registered on the default export of `src/api/main/index.ts`.
- `src/api/config.ts` — `get`, `post`, `put`, `patch`, `del`, `postFile`. All REST calls go through these.
- `src/api/hub/` — SignalR (`JobHub`).
- `src/types/ivy-types.ts` — generated OpenAPI types. ESLint ignores this file.
- `src/types/` — hand-written view models and filter shapes that are not in the API schema.
- `src/utils/`, `src/consts/`, `src/contexts/`, `src/styles/`.

Import from the `src` aliases (`api/...`, `components`, `pages/...`, `types/...`, `utils/...`, `consts/...`, `contexts/...`).

## API modules

Add a resource as `src/api/main/<resource>.ts`, default-export an object of functions, and register it in `src/api/main/index.ts`.

Type requests and responses from `components` and `paths` in `types/ivy-types`. Path strings are lowercase resource paths (`expense`, `journal/entry`), not the OpenAPI path keys.

```ts
import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type Expense = components['schemas']['Expense'];
type GetExpenseQuery = paths['/Expense']['get']['parameters']['query'];

const get = (filters?: GetExpenseQuery): Promise<Expense> => api.get('expense', filters);
```

## Pages

Match the style of the file you are editing.

- Older list pages are class components that extend `Page` in `src/pages/page.tsx`. Keep that when changing them. Use `resolveFilters` and `pushHistoryState` so filters stay in the query string.
- Newer pages (`journal`, `todo`, `accounts`, `flights-v2`, and similar) are function components with hooks. Use that for new pages.
- Layout and controls come from `react-bootstrap`. Global styles live in `src/styles/styles.scss` and `overrides.scss`. Prefer Bootstrap utilities and existing classes over new CSS.
- Dates use `moment`. The app locale is `hr` and the week starts on Monday. API dates are `YYYY-MM-DD`.
- Theme is `light` | `dark` on `document.documentElement` (`data-bs-theme`) and `localStorage.theme`.
- A new route goes in `src/root.tsx`. Add a nav link in `src/components/navigation-bar.tsx` when the page should be reachable from the bar.

## Style

ESLint enforces 4-space indent, single quotes, semicolons, and Unix line endings. `noImplicitAny` is off; still type API payloads and component state.

## Env

Read config from `import.meta.env`. Do not hardcode hosts.

`VITE_API_URL`, `VITE_AUTH_URL`, `VITE_APP_URL`, `VITE_ACCESS_TOKEN_COOKIE_DOMAIN`, `VITE_CDN_URL`, `VITE_HUB_URL`.

The access token is the `AccessToken` cookie. `src/api/config.ts` sends `credentials: 'include'` and clears that cookie on 401.
