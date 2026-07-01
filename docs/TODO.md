# Valar Website — TODO

**Last updated:** 2026-06-30 (post-SEO-audit — see `Valar website/SEO check/SEO audit 2026-06-30.md`)

> In each section, **open items (`[ ]`) are listed first, done items (`[x]`) below.** The fastest read on what's left for launch is the **Still to do** list under "Must-do before go-live."

## Must-do before go-live

### Still to do
- [ ] **Deploy** to Vercel (add env vars: `RESEND_API_KEY`, `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`) and merge `dev/lena` → `main`. This is the go-live step.

### Done
- [x] Logo update — from Replit
- [x] Amber-period signature — H1 hero headings end with amber `.` across pages
- [x] Disclosure page — built at `/disclosure` (Lena's own copy, not Ian's). Final read done 2026-06-30. Mortgage scope under Fundsmart FAP; investment regime to be added when Valar's own FAP investment licence lands (~Aug 2026)
- [x] Footer disclosure line — present (Lena's wording), linked to `/disclosure`
- [x] Footer dead links fixed — Knowledge Hub removed, Disclosure → `/disclosure`, YouTube icon removed
- [x] Testimonials — hidden behind `SHOW_TESTIMONIALS = false` until real consented quotes exist
- [x] Service card pattern — CTAs standardised across service pages
- [x] No dead links — full sweep 2026-06-30; two dead home `/insights` links removed, mobile "Get Updates" → `/subscribe`
- [x] SEO / metadata — unique titles, descriptions, canonical + OG per route
- [x] SEO / sitemap — `sitemap.ts`; `/disclosure` added 2026-06-30 (16 live routes; `/insights` excluded while deferred)
- [x] SEO / robots — `robots.ts` (Disallow `/api/`, sitemap directive)
- [x] SEO / JSON-LD schema — Organization + WebSite, FinancialService/LocalBusiness (home), Person (About), BreadcrumbList (services), FAQPage (5 service pages)
- [x] SEO / E-E-A-T — FSP1010055 on home, AdviserCredentialStrip on all service pages
- [x] SEO / GA4 — consent-gated (`G-EKZTGV6R58`), fires only after Accept
- [x] SEO / cookie consent banner — Accept/Decline, GA gated behind consent

## Polish

- [ ] Responsive QA — mobile, tablet, desktop
- [ ] Accessibility pass — contrast, focus states, aria labels, keyboard nav
- [ ] Performance — image optimization (D2) **DEFERRED for launch by decision 2026-06-30**; leave `unoptimized` Images + PNG heroes as-is, revisit post-launch
- [ ] Animations — verify Framer Motion transitions are consistent
- [ ] Brand / content audit — compare each page's copy against Lena's source `.md` files for drift *(separate task, not a launch blocker)*
- [x] 404 page — built (`not-found.tsx`), links to valid routes

## Later — when content is ready

- [ ] First Home Buyer Guide PDF — confirmation email flow is set up; Lena to finalise the guide and upload the final PDF to GitHub
- [ ] Insights / Knowledge Hub — unhide `/insights` (remove `notFound()`) and replace placeholder articles (~2-week project, post-launch)
- [ ] Individual article pages — build `/insights/[id]` routes
- [ ] Calculators & FAQs — build pages (currently hidden in navbar)
- [ ] Bank logo permissions for homepage
- [ ] Disclosure — add Valar investment/KiwiSaver regime when the FAP investment licence lands (~Aug 2026)

## Blocked on Lena

### Still to do
- [ ] Testimonials — real client quotes (section stays hidden until these arrive)

### Done
- [x] Portrait photo (About + Book pages)
- [x] Real NZ photography for hero/section images
- [x] Disclosure text — written by Lena (not Ian); built + final read 2026-06-30
- [x] LinkedIn URL — personal LinkedIn added (About + Person schema)
- [x] About — verified qualifications
- [x] About — personal note (farm/family) — decided
- [x] Investment advice scope — resolved (mortgage adviser via Fundsmart; investment adviser under Valar). Disclosure text update tracked under "Later" (~Aug, when licence lands)
