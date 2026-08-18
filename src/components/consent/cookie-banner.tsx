"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useConsent } from "./consent-provider";
import { isStandaloneRoute } from "@/lib/standalone-routes";

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
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
        >
          <div className="mx-auto max-w-3xl rounded-lg border border-valar-concrete bg-white shadow-lg p-5 md:flex md:items-center md:gap-6">
            <p className="flex-1 text-sm leading-relaxed text-valar-indigo">
              We use cookies to understand how visitors use our site and improve
              your experience. You can accept or decline analytics cookies. See our{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-valar-navy underline underline-offset-2 hover:text-valar-amber"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-shrink-0 gap-3 md:mt-0">
              <button
                type="button"
                onClick={decline}
                className="rounded-sm border border-valar-concrete px-4 py-2 text-sm font-semibold text-valar-indigo transition-colors hover:bg-valar-fog"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-sm bg-valar-amber px-5 py-2 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
