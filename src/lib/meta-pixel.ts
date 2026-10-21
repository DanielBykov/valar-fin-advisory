/**
 * Tells the Meta pixel that a form was sent, so paid ads can optimise for
 * people who leave their details rather than for clicks.
 *
 * A no-op when the pixel is not loaded, which is the normal case for anyone
 * who declined cookies: `fbq` only exists after consent (see
 * `components/consent/meta-pixel.tsx`).
 *
 * The event itself carries only the name of what was asked for. Contact
 * details can still reach Meta, hashed, through "Automatic advanced matching"
 * in Events Manager (Lena, 2026-10-21): the Privacy Policy says so, and the
 * setting must not be on before that wording is live.
 */
export function trackMetaEvent(event: "Lead" | "Contact", contentName: string) {
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("track", event, { content_name: contentName });
}
