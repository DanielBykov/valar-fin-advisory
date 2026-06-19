# Website Services & Integrations

All third-party services connected to the Valar Financial Advisors website.

---

## Resend — Transactional Email

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

## MailerLite — Newsletter & Email Marketing

**What it does:** Manages newsletter subscribers and campaigns.

Subscribers are added from:
- Footer newsletter form (all pages)
- `/subscribe` dedicated page
- Contact form success state (optional opt-in)
- Guide download modal (optional opt-in via checkbox)

- **Group:** Web Subscription (ID: `190681331668092077`)
- **API key:** `MAILERLITE_API_KEY` in `.env.local`
- **Group ID:** `MAILERLITE_GROUP_ID` in `.env.local`
- **To do:** Set up welcome automation in MailerLite — trigger: subscriber joins "Web Subscription" group

---

## Calendly — Booking

**What it does:** Handles Clarity Call bookings via embedded widget on `/book`.

- **Calendar URL:** https://calendly.com/lena-bykova-valar/new-meeting
- **Embedded via:** `react-calendly` InlineWidget
- **No API key required** — widget is embedded directly
- **Colours configured:** amber `#f0a500`, navy `#061634`, background `#f7f7f5`

---

## Environment Variables

All secrets live in `web/.env.local` (gitignored — never committed).

```
RESEND_API_KEY=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
```

If deploying to Vercel or another host, add these in the platform's environment variable settings.

---

## API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/contact` | Contact form — notification + auto-reply via Resend |
| `POST /api/subscribe` | Newsletter subscription → MailerLite |
| `POST /api/guide-request` | Guide download — notification + confirmation via Resend, optional MailerLite |
