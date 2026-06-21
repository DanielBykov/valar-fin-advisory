# Website Services & Programs

All third-party services and tools connected to the Valar Financial Advisors website.

---

## Quick reference

| # | Service | What it does |
|---|---------|-------------|
| 1 | **GitHub** | Code repository — stores all website code and docs |
| 2 | **Squarespace** | Domain registrar — holds valar.co.nz, DNS records live here |
| 3 | **Zoho Mail** | Current business email — lena.bykova@valar.co.nz |
| 4 | **Google Workspace** | Planned — email migration target (not yet active) |
| 5 | **Vercel** | Hosting — deploys and serves the live website |
| 6 | **Resend** | Transactional email — contact form, guide download notifications |
| 7 | **MailerLite** | Newsletter & email marketing — subscriber list, welcome automation |
| 8 | **Calendly** | Booking — Clarity Call scheduling embedded on `/book` |

---

## 1. GitHub

**What it does:** Stores all website code and documentation under version control.

- **Repo:** `DanielBykov/valar-fin-advisory` (private)
- **Main branch:** `main` — production-ready code only
- **Working branch:** `dev/lena` — all active development happens here
- **Rule:** do not merge `dev/lena` → `main` until Disclosure Statement is built and footer dead links are fixed

---

## 2. Squarespace — Domain

**What it does:** Domain registrar — holds and manages valar.co.nz.

- **Account:** account.squarespace.com/domain
- **Domain:** valar.co.nz
- **DNS:** configured here — any domain pointing or subdomain setup goes through Squarespace

---

## 3. Zoho Mail — Current Business Email

**What it does:** Currently hosts lena.bykova@valar.co.nz. Connected to Squarespace via MX records in the Squarespace DNS settings.

- **Email:** lena.bykova@valar.co.nz
- **Used as:** the sending address for all Resend transactional email (contact form, guide downloads)
- **Status:** active — planned migration to Google Workspace

---

## 4. Google Workspace — Planned Email Migration

**What it does:** Will replace Zoho Mail as the business email provider. Not yet active.

- **Plan:** move lena.bykova@valar.co.nz from Zoho to Google Workspace
- **What's needed:** set up Google Workspace account, then update MX records in Squarespace to point to Google instead of Zoho
- **Note:** Resend domain verification (valar.co.nz) is separate and will not be affected by the email migration

---

## 5. Vercel

**What it does:** Hosts and deploys the website. Connects to the GitHub repo — pushing to `main` triggers a deployment.

- **Site is not yet live** — deployment setup still pending
- **Required env vars (add in Vercel Project Settings → Environment Variables):**

```
RESEND_API_KEY=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
```

Without these, contact form, newsletter, and guide download will fail silently.

---

## 6. Resend — Transactional Email

**What it does:** Sends emails triggered by website forms.

| Form | Emails sent |
|------|-------------|
| Contact form (`/contact`) | Notification to Lena + branded auto-reply to sender |
| Guide download request | Notification to Lena + confirmation email to requester |

- **Sending address:** lena.bykova@valar.co.nz
- **Domain:** valar.co.nz (verified in Resend dashboard)
- **API key:** `RESEND_API_KEY` in `.env.local`
- **Note:** When the First Home Buyer Guide PDF is ready, attach it in `src/app/api/guide-request/route.ts`

---

## 7. MailerLite — Newsletter & Email Marketing

**What it does:** Manages newsletter subscribers and campaigns.

Subscribers are added from:
- Footer newsletter form (all pages)
- `/subscribe` dedicated page
- Contact form success state (optional opt-in)
- Guide download modal (optional opt-in via checkbox)

- **Group:** Web Subscription (ID: `190681331668092077`)
- **API key:** `MAILERLITE_API_KEY` in `.env.local`
- **Group ID:** `MAILERLITE_GROUP_ID` in `.env.local`
- **Welcome automation:** active — triggers on joining "Web Subscription" group

---

## 8. Calendly — Booking

**What it does:** Handles Clarity Call bookings via embedded widget on `/book`.

- **Calendar URL:** https://calendly.com/lena-bykova-valar/new-meeting
- **Embedded via:** `react-calendly` InlineWidget
- **No API key required** — widget is embedded directly
- **Colours configured:** amber `#f0a500`, navy `#061634`, background `#f7f7f5`

---

## API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/contact` | Contact form — notification + auto-reply via Resend |
| `POST /api/subscribe` | Newsletter subscription → MailerLite |
| `POST /api/guide-request` | Guide download — notification + confirmation via Resend, optional MailerLite |
