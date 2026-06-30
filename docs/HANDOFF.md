# Website Handoff Notes — for Daniel

**Last updated:** 2026-06-30
**Branch:** `dev/lena`
**Repo:** `DanielBykov/valar-fin-advisory` (private GitHub)

> **Architecture & strategy docs live in Lena's workspace, not this repo — single source of truth.** This HANDOFF is the build-instruction doc for Daniel; the specs/strategy it refers to are kept (one copy only) in the shared OneDrive folder `ws-valar\Valar website\`. Key references:
> - **Page content specs:** `Valar website\pages\` — `home.md`, `about.md`, `services\*.md`, `insights\*.md`
> - **Brand / design tokens:** `Valar website\brand.md` + `Valar website\_design-refs\`
> - **SEO plan:** `Valar website\docs\seo-plan.md`
> - **GEO plan (AI search):** `Valar website\docs\geo-plan.md`
> - **Competitor analysis:** `Valar website\docs\competitor-analysis.md`
> - **SEO audits:** `Valar website\SEO check\`
>
> Repo-side docs (here in `!_github\docs\`): this `HANDOFF.md`, `Zoo.md` (third-party services), `TODO.md`.

---

## Site map

```
valar.co.nz/
├── /                              Home
├── /services                      Services hub
│   ├── /services/mortgage-advice
│   ├── /services/financial-planning
│   ├── /services/wealth-management-plan
│   ├── /services/investment-property-analysis
│   ├── /services/small-business-loans
│   ├── /services/business-advisory
│   └── /services/first-home-buyers
├── /insights                      ⚠️ DEFERRED — post-launch
├── /about
├── /contact
├── /book                          Book a Clarity Call ✅
├── /subscribe                     Newsletter sign-up ✅
├── /privacy-policy                ✅
├── /terms                         ✅
└── /disclosure                    ✅ built (mortgage scope; Lena's final read done 30 Jun)
```

---

## Build log

---

### 30 June 2026 — pre-launch QA + SEO audit

Commits `2e3154d`, `0bfc92a` on `dev/lena`. **Everything is ready to launch** — remaining action is deploy + merge (see below).

- **Dead-link sweep (whole site).** Crawled every route and cross-referenced all internal links. Found and removed the only two live links that hit a 404: the **"Explore the Learning Hub"** text link and the **"Explore Insights"** button (in the final CTA) on the home page — both pointed at `/insights`, which is deferred and returns 404. All other `/insights` references are already inside hidden `{false && …}` blocks. (`2e3154d`)
- **Mobile nav fix.** The "Get Updates" button pointed to `/contact` on mobile but `/subscribe` on desktop — aligned mobile to `/subscribe`. (`2e3154d`)
- **Sitemap.** Added `/disclosure` to `src/app/sitemap.ts` (the page was built after the sitemap was written). All 16 live routes now listed; `/insights` stays excluded while deferred. (`0bfc92a`)
- **Full SEO audit** run and saved (OneDrive): `Valar website\SEO check\SEO audit 2026-06-30.md`. Result: metadata, page titles/descriptions, JSON-LD schema, E-E-A-T, analytics, sitemap, robots, and favicons all ✅. **No SEO item blocks launch.**
- **Disclosure** — Lena's final read **done**. Mortgage scope under the Fundsmart FAP; the Valar investment/KiwiSaver regime will be added when Lena's own FAP investment licence lands (~Aug 2026).

**Decision — image optimization (D2) is DEFERRED for launch** (Lena, 30 Jun). Leave the `unoptimized` `<Image>` instances and the `.png` heroes as-is for now; revisit post-launch. **It is no longer a merge gate.**

---

### 29 June 2026 — SEO pass (following the 25 June 2026 audit)

Commit `30d7968` on `dev/lena`. Most audit items were built directly — **please don't re-do these, just review:**

- **GA4 + cookie consent** — consent-gated GA4 (`G-EKZTGV6R58`) behind a simple Accept/Decline cookie banner; GA loads **only after** the visitor accepts. New: `src/components/consent/` (`consent-provider`, `cookie-banner`, `analytics`), wired into `layout.tsx`. No new dependency (uses `next/script`).
- **Disclosure Statement page** — new public page at `src/app/disclosure/page.tsx`; linked from About + footer. Mortgage scope only (advice under the Fundsmart FAP).
- **Home `<title>`** (`src/app/page.tsx`) → `Mortgage & Financial Advisers NZ | Valar` (removed the doubled "Advisers/Advisors"; 59 → 40 chars).
- **Home meta description** (`src/app/page.tsx`) → trimmed to ~153 chars (was ~178 and truncating in Google).
- **LinkedIn E-E-A-T** — "verify me" link on `/about` + Lena's personal LinkedIn added to the `Person` schema `sameAs`. Files: `about/page-content.tsx`, `lib/schema.ts`.
- **Testimonials** — placeholder testimonials hidden behind `SHOW_TESTIMONIALS = false` in `app/page-content.tsx` until real, consented quotes exist.

**Built in this pass:**

- **FAQPage schema (D1) — ✅ done.** `getFaqSchema()` in `lib/schema.ts`, wired into all 5 service pages. Each page's FAQ data now lives in a colocated `faqs.ts` imported by both `page.tsx` (schema) and `page-content.tsx` (rendering) — single source, so schema and visible text can't drift. (This also fixes the GEO note below: `FAQPage` is now implemented.)

**Still to build (remaining audit item):**

1. **Image optimization (D2).** (a) Vercel supports Next.js image optimization (only static export wouldn't); (b) remove `unoptimized` from the 19 `<Image>` instances (10 files); (c) convert the `.png` heroes (`hero-bg`, `hero-nz`) to WebP, sized to slot; (d) re-run Lighthouse → confirm 90+ mobile.

Full decision log for this pass: `Valar website\SEO check\SEO update 2026-06-27.md`.

---

### 20 June 2026

#### New pages
| Page | URL | Notes |
|------|-----|-------|
| Book a Clarity Call | `/book` | Calendly InlineWidget embedded |
| Privacy Policy | `/privacy-policy` | NZ Privacy Act 2020 compliant |
| Terms & Conditions | `/terms` | General disclaimer, NZ law |
| Subscribe | `/subscribe` | Newsletter sign-up with MailerLite |

#### New components
- **`GuideDownloadModal`** (`src/components/guide-download-modal.tsx`) — reusable modal for gated guide downloads. Currently wired to the First Home Buyer Guide on the home page and the First Home Buyers service page. Takes `guide: { title, description, key }` as props — use it for any future guide.

#### New API routes
| Route | What it does |
|-------|-------------|
| `POST /api/contact` | Contact form → notification to Lena + branded auto-reply to sender via Resend |
| `POST /api/subscribe` | Adds subscriber to MailerLite "Web Subscription" group |
| `POST /api/guide-request` | Guide download → notification to Lena + confirmation to requester via Resend; optional MailerLite subscribe |

#### Key changes to existing pages
- **Home page** — Download First Home Buyer Guide buttons now open the guide modal (not `/book`)
- **First Home Buyers service page** — Guide download modal wired up; personal checklist teaser section added after the download banner
- **Contact page** — Full rebuild: two-column layout, Resend email backend, success state with newsletter opt-in
- **Footer** — Newsletter form now live (MailerLite); first name + email fields; Privacy Policy and T&C links wired
- **Navbar** — "Get Updates" button links to `/subscribe`
- **All service pages** — CTA labels standardised: "Book a Clarity Call" everywhere; "Book a Consultation" on service detail pages
- **Small Business Loans + Business Advisory hero overlays** — lightened

---

## Environment variables

These are in `web/.env.local` — **gitignored, never committed.** Lena has the values.

```
RESEND_API_KEY=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
```

**If deploying to Vercel:** add all three in Project Settings → Environment Variables. Without them, the contact form, newsletter, and guide download will fail silently.

---

## Third-party services

See `docs/Zoo.md` for the full breakdown. Summary:

| Service | Purpose | Notes |
|---------|---------|-------|
| **Resend** | Transactional email | Domain valar.co.nz verified. Sending from lena.bykova@valar.co.nz |
| **MailerLite** | Newsletter | Group: "Web Subscription". Welcome automation is live. |
| **Calendly** | Booking widget | Embedded on `/book`. No API key needed. |

---

## What's still pending / needs attention

### Must-do before go-live
1. **Deployment** — site is not live. Needs Vercel (or equivalent) setup with the env vars above.
2. **Disclosure Statement page** — ✅ BUILT at `/disclosure`, linked from footer + About. Mortgage scope only (under Fundsmart FAP); investment/KiwiSaver to be added when Valar's own licence lands (~Aug 2026). Lena's final read **done 30 Jun** — cleared for go-live.
3. **Footer links:**
   - Disclosure Statement → ✅ now points to `/disclosure` (added 29 Jun)
   - Knowledge Hub → still commented out in footer; wire to `/insights` or `/subscribe` when ready
   - YouTube icon → still commented out; add when the channel exists

### When ready
4. **First Home Buyer Guide PDF** — when Lena has the PDF, attach it to the Resend confirmation email in `src/app/api/guide-request/route.ts`. The route already has everything else in place — just needs the attachment added.
5. **Knowledge Hub / Insights** — page exists at `/insights` but is hidden (`notFound()` on line 21 of `src/app/insights/page.tsx`). All articles are placeholder content. Remove the `notFound()` line and replace articles with real content when ready.
6. **Individual article pages** — `/insights/[id]` pages don't exist yet. "Read More" links on the Insights page will 404 until these are built.
7. **Calculators & FAQs** — listed in the navbar Knowledge Hub dropdown but no pages built yet.

### Branch / deployment
- All work is on `dev/lena`
- When ready to deploy: review, then merge `dev/lena` → `main`
- **Merge gate cleared (30 Jun):** Lena's final disclosure read done; full dead-link sweep confirms no remaining dead links; image optimization (D2) deferred to post-launch by Lena's decision (no longer a gate). **Only remaining go-live action: deploy to Vercel (add the three env vars above) + merge `dev/lena` → `main`.**

---

## GEO / AI-search pre-launch checks

Three low-effort items so AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) can read and cite Valar. Cheap at build, annoying to retrofit. **Not launch blockers** — but do them while the build is open. Full rationale: `geo-plan.md` in Lena's architecture docs — `Valar website\docs\geo-plan.md` (see Reference documents at top).

### 1. Schema — ✅ done per Lena (confirm the GEO-relevant types exist)

Confirm these JSON-LD types are present and match the visible on-page text:
- **`FAQPage`** on home, service pages, and the FAQ page — highest-impact type for AI citation
- **`Person`** on `/about` — Lena's credentials + `sameAs` (LinkedIn, Instagram, YouTube, FSP register entry)
- **`FinancialService` / `LocalBusiness`** on home — legal name, FSP1010055, areaServed, `sameAs`
- **`Service`** on each service page; **`Article` + `dateModified`** on Insights articles when they ship

### 2. robots.txt — allow the AI crawlers

In Next.js this is `src/app/robots.ts` (already on the SEO to-do). Make sure the AI crawlers are explicitly **allowed** — if any are missing or set to `Disallow: /`, that engine can't read or cite the site. Equivalent output:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: https://valar.co.nz/sitemap.xml
```

`Google-Extended` = permission for Google's AI (Gemini) to use the content; allow it (public marketing content only). Verify after deploy: visiting `valar.co.nz/robots.txt` returns the above.

### 3. Real, server-rendered text (not images)

AI/search crawlers read text, not pictures of text. Make sure credentials and key copy are **real DOM text**, not baked into image badges — especially the About page credential/qualification rows and the home founder credential row. Content must be SSR/SSG (present in the initial HTML), not client-only rendered. Quick check: the text should be selectable/highlightable on the live page.

---

## File structure reference

```
web/
├── docs/
│   ├── HANDOFF.md           — this document
│   └── Zoo.md               — all third-party services documented
├── .env.local               — secrets (gitignored, not in repo)
├── public/images/           — all image assets
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── contact/     — contact form email handler
    │   │   ├── subscribe/   — MailerLite subscription handler
    │   │   └── guide-request/ — guide download handler
    │   ├── book/            — Calendly booking page
    │   ├── contact/         — contact page
    │   ├── subscribe/       — newsletter sign-up page
    │   ├── privacy-policy/  — privacy policy
    │   ├── terms/           — terms & conditions
    │   ├── insights/        — Knowledge Hub (hidden — placeholder content)
    │   └── services/        — all service pages
    └── components/
        ├── guide-download-modal.tsx  — reusable gated download modal
        ├── navbar.tsx
        └── footer.tsx
```

---

Questions → Lena Bykova, lena.bykova@valar.co.nz
