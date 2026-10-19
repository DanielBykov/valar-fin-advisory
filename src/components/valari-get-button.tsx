"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Info } from "lucide-react";
import { GuideDownloadModal } from "@/components/guide-download-modal";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";

/**
 * The "Get Valári" button on /first-home-ai-skill and the form it opens.
 *
 * A button and a modal rather than a form on the page (Lena, 2026-10-19): the
 * page is a landing with one action. The extra tap that the /ua page avoids is
 * affordable here — people arrive from the webinar QR code or an email, asking
 * for Valári by name, not cold from a Facebook group.
 *
 * A client component because the form copy carries functions, which a server
 * page cannot pass down.
 */

const termsLink = "font-semibold underline hover:text-valar-amber";

export function ValariGetButton({ cmp }: { cmp: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cmp={cmp}
        className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-sm bg-valar-amber px-12 py-5 text-lg font-bold text-valar-navy shadow-lg transition-colors hover:bg-valar-amber-hover"
      >
        Get Valári
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>

      <GuideDownloadModal
        open={open}
        onClose={() => setOpen(false)}
        guide={LEAD_MAGNETS["valari-ai-skill"]}
        source="Valári download page"
        pairNames
        header={
          <div className="mb-6">
            {/* A navy band bleeding to the card's edges (the card has p-8), so
                the form opens with Valári's face, as the page does. */}
            <div
              className="-mx-8 -mt-8 flex flex-col items-center rounded-t-xl px-8 pt-8 pb-6 text-center"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 50% 30%, #2b416d 0%, #14274f 55%, #061634 100%)",
              }}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-[22%] ring-2 ring-valar-amber ring-offset-2 ring-offset-valar-navy">
                <Image src="/images/valari-avatar.jpg" alt="Valári" fill sizes="80px" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">
                Get Valári<span className="text-valar-amber">.</span>
              </h2>
              <p className="mt-1 text-sm font-light text-valar-lilac">
                Free. We send the file to your email.
              </p>
            </div>
            {/* Highlighted at Lena's request: the terms are read before the
                form, not discovered in the checkbox under it. */}
            <div
              data-cmp="ValariPage.Terms"
              className="mt-5 flex items-start gap-3 rounded-sm border-l-4 border-valar-amber bg-valar-amber/15 px-4 py-4"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-valar-amber" />
              <div className="text-sm leading-relaxed text-valar-navy">
                <p className="font-bold">Please read before you download</p>
                <p className="mt-1.5">
                  Valári gives general information, not financial advice. Any AI can make mistakes,
                  so check anything that matters to your decisions.
                </p>
                <p className="mt-1.5">
                  For advice on your situation, talk to a licensed mortgage adviser.
                </p>
              </div>
            </div>
          </div>
        }
        copy={{
          lastNameLabel: "Last Name",
          // The required tick above already names the Privacy Policy.
          privacy: () => null,
          emailSuggestion: (fix) => <>Did you mean {fix}?</>,
          subscribeLabel: "Send me occasional news, guides and updates from Valar.",
          consentLabel: (
            <>
              I understand that Valári gives general information, not financial advice, and that AI
              can make mistakes. I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className={termsLink}>
                Terms
              </a>
              ,{" "}
              <a href="/disclosure" target="_blank" rel="noopener noreferrer" className={termsLink}>
                Disclosure
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={termsLink}
              >
                Privacy Policy
              </a>
              .
            </>
          ),
          submit: "Get Valári",
          successTitle: "Thank you.",
          successReady: "Valári is on its way to your inbox.",
          emailedNote: () => (
            <>
              Look for an email from Valar in the next few minutes. If it isn&apos;t there, check
              your spam or promotions folder.
            </>
          ),
        }}
      />
    </>
  );
}
