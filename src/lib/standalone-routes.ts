/**
 * Routes that render as a standalone page: no navbar, no footer, no cookie
 * banner. `/start` is the Instagram link-in-bio card — site chrome competes
 * with it, and a consent dialog covering the bottom of a four-link page costs
 * the tap it exists to win.
 *
 * Suppressing the banner here is safe because consent is opt-in, not opt-out:
 * `Analytics` renders nothing until consent === "granted", so a visitor who
 * never sees the banner never has a cookie set and never hits Google. The cost
 * is real but it is measurement, not compliance — traffic arriving cold from
 * Instagram goes unrecorded in GA unless that person already accepted cookies
 * elsewhere on the site.
 *
 * `/calculators/repayments/report` is the printable calculation from the email.
 * It has to come out as exactly one A4 sheet, and a navbar and a full footer on
 * the page are two more things to fight in print CSS for no gain — the way back
 * into the site is the masthead and the booking line on the sheet itself.
 */
export const STANDALONE_ROUTES = ["/start", "/calculators/repayments/report"];

export function isStandaloneRoute(pathname: string | null | undefined): boolean {
  return !!pathname && STANDALONE_ROUTES.includes(pathname);
}
