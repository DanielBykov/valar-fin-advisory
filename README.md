# Valar Financial Advisors — Website

Marketing and lead-generation website for a New Zealand mortgage & investment advisory practice.
Built with the Next.js App Router, server-rendered for SEO, with contact, newsletter, and
lead-magnet flows wired to transactional email and marketing automation.

**Live:** [valar.co.nz](https://www.valar.co.nz)

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Email:** [Resend](https://resend.com) (transactional) + [MailerLite](https://mailerlite.com) (marketing automation)
- **Booking:** Calendly embed
- **Analytics:** Google Analytics 4 (consent-gated)
- **Hosting:** Vercel

## Highlights

- **Server-first architecture** — every route splits into `page.tsx` (server component: metadata,
  JSON-LD, SSR) and `page-content.tsx` (client component: interactivity), keeping the client bundle small.
- **SEO** — per-route metadata and canonical/OG tags, `sitemap.ts` and `robots.ts`, and structured
  data (`Organization`, `WebSite`, `FinancialService`, `Person`, `BreadcrumbList`, `FAQPage`).
- **Privacy-aware analytics** — GA4 fires only after explicit cookie consent via a custom banner.
- **Lead flows** — contact form, newsletter subscribe, and a gated PDF guide (lead magnet) whose
  delivery is handled by a MailerLite welcome automation.
- **Performance** — AVIF/WebP image pipeline with blur placeholders and responsive `sizes`.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # serve the production build
pnpm lint    # ESLint
```

## Environment variables

Create `web/.env.local`:

```bash
RESEND_API_KEY=          # Resend — transactional email (contact + lead notifications)
MAILERLITE_API_KEY=      # MailerLite — subscriber API
MAILERLITE_GROUP_ID=             # General newsletter group
MAILERLITE_FHB_GROUP_ID=         # First Home Buyers group (triggers the first-home guide automation)
MAILERLITE_CALCULATORS_GROUP_ID= # Calculators group (triggers the mortgage-off-faster automation)
```

Without these, the contact form, newsletter, and guide-download flows will fail.

## Project structure

```
web/
├── src/
│   ├── app/
│   │   ├── api/            # Route handlers: contact, subscribe, guide-request
│   │   ├── services/       # One folder per service page
│   │   ├── layout.tsx      # Root layout, global JSON-LD, GA consent
│   │   ├── sitemap.ts      # Auto-generated /sitemap.xml
│   │   └── robots.ts       # /robots.txt (disallows /api)
│   └── components/         # Navbar, footer, consent banner, guide modal, UI primitives
└── public/                 # Images (WebP), guide PDF, favicons, OG image
```

## Routes

`/` · `/about` · `/services` (+ 7 service pages) · `/book` · `/contact` · `/subscribe`
· `/insights` · `/disclosure` · `/privacy-policy` · `/terms`

## Notes

Designed and built solo, end-to-end — architecture, implementation, SEO, and launch. The site's
content and branding are the client's real, public-facing copy (a licensed New Zealand financial
advisory firm), already live at [valar.co.nz](https://valar.co.nz).
.
