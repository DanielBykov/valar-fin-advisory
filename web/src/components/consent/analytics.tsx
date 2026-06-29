"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";

const GA_ID = "G-EKZTGV6R58";

/**
 * Loads Google Analytics 4 only after the visitor accepts cookies.
 * Until consent === "granted" nothing is injected, so no GA cookie is set
 * and no request goes to Google.
 */
export function Analytics() {
  const { consent } = useConsent();

  if (consent !== "granted") return null;

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
