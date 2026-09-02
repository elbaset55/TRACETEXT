# Base44 Dev Environment

## Stack
Vite 7 + React 19 (wouter router) frontend, TailwindCSS v4. Express server in `server/index.ts` is production-only (serves built `dist/public`); dev mode runs `vite --host` directly on port 3000.

## Run
```
docker compose -f docker-compose.base44.yml up -d
```
The `web` service (node:22) bind-mounts the repo, runs `pnpm install --frozen-lockfile`, then `pnpm dev` (Vite dev server with live reload on port 3000). node_modules is an anonymous volume so installs persist across restarts.

## Notes
- No external secrets required to boot. The app (TRACETEX material trace console) persists data in `localStorage` (`STORAGE_KEY = "tracetex-local-ledger-v1"`).
- Optional env vars exist but are NOT needed for the main page: `VITE_FRONTEND_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL` (Google Maps via Manus forge, used only in `client/src/components/Map.tsx`), `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` (OAuth login URL in `client/src/const.ts`, not wired into the UI). `BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY` power the `/manus-storage` storage proxy in the Vite config (only errors if that route is hit).
- `vite.config.ts` `allowedHosts` is set to `true` so the preview's external hostname is accepted.
- The index.html references Manus analytics placeholders (`%VITE_ANALYTICS_ENDPOINT%`); the warnings in logs are harmless.

## Verify
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the HTML app.
- Healthcheck curls `http://localhost:3000/`.
