# SPG Utils

Production-ready foundation for `spgutils.ru`, built as a static-first Astro site with a Cloudflare Worker backend for OAuth, Telegram linking, account status, and data deletion flows.

## What this project includes

- EN default public site with RU route-based localization
- Product pages for VPN Bot and Autoposter
- Review-ready landing pages for TikTok and Meta, plus a Telegram-first linking flow in the Worker
- Legal pages for Privacy Policy, Terms of Service, and Data Deletion
- Cloudflare Worker API for OAuth state, token exchange, Telegram deep links, and persistence metadata
- SEO metadata, `robots.txt`, and `sitemap.xml`

## Tech stack

- Astro for the frontend
- TypeScript across frontend and Worker code
- Cloudflare Pages for static hosting
- Cloudflare Worker for API routes
- D1 for durable OAuth/account records
- KV for ephemeral OAuth state and session artifacts

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create local env files:

```bash
cp .env.example .env
```

3. Run the frontend:

```bash
npm run dev
```

4. Run the Worker locally:

```bash
npm run worker:dev
```

## Build

```bash
npm run build
```

## Deployment

### Cloudflare Pages

1. Connect the repository to Cloudflare Pages.
2. Set build command to `npm run build`.
3. Set build output directory to `dist`.
4. Add the `PUBLIC_*` environment variables, including `PUBLIC_TELEGRAM_BOT_USERNAME` for the review CTA.
5. Deploy the static site.

### Cloudflare Worker

1. Create a separate Worker for `workers/api`.
2. Bind the KV namespaces listed in `workers/api/wrangler.toml`.
3. Create the D1 database and apply `workers/api/schema.sql`.
4. Set all Worker secrets in Cloudflare, not in the repository.
5. Deploy with `npm run worker:deploy`.

## Environment variables

See `.env.example` for frontend values and `workers/api/.env.example` for Worker values. Do not store secrets in the repository.

## Manual setup required

- Register the real OAuth app credentials in TikTok and Meta consoles
- Replace placeholder auth/token URLs if your app configuration uses platform-specific endpoints
- Verify the final scope list before submitting for review
- Confirm the Worker base URL and redirect URIs match the deployed environment

## Review checklists

- `docs/review-tiktok.md`
- `docs/review-meta.md`
- `docs/console-setup.md`

## Notes

- The site is intentionally static-first.
- The Worker stores tokens server-side only.
- Review pages should never render access tokens in the browser.
