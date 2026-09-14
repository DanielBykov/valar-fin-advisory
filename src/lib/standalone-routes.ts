/**
 * Routes that drop the site chrome, and the smaller set that also drops the
 * cookie banner.
 *
 * `/start` is the Instagram link-in-bio card — site chrome competes with it,
 * and a consent dialog covering the bottom of a four-link page costs the tap it
 * exists to win.
 *
 * Suppressing the banner there is safe because consent is opt-in, not opt-out:
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
 *
 * `/ua` hides the chrome for a different reason and therefore keeps the banner.
 * The navbar and footer are in English and the page is not, so a Ukrainian
 * speaker's first impression would be a site that is not addressed to them —
 * it carries its own Ukrainian footer instead. But it is a paid-ad landing
 * page: whether it converts is the entire question being asked of it, so
 * measurement is the one thing it cannot afford to give up.
 */

/** No navbar, no footer. */
const CHROMELESS_ROUTES = ["/start", "/calculators/repayments/report", "/ua"];

/** No cookie banner either. */
export const STANDALONE_ROUTES = ["/start", "/calculators/repayments/report"];

export function isChromelessRoute(pathname: string | null | undefined): boolean {
  return !!pathname && CHROMELESS_ROUTES.includes(pathname);
}

export function isStandaloneRoute(pathname: string | null | undefined): boolean {
  return !!pathname && STANDALONE_ROUTES.includes(pathname);
}
