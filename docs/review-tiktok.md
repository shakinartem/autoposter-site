# TikTok Review Checklist

## Public site

- English default route loads at `/`
- Review landing page opens at `/review?tiktok=success`
- Telegram bot is the main account-linking interface
- Connect TikTok button starts OAuth at `https://api.spgutils.ru/api/oauth/tiktok/start`
- Successful return lands back on `/review`

## What the reviewer should see

- Clear product purpose
- OAuth login entry point that routes to the Worker
- Callback handling explanation
- Dashboard with safe connected-account state
- Main CTA to open the Telegram bot
- No access token or client secret in browser UI

## Backend checks

- Telegram bot should start the linking flow through `POST /api/link/start`
- `/api/oauth/tiktok/start` starts OAuth from the Worker
- Worker callback should finish on the server and return to the Telegram deep link when a `link_token` is present
- `state` is stored server-side in KV and expires quickly

## Before submission

- Verify TikTok app credentials in the console
- Confirm redirect URI matches the deployed Worker URL
- Confirm requested scopes match the product behavior
- Confirm the legal links are reachable from the review pages

## Notes

- Do not claim unsupported capabilities.
- Do not expose token values on the frontend.
- If the product is still limited, say so honestly on the page.
