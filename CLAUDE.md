# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Knowledge Graph

`graphify-out/` exists. For **any question about the codebase** (architecture, data flow, where X is defined, what calls Y), run `graphify query "<question>"` first before reading files manually.

## Project Overview

**Projektkompass Kommune** — an intercommunal funding-scouting platform ("Interkommunale Förderscouting-Plattform Nordfriesland") built under Germany's *Heimat 2.0* initiative. The frontend is a Vue 2 + Quasar 1.x SPA that talks to a **Strapi v4** backend.

**Important:** A Vue 3 / Quasar 2 migration plan exists in `UPGRADE_PLAN_FE.md`. When making architectural decisions or adding new patterns, prefer approaches that ease this future migration (avoid new Vue 2-only patterns where possible).

## Commands

```bash
# Install dependencies (prefer yarn)
yarn install

# Development server (port 8080, opens browser automatically)
quasar dev

# Production build (output: dist/spa/)
quasar build

# Preview production build locally
npx http-server dist/spa

# Lint
yarn lint

# Extract i18n keys (sync keys from .vue files to src/i18n/)
npx vue-i18n-extract
```

> Requires Node >= 18.17 and the Quasar CLI globally installed (`npm install -g @quasar/cli`).

## Environment

Two env files control the API URL and other runtime values:

| File | Used when |
|------|-----------|
| `.env.dev` | `quasar dev` |
| `.env` | `quasar build` |

Key variable: `VUE_APP_MAIN_URL` — the base URL of the Strapi backend (e.g. `http://localhost:1337` locally, `https://api.foerderscouting-plattform.de` in production). The AI proxy endpoint is separately configured via `VUE_APP_AI`.

## Architecture

### Tech stack
- **Vue 2** (Options API throughout — no Composition API)
- **Quasar 1.x** for UI components, layout, and the build system (`quasar.conf.js` instead of `vite.config` / `webpack.config`)
- **Vuex** (modular store, persisted to `sessionStorage` under the key `amt-viot`)
- **Vue Router** (history mode, auth guard via `meta.requireAuth`)
- **vue-i18n 8.x** — translations are loaded at boot from the Strapi backend (`/api/translations`), default locale `de`
- **Axios** — a configured `api` instance (baseURL = `VUE_APP_MAIN_URL`) is exported from `src/boot/axios.js` and attached to `Vue.prototype.$api`

### Entry points
- `quasar.conf.js` — all build, dev-server, PWA, and framework config
- `src/boot/` — Quasar boot files run before the app mounts: `axios.js` (sets up the API instance + auth interceptor), `i18n.js` (loads translations from Strapi), `dateFormatter.js`
- `src/App.vue` → `src/layouts/` → `src/pages/`

### Layouts
| File | Purpose |
|------|---------|
| `src/layouts/MainLayout.vue` | Public pages (landing, login, documents, Impressum) |
| `src/layouts/dashboardLayout.vue` | All authenticated pages; contains the left nav drawer, header, dark-mode toggle, language switcher |

### Routing (`src/router/routes.js`)
- `/` → `MainLayout` (landing, reset-password, impressum, datenschutz, documents)
- `/dashboard`, `/overview`, `/watchlist`, `/catkeytags`, `/Administation/*`, `/states`, `/federal-states`, `/stats`, `/translations`, `/application/process/*`, `/email-center` → `dashboardLayout` (most require `requireAuth: true`; admin-only ones additionally use `requireAdmin: true`)
- `/user/*` → `dashboardLayout` (user profile, project/funding create-edit-view flows)

Route guard in `src/router/index.js` redirects unauthenticated users to `/` for any route with `meta.requireAuth`.

### Vuex store (`src/store/`)
Each subdirectory is a named module with its own `state.js / actions.js / mutations.js / getters.js`:

| Module | Responsibility |
|--------|---------------|
| `userCenter` | Auth (login/logout/forgot password), current user, user list, data overview, watchlists. Getters: `isSignedIn`, `isAdmin`, `isGuest`, `isLeader` |
| `project` | Project ideas + application process (CRUD, file/media upload, watchlist, archive, duplicate, dashboard stats) |
| `funding` | Funding records (CRUD) |
| `ai` | AI-assisted funding matching and questions (proxied through the Strapi backend) |
| `category` / `tag` | Lookup lists for project categorisation |
| `municipality` | Municipality / administrative area data |
| `federalState` | Federal states data |
| `general` | Placeholder (no actions) |
| `errorDialog` | App-level error display |

**Persistence:** the entire store is persisted to `sessionStorage` on every mutation via `vuex-persistedstate`.

### API layer
All HTTP calls go through the `api` instance from `src/boot/axios.js`. The request interceptor injects `Authorization: Bearer <jwt>` for all routes except `/api/auth/local`. The response interceptor auto-logs out the user on 401/token-related 403 errors.

### Services & mixins
- **`src/services/translationService.js`** — CRUD for Strapi translation entries (`fetchTranslationsByLocale`, `createTranslation`, `updateTranslation`). Imported directly (not via Vuex) where translation management UI is needed.
- **`src/mixins/htmlSanitizer.js`** — DOMPurify-based mixin with `sanitizeHtml()`, `sanitizeHtmlStrict()`, and `stripHtml()` methods. **Always use this mixin with `v-html`** to avoid XSS. Mix it into any component that renders user-provided or Strapi-sourced HTML content.

### Local library
`src/libs/vue-html2pdf` — vendored Vue 2 component for PDF export. Has no Vue 3 equivalent; slated for replacement with `jspdf` + `html2canvas` in the upgrade plan.

### Translations
Translations live in Strapi and are fetched at boot with pagination. The `vue-i18n-extract` tool (`vue-i18n-extract.config.js`) and `vue-translation-manager` (`.vue-translation.js`) assist in keeping keys in sync; extracted keys are stored in `src/i18n/`.

**Adding/editing translation keys — always in this order:**
1. Add/edit the key in this repo's `src/i18n/de/index.json` and `src/i18n/en-us/index.json` (these are the source of truth for what the FE expects).
2. Copy the same key/value into the BE repo's `de.json` (locale `de`) and `en.json` (locale `en` — note: BE locale code is `en`, not `en-us`) at the repo root of `Forderscouting-Plattform-API`.
3. Run the BE's `import_translations2.js` importer to push new keys into Strapi's `translations` table. It prompts you to pick a target environment (local/dev/stage/prod — prod requires re-typing "prod" to confirm) and logs in itself using `TRANSLATE_EMAIL_AUTH_<ENV>` / `TRANSLATE_EMAIL_PASS_<ENV>` from `.env` to get a JWT. It skips keys that already exist, so it's safe to rerun.

### User roles
The application distinguishes four roles checked via `userCenter` getters: `admin`, `leader`, `guest`, and regular authenticated users. Navigation visibility and feature access are gated by these roles.

### Components structure
Components under `src/components/` are organised by domain: `funding/`, `projects/`, `Municipality/`, `States/`, `FederalStates/`, `applicationProcess/`, `categoriesKeywords/`, `data/`, `dataOverview/`, `dialogs/`, `network/`, `projectDashboard/`, `stats/`, `translations/`, `user/`, `watchlist/`.

## Versioning & Changelog

Both this repo (`Forderscouting-Plattform`) and the backend (`Forderscouting-Plattform-API`) share one version number, following SemVer (`MAJOR.MINOR.PATCH`):

- **MAJOR** — a big change to how the platform works or looks (e.g. a redesigned page or flow).
- **MINOR** — a new feature users will notice.
- **PATCH** — a fix or small tweak; nothing new for a user to learn.

As soon as a user-facing change is built and working — regardless of whether it has been pushed to GitHub, merged, or deployed yet — do this before considering the work done:
1. Bump `version` in **both** repos' `package.json` to the same new value.
2. Add one entry to `CHANGELOG.md` (this repo's root) for that version, with both a `### de` and `### en` bullet list, written in plain language for a municipal-staff end user — no file names, function names, or ticket numbers (those stay in `TICKETS.md`).
3. If a change wouldn't be visible or meaningful to that user (internal refactor, config change, dev-only fix), it does **not** need a version bump or changelog entry — it only needs a `TICKETS.md` entry if one is otherwise warranted.

This is not tied to deployment status — local, uncommitted, or unpushed work still gets versioned and logged the moment it's functionally complete, so the version number and changelog always reflect what has actually been built, not what has shipped to production.

The in-app "?" help panel (`src/layouts/dashboardLayout.vue`) renders `CHANGELOG.md` in a "What's New" card via `src/services/changelogService.js`, picking the `de`/`en` bullets based on the active locale.

## Coding conventions
- Vue 2 Options API only — no `<script setup>` or Composition API
- ESLint config extends `plugin:vue/essential` + `prettier` (run via `yarn lint`)
- Icons: Material Icons + MDI v5 (`mdi-v5`)
- Quasar Notify (`$q.notify` / `Notify.create`) is used for all user-facing success/error feedback
- Notification messages in German throughout (`erfolgreich`, `gelöscht`, etc.)
- All user-generated or backend-sourced HTML rendered with `v-html` must be passed through `sanitizeHtml()` from the `htmlSanitizer` mixin
- No tests are currently configured (`"test": "echo \"No test specified\" && exit 0"`)
