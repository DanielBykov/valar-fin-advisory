# Website Handoff Notes — for Daniel

**Date:** June 2026
**Branch:** `dev/lena`
**Repo:** `DanielBykov/valar-fin-advisory` (private GitHub)

---

## What's been built

All of the following is committed and pushed to `dev/lena`. Not yet merged to `main` or deployed.

### New pages
| Page | URL | Notes |
|------|-----|-------|
| Book a Clarity Call | `/book` | Calendly InlineWidget embedded |
| Privacy Policy | `/privacy-policy` | NZ Privacy Act 2020 compliant |
| Terms & Conditions | `/terms` | General disclaimer, NZ law |
| Subscribe | `/subscribe` | Newsletter sign-up with MailerLite |

### New components
- **`GuideDownloadModal`** (`src/components/guide-download-modal.tsx`) — reusable modal for gated guide downloads. Currently wired to the First Home Buyer Guide on the home page and the First Home Buyers service page. Takes `guide: { title, description, key }` as props — use it for any future guide.

### New API routes
| Route | What it does |
|-------|-------------|
| `POST /api/contact` | Contact form → notification to Lena + branded auto-reply to sender via Resend |
| `POST /api/subscribe` | Adds subscriber to MailerLite "Web Subscription" group |
| `POST /api/guide-request` | Guide download → notification to Lena + confirmation to requester via Resend; optional MailerLite subscribe |

### Key changes to existing pages
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

See `SERVICES.md` in the repo root for the full breakdown. Summary:

| Service | Purpose | Notes |
|---------|---------|-------|
| **Resend** | Transactional email | Domain valar.co.nz verified. Sending from lena.bykova@valar.co.nz |
| **MailerLite** | Newsletter | Group: "Web Subscription". Welcome automation is live. |
| **Calendly** | Booking widget | Embedded on `/book`. No API key needed. |

---

## What's still pending / needs attention

### Must-do before go-live
1. **Deployment** — site is not live. Needs Vercel (or equivalent) setup with the env vars above.
2. **Disclosure Statement page** — `/disclosure` is linked in the footer and About page but the page doesn't exist. Legally required for NZ FSPs. Lena will provide content.
3. **Fix footer dead links:**
   - Knowledge Hub → currently `#`, should point to `/insights` or `/subscribe`
   - Disclosure Statement → currently `#`, will be `/disclosure` once built
   - YouTube icon → currently `#`, remove or add real link when channel exists

### When ready
4. **First Home Buyer Guide PDF** — when Lena has the PDF, attach it to the Resend confirmation email in `src/app/api/guide-request/route.ts`. The route already has everything else in place — just needs the attachment added.
5. **Knowledge Hub / Insights** — page exists at `/insights` but is hidden (`notFound()` on line 21 of `src/app/insights/page.tsx`). All articles are placeholder content. Remove the `notFound()` line and replace articles with real content when ready.
6. **Individual article pages** — `/insights/[id]` pages don't exist yet. "Read More" links on the Insights page will 404 until these are built.
7. **Calculators & FAQs** — listed in the navbar Knowledge Hub dropdown but no pages built yet.

### Branch / deployment
- All work is on `dev/lena`
- When ready to deploy: review, then merge `dev/lena` → `main`
- Do not merge until Disclosure Statement is built and dead links are fixed

---

## File structure reference

```
web/
├── SERVICES.md              — all third-party services documented
├── HANDOFF.md               — this document
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
