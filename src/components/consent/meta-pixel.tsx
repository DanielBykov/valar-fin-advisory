"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent, useTrackingAllowed } from "./consent-provider";

// Lena's pixel ("Valar website" dataset in Meta Events Manager, 2026-10-21).
// Public by nature: it is printed in every page that loads the pixel.
const META_PIXEL_ID = "1080163244849694";

/**
 * Loads the Meta (Facebook) pixel unless the visitor has switched cookies off,
 * on the same terms as Google Analytics (see `useTrackingAllowed`).
 *
 * It exists for paid Facebook ads (Lena, 2026-10-21). Without it Meta cannot
 * tell which ad clicks became a form, and optimises for clicks instead.
 *
 * Client-side navigation needs no PageView of its own: the pixel watches the
 * History API and fires one on every route change.
 */
export function MetaPixel() {
  const { consent } = useConsent();
  const allowed = useTrackingAllowed();

  // "Switch off" in the middle of a visit: the loaded pixel stops sending.
  useEffect(() => {
    if (consent === "denied") {
      (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("consent", "revoke");
    }
  }, [consent]);

  if (!allowed) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
