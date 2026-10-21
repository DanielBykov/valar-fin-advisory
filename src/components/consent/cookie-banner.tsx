"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useConsent } from "./consent-provider";
import { isStandaloneRoute } from "@/lib/standalone-routes";

/*
 * A notice, not a question (Lena, 2026-10-21). Cookies are on unless switched
 * off (see `useTrackingAllowed`), so the banner tells, offers one easy OK, and
 * keeps "Switch off" visible as a link. Not hidden behind a second screen,
 * and a choice to switch off is never asked again.
 */
export function CookieBanner() {
  const { consent, ready, accept, decline } = useConsent();
  const pathname = usePathname();

  // Show only after we've checked storage and no choice has been made yet —
  // and never on a standalone route, where the banner would cover the page.
  const show = ready && consent === null && !isStandaloneRoute(pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-label="Cookie notice"
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border border-valar-concrete bg-white p-5 shadow-lg md:flex-row md:items-center md:gap-6">
            <p className="flex-1 text-sm leading-relaxed text-valar-indigo">
              We use cookies to improve the site and show you relevant content.
            </p>
            <div className="order-last flex justify-center gap-1 text-xs text-valar-indigo md:order-none">
              <button
                type="button"
                onClick={decline}
                className="cursor-pointer underline underline-offset-2 hover:text-valar-navy"
              >
                Switch off
              </button>
              <span aria-hidden>·</span>
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 hover:text-valar-navy"
              >
                Privacy Policy
              </Link>
            </div>
            <button
              type="button"
              onClick={accept}
              className="cursor-pointer rounded-sm bg-valar-amber px-8 py-2.5 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
