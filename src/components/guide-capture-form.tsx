"use client";

import { useState } from "react";
import Image from "next/image";
import { isReady, type LeadMagnet } from "@/lib/lead-magnets";

/**
 * The email-for-a-document exchange itself: the fields, the request, and what
 * the screen says once it has gone through.
 *
 * It was extracted from `GuideDownloadModal` when the Ukrainian page needed the
 * same exchange in two ways the modal could not give it — on the page rather
 * than behind a tap, and in Ukrainian. Both would otherwise have been a second
 * copy of a form that talks to a live endpoint and handles money-adjacent
 * details, which is the kind of duplicate that drifts quietly.
 *
 * The modal is now a shell around this. Nothing else about it changed.
 */

/**
 * Every visible string, so a page can be in a language other than English
 * without a second component.
 *
 * Callers pass a `Partial` and only override what differs; the defaults below
 * are the English wording the modal has always used. Sentences that need the
 * document's own name are functions rather than templates with a placeholder
 * to find and replace — a translator gets the whole sentence and can put the
 * title where their grammar wants it.
 */
export type CaptureCopy = {
  firstNameLabel: string;
  /**
   * `null` leaves the field off, which is what every English capture point
   * does — they have always asked for a first name only, and adding a field to
   * a working form costs conversions for a value nobody asked for. The
   * Ukrainian page sets it because those leads are worked by hand.
   */
  lastNameLabel: string | null;
  emailLabel: string;
  phoneLabel: string;
  phoneOptional: string;
  /** `null` removes the newsletter opt-in entirely — for a page whose visitors would be joining a list written in a language they did not ask for. */
  subscribeLabel: string | null;
  submit: string;
  submitting: string;
  genericError: string;
  privacy: (link: React.ReactNode) => React.ReactNode;
  privacyLinkLabel: string;
  successTitle: string;
  successReady: string;
  successPending: string;
  downloadLabel: string;
  emailedNote: (title: React.ReactNode) => React.ReactNode;
  pendingNote: (title: React.ReactNode) => React.ReactNode;
  closingLine: string;
  learnMoreLabel: string;
  learnMoreLinks: { href: string; label: string }[];
  closeLabel: string;
};

export const DEFAULT_CAPTURE_COPY: CaptureCopy = {
  firstNameLabel: "First Name",
  lastNameLabel: null,
  emailLabel: "Email",
  phoneLabel: "Phone",
  phoneOptional: "(optional)",
  subscribeLabel: "Keep me updated — occasional market news, research and guides from Valar.",
  submit: "Send me the guide",
  submitting: "Sending…",
  genericError: "Something went wrong. Please try again.",
  privacy: (link) => <>By submitting, you agree to our {link}.</>,
  privacyLinkLabel: "Privacy Policy",
  successTitle: "Thanks for your request.",
  successReady: "Your guide is ready.",
  successPending: "It is on its way to you.",
  downloadLabel: "Download the guide →",
  emailedNote: (title) => (
    <>
      We&apos;ve also emailed your copy of the {title}. Keep an eye on your inbox.
    </>
  ),
  pendingNote: (title) => (
    <>
      {title} is being finished right now. It will land in your inbox the moment it is done — along
      with anything you asked for above.
    </>
  ),
  closingLine: "Happy to assist you whenever you're ready.",
  learnMoreLabel: "Want to learn more?",
  learnMoreLinks: [
    { href: "/services/first-home-buyers", label: "First Home Buyer page" },
    { href: "/book", label: "Book a clarity call" },
  ],
  closeLabel: "Close",
};

interface GuideCaptureFormProps {
  /** What is being offered, straight from the registry. */
  guide: LeadMagnet;
  /** Which page asked. */
  source: string;
  /** Overrides for any visible string. */
  copy?: Partial<CaptureCopy>;
  /** Rendered under the success state; the modal closes, a page section has nowhere to go. */
  onClose?: () => void;
  /**
   * Called once the request has gone through. The Ukrainian page uses it to
   * swap a thumbnail for the actual player: the exchange is an email for a
   * video that only ever plays on this page, so there is no link to hand over
   * and "success" has to mean something appears rather than something is sent.
   */
  onSuccess?: () => void;
  /**
   * Shown above the fields and gone once the form has been sent. It sits here
   * rather than in the caller because only this component knows the form has
   * succeeded — and the modal has always replaced its title with the
   * confirmation rather than stacking one on the other.
   */
  header?: React.ReactNode;
}

export function GuideCaptureForm({
  guide,
  source,
  copy,
  onClose,
  header,
  onSuccess,
}: GuideCaptureFormProps) {
  const t = { ...DEFAULT_CAPTURE_COPY, ...copy };
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/guide-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, guideKey: guide.key, guideTitle: guide.title, source }),
    });
    const json = await res.json();
    if (json.success) {
      setSucceeded(true);
      onSuccess?.();
    } else {
      setError(json.error || t.genericError);
    }
    setSubmitting(false);
  }

  const boldTitle = <span className="font-semibold">{guide.title}</span>;

  if (succeeded) {
    return (
      <div className="text-center py-2">
        {/* Valar logo on navy */}
        <div className="mx-auto mb-6 inline-flex items-center justify-center bg-valar-navy rounded-md px-5 py-3">
          <Image
            src="/images/valar-logo.webp"
            alt="Valar Financial Advisors"
            width={180}
            height={48}
            className="h-5 w-auto object-contain"
          />
        </div>

        <h3 className="text-xl font-bold text-valar-navy mb-1">{t.successTitle}</h3>
        <p className="text-base text-valar-navy/80 mb-4">
          {!isReady(guide) ? t.successPending : t.successReady}
        </p>
        <div className="h-[2px] w-8 bg-valar-amber mx-auto mb-5" />

        {isReady(guide) && (
          <a
            href={guide.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold py-3 px-6 rounded-sm transition-colors text-sm"
          >
            {t.downloadLabel}
          </a>
        )}

        <p className="text-sm text-valar-indigo leading-relaxed mt-5">
          {!isReady(guide)
            ? guide.pendingNote
              ? guide.pendingNote
              : t.pendingNote(boldTitle)
            : t.emailedNote(boldTitle)}
        </p>
        <p className="text-sm font-bold text-valar-navy mt-5">{t.closingLine}</p>

        {t.learnMoreLinks.length > 0 && (
          <>
            <p className="text-sm text-valar-indigo leading-relaxed mt-5">{t.learnMoreLabel}</p>
            <p className="text-sm leading-relaxed mt-1">
              {t.learnMoreLinks.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && <span className="text-valar-indigo/40 mx-2">·</span>}
                  <a
                    href={link.href}
                    className="text-valar-navy underline font-semibold hover:text-valar-amber"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          </>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 text-sm text-valar-indigo/60 underline hover:text-valar-navy transition-colors"
          >
            {t.closeLabel}
          </button>
        )}
      </div>
    );
  }

  const field =
    "bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20";
  const label = "text-xs font-semibold text-valar-navy uppercase tracking-wide";

  /*
   * Field ids carry the magnet key. The Ukrainian page renders this form on the
   * page rather than in a modal, so a second capture point on the same page
   * would otherwise duplicate `gd-email` and break every label's association
   * with its input.
   */
  const id = (name: string) => `gd-${guide.key}-${name}`;

  return (
    <>
      {header}
      <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label htmlFor={id("firstName")} className={label}>
          {t.firstNameLabel}
        </label>
        <input
          id={id("firstName")}
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          className={field}
        />
      </div>
      {t.lastNameLabel && (
        <div className="space-y-1.5">
          <label htmlFor={id("lastName")} className={label}>
            {t.lastNameLabel}
          </label>
          <input
            id={id("lastName")}
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            className={field}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor={id("email")} className={label}>
          {t.emailLabel}
        </label>
        <input id={id("email")} name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={id("phone")} className={label}>
          {t.phoneLabel}{" "}
          <span className="text-valar-indigo/40 normal-case font-normal">{t.phoneOptional}</span>
        </label>
        <input id={id("phone")} name="phone" type="tel" autoComplete="tel" className={field} />
      </div>

      {t.subscribeLabel && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="subscribe"
            value="yes"
            className="mt-0.5 accent-valar-amber w-4 h-4 flex-shrink-0"
          />
          <span className="text-xs text-valar-indigo leading-relaxed">{t.subscribeLabel}</span>
        </label>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold py-3 rounded-sm transition-colors text-sm disabled:opacity-60"
      >
        {submitting ? t.submitting : t.submit}
      </button>
      <p className="text-center text-xs text-valar-indigo/50">
        {t.privacy(
          <a href="/privacy-policy" className="underline hover:text-valar-navy">
            {t.privacyLinkLabel}
          </a>,
        )}
        </p>
      </form>
    </>
  );
}
