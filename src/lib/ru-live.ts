/*
 * The switch for `/ru`, in its own module so the page and the sitemap read the
 * same value: a flag local to `page.tsx` let the sitemap keep pointing Google
 * at a 404 after the page was switched off.
 *
 * On since 2026-11-14: the recording, guide, deck and both MailerLite flows
 * exist. Off answers 404 in production; local development ignores the switch.
 */
export const RU_LIVE = true;
