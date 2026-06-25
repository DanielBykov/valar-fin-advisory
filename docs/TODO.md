# Valar Website — TODO

## Must-do before go-live

- [x] Logo update — from Replit
- [x] Amber-period signature — verify H1 hero headings end with amber `.` across all pages
- [ ] Footer disclosure line — add "Lena Bykova trades as Valar Financial Advisors. FSP1010055. FAP: Fundsmart Mortgages and Finance." linked to `/disclosure` (waiting on Ian's content)
- [ ] Disclosure page — create `/disclosure` route and page (blocked on Ian's content)
- [x] Fix footer dead links:
  - [x] Knowledge Hub → removed (was commented out)
  - [x] Disclosure Statement → removed until `/disclosure` content is ready
  - [x] YouTube icon → removed (commented out)
- [ ] Testimonials — hide or mark as placeholder until real quotes arrive
- [ ] Brand / content audit — compare each page's copy against Lena's source `.md` files for drift
- [ ] Service card pattern — verify all service pages have consistent CTAs
- [x] SEO / metadata — page titles, descriptions, canonical and OG tags for each route
- [x] SEO / sitemap — `src/app/sitemap.ts` auto-generates `/sitemap.xml`
- [x] SEO / robots — `src/app/robots.ts` with `Disallow: /api/` and sitemap directive
- [x] SEO / JSON-LD schema — Organization + WebSite (layout), FinancialService/LocalBusiness (home), Person (About), BreadcrumbList (services)
- [x] SEO / E-E-A-T — FSP1010055 on home, AdviserCredentialStrip on all service pages
- [ ] SEO / GA4 — install once Lena provides measurement ID (paired with cookie consent banner)
- [ ] SEO / cookie consent banner — required before GA4 activates
- [x] Deployment — Vercel setup with env vars (RESEND_API_KEY, MAILERLITE_API_KEY, MAILERLITE_GROUP_ID)

## Polish

- [ ] Responsive QA — mobile, tablet, desktop
- [ ] Accessibility pass — contrast, focus states, aria labels, keyboard nav
- [ ] Performance — image optimization, lazy loading, Lighthouse audit
- [ ] 404 page — review and align with brand
- [ ] Animations — verify Framer Motion transitions are consistent

## Later — when content is ready

- [ ] First Home Buyer Guide PDF — attach to Resend email in `src/app/api/guide-request/route.ts`
- [ ] Insights / Knowledge Hub — unhide `/insights` (remove `notFound()`) and replace placeholder articles
- [ ] Individual article pages — build `/insights/[id]` routes
- [ ] Calculators & FAQs — build pages (listed in navbar but don't exist)

## Blocked on Lena

- [ ] Portrait photo (About + Book pages)
- [ ] Real NZ photography for hero/section images
- [ ] Disclosure text from Ian
- [ ] Testimonials — real client quotes
- [ ] First-Home Buyer guide PDF
- [ ] Bank logo permissions for homepage
- [ ] LinkedIn URL + confirm socials (YouTube currently dead)
- [ ] About — verified qualifications
- [ ] About — personal note (farm/family) include or not
- [ ] Financial Planning scope — confirm licensing or soften wording
