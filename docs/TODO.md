# Valar Website — TODO

## Now — Build (no blockers)

- [ ] Logo update — from Replit
- [x] Hide Insights — remove Insights nav menu, footer column, home Section 10, `/insights` page (not in Phase 1 launch)
- [x] Wealth Management slug — rename `/services/wealth-management` to `/services/wealth-management-plan` per handoff
- [x] Typography decision — CSS uses Playfair Display, handoff says Lora or Source Serif. Pick one and align
- [?] Amber-period signature — display headings (H1 hero, key H2s) end with an amber `.` — verify/implement across all pages
  - Q. H1 – amber. H2-6 - no amber, but with periods (dots). Should we remove periods? 
- [?] Footer disclosure line — "Lena Bykova trades as Valar Financial Advisors. FSP1010055. FAP: Fundsmart Mortgages and Finance." linked to `/disclosure`, on every page
  - Q. No page. What to create? Content?
- [B] Testimonials — currently placeholder on home. Hide or clearly mark until real quotes arrive
  - Blocked. Real testimonials are needed.
- [Q] About page — handoff specifies 12 sections, current build is partial. Build out full layout from `about.md`
  - The build is fully aligned with the handoff spec.
  - Q. Hero image? Lena's photo?
- [ ] Contact page — build full UI layout from `contact.md` (form fields, info sections). Backend is blocked but UI is not
- [ ] Book page — build full UI layout from `book-strategy-call.md`. Add Calendly embed placeholder
- [ ] Disclosure page — create `/disclosure` route and page shell. Content from Ian is pending
- [ ] Brand / content audit — compare each page's copy against Lena's source `.md` files for drift from Replit migration
- [ ] Service card pattern — verify all service pages have: Book Strategy Call (solid navy), Enquire (outline), Learn More (amber link)
- [ ] Forms — Contact and Book forms need submission handlers (Formspree or Netlify Forms)
- [ ] SEO / metadata — page titles, descriptions, OG tags for each route
- [ ] Cookie consent banner — required before GA4 can go live. Simple banner: accept/decline, stores preference. Must appear on first visit

## Next — Polish & Integration

- [ ] Responsive QA — test all pages on mobile, tablet, desktop
- [ ] Accessibility pass — contrast, focus states, aria labels, keyboard nav
- [ ] Performance — image optimization, lazy loading, Lighthouse audit
- [ ] Newsletter signup — MailerLite integration for footer form
- [ ] 404 page — review and align with brand
- [ ] Animations — verify Framer Motion transitions are consistent and not excessive

## Blocked on Lena

- [ ] Portrait photo of Lena (About + Book pages)
- [ ] Real NZ photography for hero/section images
- [ ] Calendly account + slot length + availability windows
- [ ] Contact — public email and/or phone number
- [ ] Disclosure / Privacy / Terms — approved text from Ian
- [ ] Testimonials — real client quotes with sign-off
- [ ] First-Home Buyer guide PDF (linked from home, mortgage, FHB pages)
- [ ] Bank logo permissions for homepage Section 3
- [ ] LinkedIn URL + confirm socials
- [ ] Domain `valar.co.nz` confirmed + DNS access
- [ ] About — verified qualifications (mortgage cert, CFA status, other certs)
- [ ] About — optional personal note (farm/family) include or not
- [ ] Google Analytics 4 — provide GA4 measurement ID (G-XXXXXXXXXX) so Daniel can add tracking to the site
- [ ] Financial Planning scope — confirm licensing or soften wording
