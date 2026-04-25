# Meta Review Checklist

## Public site

- English default route loads at `/`
- Review landing page opens at `/review?meta=success`
- Connect Meta button starts OAuth at `https://api.spgutils.ru/api/oauth/meta/start`
- Successful return lands back on `/review`

## What the reviewer should see

- Clear use case and product intent
- OAuth login entry point that routes to the Worker
- Permissions explanation that matches actual behavior
- Dashboard with safe connected-account state
- Legal links and data deletion path

## Backend checks

- `/api/oauth/meta/start` starts OAuth from the Worker
- Worker callback should finish on the server and return to `/review?meta=success`
- If configured, the Worker can upgrade to a longer-lived token server-side

## Before submission

- Verify Meta app credentials in the console
- Confirm redirect URI matches the deployed Worker URL
- Confirm permissions are actually requested and justified
- Confirm legal pages and deletion page are public and reachable

## Notes

- Do not suggest unsupported APIs.
- Do not reveal tokens or secrets in browser-rendered output.
- Keep the dashboard focused on safe metadata and operational state.
