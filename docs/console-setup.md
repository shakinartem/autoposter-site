# Console Setup Notes

## TikTok console

- Create an app in the TikTok developer console.
- Register the OAuth redirect URI used by the Worker.
- Configure the scopes you actually need for the product.
- Verify the app review requirements for the current product type.
- Replace the placeholder TikTok auth/token URLs only if your official app flow requires a different endpoint.

## Meta console

- Create an app in Meta for Developers.
- Register the OAuth redirect URI used by the Worker.
- Configure permissions only if they are necessary for the real product behavior.
- Verify whether a long-lived token exchange is appropriate for the specific app flow.
- Ensure the app has the correct platform connections for Pages, Instagram, or other authorized assets.

## Manual replacements

- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REDIRECT_URI`
- `TIKTOK_SCOPES`
- `META_APP_ID`
- `META_APP_SECRET`
- `META_REDIRECT_URI`
- `META_SCOPES`
- `BASE_URL`
- `FRONTEND_URL`
- `BOT_USERNAME`
- `PUBLIC_SITE_URL`
- `PUBLIC_TELEGRAM_BOT_USERNAME`
- `SUPPORT_EMAIL`
- `STATUS_EMAIL`

## Review-time reminders

- Never place secrets in the frontend repository.
- Never show raw tokens in review pages.
- Keep the public review pages honest about what is supported now versus planned later.
