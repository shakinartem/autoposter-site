# Project Goal
- Build a production-ready, review-friendly website for `spgutils.ru`.
- Use a static-first frontend with a separate Cloudflare Worker API for OAuth and data deletion flows.
- Support EN by default and RU via route-based i18n.
- Prepare the foundation for product monetization, future products, and future platforms.

# Architecture Decisions
- Astro is the frontend framework because the site is content-heavy, SEO-sensitive, and should stay static-first.
- Cloudflare Pages will host the frontend build output.
- Cloudflare Workers will handle OAuth login/callback, token exchange, health, status, and deletion endpoints.
- D1 stores durable account/token metadata; KV stores ephemeral OAuth state and short-lived session artifacts.
- Route-based i18n is the main model: EN at root, RU under `/ru/...`.
- Review pages are intentionally public and static, but their auth and status flows are backed by the Worker.

# Todo
- [ ] Add a small client-side status refresher for review dashboards if live status visibility is needed.
- [ ] Wire real OAuth provider URLs and scopes after console registration.
- [ ] Optionally add pricing, subscription, and lead capture pages later.

# In Progress
- [x] Define architecture and stack.
- [x] Build the frontend scaffold.

# Done
- [x] Chose Astro + Cloudflare Pages + Workers + D1/KV.
- [x] Chose route-based i18n with EN default.
- [x] Scaffolded the Astro site with shared layout, navigation, and design system.
- [x] Implemented route-driven content pages for products, legal, status, and review flows.
- [x] Added EN and RU page content, including legal copy.
- [x] Implemented Cloudflare Worker OAuth/status/data-deletion endpoints.
- [x] Added robots.txt, sitemap.xml, review checklists, deployment notes, and console setup notes.
- [x] Added TikTok and Meta review entry points on the homepage.
- [x] Upgraded the homepage into a review hub with prominent TikTok and Meta spotlight cards.
- [x] Updated frontend OAuth and health links to the live Worker domain `api.spgutils.ru`.
- [x] Verified `npm run check` and `npm run build` locally.

# Next Steps
- Replace placeholder OAuth URLs and secrets with real console values.
- Decide whether to add live dashboard polling from `/api/tiktok/status` and `/api/meta/status`.
- Prepare Cloudflare Pages and Worker deployment targets.

# Notes / Risks
- Exact TikTok and Meta OAuth parameters can vary by product, app type, and review scope. The Worker should keep endpoints configurable via env vars rather than hardcoding assumptions.
- Some platform-specific permissions may need manual adjustment in the respective developer consoles before review submission.
- Build verification passed after installing dependencies locally.
