"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent, useTrackingAllowed } from "./consent-provider";

const GA_ID = "G-EKZTGV6R58";

/**
 * Loads Google Analytics 4 unless the visitor has switched cookies off (see
 * `useTrackingAllowed` for why this is opt-out).
 */
export function Analytics() {
  const { consent } = useConsent();
  const allowed = useTrackingAllowed();

  // A script already on the page cannot be unloaded, so "Switch off" in the
  // middle of a visit uses GA's own kill switch until the next page load.
  useEffect(() => {
    if (consent === "denied") {
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    }
  }, [consent]);

  if (!allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
