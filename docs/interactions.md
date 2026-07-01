# Website Interactions

Every form / interactive lead-capture on the Valar website — what it is, how it's built, where the data goes, and the end-to-end workflow. The single reference for understanding how the site captures and routes people, for **Lena** and **Daniel**.

> **Keep this current.** Whenever we build or change any interaction — a form, a lead magnet, a booking flow, an embed — add or update its entry here in the same change. A new interaction isn't "done" until it's in this file.

---

## At a glance

| # | Interaction | Where it lives | Endpoint | Service(s) | Status |
|---|---|---|---|---|---|
| 1 | First Home Buyer Guide (lead magnet) | Homepage, `/services/first-home-buyers` | `POST /api/guide-request` | Resend + MailerLite | 🟡 Live in code — needs prod env + final PDF + Ian sign-off |
| 2 | Contact form | `/contact` | `POST /api/contact` | Resend | 🟢 Working |
| 3 | Newsletter subscribe | Footer (site-wide), `/subscribe`, `/contact` | `POST /api/subscribe` | MailerLite | 🟢 Working |
| 4 | Book a Clarity Call | `/book` | — (external embed) | Calendly | 🟢 Working |

---

## Services & where they're configured

All credentials live in `web/.env.local` (local) and must also be set in the **production hosting environment** (Daniel) — `.env.local` does **not** deploy.

| Service | Role | Env vars |
|---|---|---|
| **Resend** | Transactional email (notifications to Lena, auto-replies) | `RESEND_API_KEY` |
| **MailerLite** | Subscriber lists + automations | `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`, `MAILERLITE_FHB_GROUP_ID` |
| **Calendly** | Booking / scheduling | none (embed URL hard-coded) |

**MailerLite groups:**
| Group | ID | Fed by |
|---|---|---|
| Web subscription | `190681331668092077` | Newsletter forms (#3) + guide news opt-in (#1) |
| First home buyers | `191655852866799092` | Guide form (#1) — triggers the welcome automation |

**Calendly:** `https://calendly.com/lena-bykova-valar/new-meeting`

---

## 1. First Home Buyer Guide (lead magnet)

- **For what:** Capture first-home-buyer leads and deliver the free guide; main lead magnet.
- **How it's built:** React modal `src/components/guide-download-modal.tsx`, opened from a CTA on the homepage (`src/app/page-content.tsx`) and the First Home Buyers page (`src/app/services/first-home-buyers/page-content.tsx`). Fields: **First name, Email, Phone (optional), "Keep me updated" checkbox** (= general-news opt-in). The guide identity (`first-home-buyer-guide`) is passed automatically.
- **How it's connected:** Submits to `POST /api/guide-request` (`src/app/api/guide-request/route.ts`).
- **To which service:**
  - **MailerLite** — every submitter is added to the **First home buyers** group. If the news box is ticked, **also** added to **Web subscription**.
  - **Resend** — sends an internal "new lead" heads-up to `lena.bykova@valar.co.nz`.
- **Workflow:**
  1. Visitor submits the form.
  2. Lead is added to the **First home buyers** MailerLite group.
  3. Joining that group triggers the **MailerLite welcome automation**, which sends the guide email (download link) + the follow-up series.
  4. On the page, a thank-you screen shows: Valar logo, "Thanks for your request / Your guide is ready", a **direct download button**, "we've also emailed it", and links to the First Home Buyer page + Book a Clarity Call.
  5. Lena gets the internal heads-up email.
- **The guide file:** `web/public/resources/guides/first-home-buyer-guide.pdf` → served at `https://www.valar.co.nz/resources/guides/first-home-buyer-guide.pdf`. The on-page download button links here; the emailed guide is whatever the MailerLite automation contains. Filename must stay exactly `first-home-buyer-guide.pdf` (the link is built from the guide key).
- **Before go-live:** set `MAILERLITE_FHB_GROUP_ID` in production · MailerLite automation must be **Active** with trigger "joins First home buyers" · swap test PDF for the final Ian-approved guide · compliance sign-off (Fundsmart Policy 22).

---

## 2. Contact form

- **For what:** General enquiries — let people send a message and get a confirmation.
- **How it's built:** `src/app/contact/page-content.tsx` (`handleSubmit`). Collects **First name, Last name, Email, Phone, Message** (the route reads these fields).
- **How it's connected:** Submits to `POST /api/contact` (`src/app/api/contact/route.ts`).
- **To which service:** **Resend** only.
- **Workflow:**
  1. Visitor submits the message.
  2. Resend sends a **notification to Lena** with the message details.
  3. Resend sends a **branded auto-reply to the sender** ("I've received your message and will be in touch within 1 business day") with service/insights CTAs and signature.
  4. On-page success state confirms it was sent.
- **Note:** No MailerLite — contact enquiries are not added to any list.

---

## 3. Newsletter subscribe

- **For what:** Grow the general newsletter list (market news, research, guides).
- **How it's built:** Three entry points, one endpoint —
  - **Footer** (site-wide): `src/components/footer.tsx`
  - **Subscribe page** (`/subscribe`): `src/app/subscribe/page-content.tsx`
  - **Contact page** newsletter block: `src/app/contact/page-content.tsx` (`handleNewsletterSubmit`)
  - Fields: **Email** (+ optional First name).
- **How it's connected:** All submit to `POST /api/subscribe` (`src/app/api/subscribe/route.ts`).
- **To which service:** **MailerLite** — adds the subscriber to the **Web subscription** group (`MAILERLITE_GROUP_ID`).
- **Workflow:**
  1. Visitor enters email.
  2. Added to the **Web subscription** MailerLite group (any welcome handled inside MailerLite).
  3. On-page success state confirms subscription.
- **Note:** No Resend email from the site; MailerLite owns all subscriber comms.

---

## 4. Book a Clarity Call

- **For what:** Primary conversion — turn interest into a booked strategy/clarity call. The whole site points here.
- **How it's built:** `src/app/book/page-content.tsx` embeds Calendly via `react-calendly` `InlineWidget`. No custom form, no API route.
- **How it's connected:** Direct to **Calendly** (`https://calendly.com/lena-bykova-valar/new-meeting`).
- **To which service:** **Calendly** (external).
- **Workflow:**
  1. Visitor picks a slot in the embedded Calendly widget.
  2. Calendly books the meeting and sends the calendar invite + confirmation directly (its own emails — not Resend/MailerLite).
- **Note:** Slot lengths / availability / buffers are configured **inside Calendly**, not in code. Booked contacts are **not** auto-added to MailerLite.

---

## Adding a new interaction (template)

Copy this block and fill it in whenever a new form / lead magnet / embed ships:

```
## N. <Name>

- **For what:** <purpose>
- **How it's built:** <component/page file, fields collected>
- **How it's connected:** <endpoint or embed>
- **To which service:** <Resend / MailerLite group / Calendly / other>
- **Workflow:** <step-by-step from submit to outcome>
- **Notes / go-live needs:** <env vars, automation, compliance, assets>
```

Then add a row to the **At a glance** table and, if it introduces a new service/credential/list, update **Services & where they're configured**.
