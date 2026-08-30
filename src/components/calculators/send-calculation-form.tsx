"use client";

import { useState } from "react";
import Link from "next/link";
import type { RepaymentSnapshot } from "@/lib/repayment-report";

/*
 * The fields sit on the card rather than behind a modal: this one lives beside
 * the chart as a peer of the results panel, so a button that opens a dialog
 * would leave a card that is mostly empty space next to a full one.
 *
 * It posts to the same /api/guide-request as the guide modal — one capture
 * path, one consent flow. What it adds is `figures`: the calculator's inputs as
 * they stood when the button was pressed, which is what turns a subscription
 * into an email the person actually wanted. The group they land in follows
 * `guideKey`, resolved on the server from src/lib/lead-magnets.ts.
 */
export default function SendCalculationForm({
  guideKey,
  guideTitle,
  guideReady,
  source,
  figures,
}: {
  /** Which lead magnet this is — the server resolves the MailerLite group from it. */
  guideKey?: string;
  guideTitle: string;
  /** Which page asked, recorded against the subscriber in MailerLite. */
  source?: string;
  /** False while the PDF is still being written — changes what the thank-you says. */
  guideReady: boolean;
  /**
   * The calculation to send back. Only the inputs travel: the server recomputes
   * the answer, so the email can never quote a figure the page did not.
   * Omitted on any capture that is not attached to a calculator.
   */
  figures?: RepaymentSnapshot;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/guide-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, guideKey, guideTitle, source, figures }),
      });
      const json = await res.json();
      if (json.success) setSucceeded(true);
      else setError(json.error || "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setSubmitting(false);
  }

  if (succeeded) {
    return (
      <div
        data-cmp="SendCalculationForm.Done"
        className="flex h-full flex-col justify-center rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
      >
        <div className="mb-4 h-[2px] w-8 bg-valar-amber" />
        <h3 className="mb-2 text-xl font-bold text-valar-navy">
          On its way<span className="text-valar-amber">.</span>
        </h3>
        <p className="text-sm leading-relaxed text-gray-600">
          {guideReady ? (
            <>
              Your figures and <span className="font-semibold text-valar-navy">{guideTitle}</span>{" "}
              are heading to your inbox now.
            </>
          ) : (
            <>
              Your figures are on their way.{" "}
              <span className="font-semibold text-valar-navy">{guideTitle}</span> is being finished
              right now and will follow the moment it is done.
            </>
          )}
        </p>
        {figures && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            There is a printable one-page version linked inside it.
          </p>
        )}
        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          If you would rather talk it through,{" "}
          <Link href="/book" className="font-semibold text-valar-navy underline hover:text-valar-amber">
            book a clarity call
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      data-cmp="SendCalculationForm"
      className="flex h-full flex-col rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
        Want this in writing?
      </p>
      <h3 className="mb-3 text-xl font-bold text-valar-navy">
        I can send you these figures<span className="text-valar-amber">.</span>
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-gray-600">
        Your numbers, and a short guide with them —{" "}
        <b className="text-valar-navy">{guideTitle}</b>. The things that actually move the number, in
        the order worth doing them.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
              First name
            </span>
            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              className="rounded-lg border border-valar-concrete bg-white px-3 py-2 text-sm text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
              Last name
            </span>
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              className="rounded-lg border border-valar-concrete bg-white px-3 py-2 text-sm text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-lg border border-valar-concrete bg-white px-3 py-2 text-sm text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
            Phone <span className="font-medium normal-case text-valar-steel/70">(optional)</span>
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className="rounded-lg border border-valar-concrete bg-white px-3 py-2 text-sm text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
          />
        </label>

        <label className="mt-1 flex items-start gap-2.5 text-xs leading-relaxed text-gray-600">
          <input
            type="checkbox"
            name="subscribe"
            value="yes"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-valar-concrete accent-valar-amber"
          />
          Keep me updated — occasional market news, research and guides from Valar.
        </label>

        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full rounded-lg bg-valar-amber px-6 py-3 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send me my calculation"}
        </button>

        <p className="text-center text-[11px] text-valar-steel">
          By submitting, you agree to our{" "}
          <Link href="/privacy-policy" className="underline hover:text-valar-navy">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
