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
 */
export const STANDALONE_ROUTES = ["/start"];

export function isStandaloneRoute(pathname: string | null | undefined): boolean {
  return !!pathname && STANDALONE_ROUTES.includes(pathname);
}
