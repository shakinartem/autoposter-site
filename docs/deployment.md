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

### New linking flow

Telegram bot -> `POST /api/link/start` -> OAuth start -> Worker callback -> Telegram deep link -> bot sync

### Worker endpoints

- `POST /api/link/start`
- `GET /api/link/result`
- `GET /api/oauth/tiktok/start`
- `GET /api/oauth/tiktok/callback`
- `GET /api/oauth/meta/start`
- `GET /api/oauth/meta/callback`
- `GET /api/connections/status`
- `GET /api/connections/list`
- `GET /api/connections/token`
- `POST /api/connections/revoke`
- `GET /api/meta/accounts`
- `GET /api/meta/page`
- `GET /api/meta/debug`
- `GET /api/data-deletion`
- `GET /api/health`

## Required bindings

- `OAUTH_STATE_KV`
- `OAUTH_SESSION_KV`
- `APP_LINKS_D1`

## Worker env

See `workers/api/.env.example` for the non-secret worker variables.

## Required secrets

- `OAUTH_ENCRYPTION_SECRET`
- `APP_SESSION_SECRET`
- `TIKTOK_CLIENT_KEY`
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
- OAuth callbacks redirect to the Telegram bot when a `link_token` is present
- `POST /api/link/start` returns a `link_token`
- `GET /api/link/result` shows the current link state
- `GET /api/connections/list` returns connected accounts
- `GET /api/meta/page` returns page data for the requested page id
- Data deletion endpoint returns a safe response
- No secrets are present in the frontend repository

## Example curl checks

```bash
curl -H "Authorization: Bearer $SPGUTILS_API_TOKEN" \
  -X POST https://api.spgutils.ru/api/link/start \
  -H "Content-Type: application/json" \
  -d '{"telegram_user_id":"123456789","provider":"meta"}'

curl -H "Authorization: Bearer $SPGUTILS_API_TOKEN" \
  "https://api.spgutils.ru/api/link/result?link_token=replace-me"

curl -H "Authorization: Bearer $SPGUTILS_API_TOKEN" \
  "https://api.spgutils.ru/api/connections/list"

curl -H "Authorization: Bearer $SPGUTILS_API_TOKEN" \
  "https://api.spgutils.ru/api/meta/page?id=1010334898838942&connection_id=6"
```
