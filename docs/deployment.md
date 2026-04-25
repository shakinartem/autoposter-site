# Deployment Guide

## Frontend

1. Deploy the Astro project to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add the `PUBLIC_*` environment variables.
5. Verify `https://spgutils.ru` serves the static site.

## Worker

1. Create a separate Cloudflare Worker for `workers/api`.
2. Bind the KV namespaces and D1 database from `workers/api/wrangler.toml`.
3. Create the D1 schema using `workers/api/schema.sql`.
4. Store OAuth secrets using `wrangler secret put` or the Cloudflare dashboard.
5. Deploy the Worker to the `api.spgutils.ru` hostname or equivalent route.

## Required bindings

- `OAUTH_STATE_KV`
- `OAUTH_SESSION_KV`
- `APP_LINKS_D1`

## Required secrets

- `OAUTH_ENCRYPTION_SECRET`
- `APP_SESSION_SECRET`
- `TIKTOK_CLIENT_ID`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_AUTH_URL`
- `TIKTOK_TOKEN_URL`
- `TIKTOK_SCOPES`
- `TIKTOK_REDIRECT_URI`
- `META_APP_ID`
- `META_APP_SECRET`
- `META_AUTH_URL`
- `META_TOKEN_URL`
- `META_LONG_LIVED_TOKEN_URL`
- `META_SCOPES`
- `META_REDIRECT_URI`

## Final checks

- Review pages open without 404s
- `/api/health` returns `ok: true`
- OAuth callbacks redirect back to the dashboard
- Data deletion endpoint returns a safe response
- No secrets are present in the frontend repository
