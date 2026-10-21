/**
 * Tells the Meta pixel that a form was sent, so paid ads can optimise for
 * people who leave their details rather than for clicks.
 *
 * A no-op when the pixel is not loaded, which is the normal case for anyone
 * who declined cookies: `fbq` only exists after consent (see
 * `components/consent/meta-pixel.tsx`).
 *
 * Only the name of what was asked for goes to Meta, never the person's name,
 * email or phone: those stay between the visitor and Valar.
 */
export function trackMetaEvent(event: "Lead" | "Contact", contentName: string) {
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("track", event, { content_name: contentName });
}
