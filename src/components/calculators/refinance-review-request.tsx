"use client";

import { useState } from "react";
import Link from "next/link";
import { REVIEW_MESSAGE_MAX } from "@/lib/refinance";

/*
 * The page behind "Let's review my mortgage" in the refinance email. Nothing
 * is sent on arrival (2026-11-20, Lena): the visitor sees a ready message to
 * Lena, can change it, and sends it themselves. Who they are travels in the
 * sealed token, so there is nothing else to fill in.
 *
 * The "address" kind is the high-LVR email's "Send my property address": the
 * same page, a different ready message, and an address field that must be filled.
 */

export default function RefinanceReviewRequest({
  token,
  firstName,
  kind = "review",
}: {
  token: string;
  kind?: "review" | "address";
  /** Null when the link could not be opened: expired or damaged. */
  firstName: string | null;
}) {
  const forAddress = kind === "address";
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(
    forAddress
      ? `Hi Lena,\n\nI'd like to review my mortgage and find out what my property is worth. My address is above.\n\nI look forward to hearing from you.\n\nThanks,\n${firstName ?? ""}`
      : `Hi Lena,\n\nI'd like to look at refinancing my mortgage. Please get in touch to book a session.\n\nThanks,\n${firstName ?? ""}`,
  );
  const [status, setStatus] = useState<"editing" | "sending" | "sent" | "failed">(
    firstName === null ? "failed" : "editing",
  );

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || (forAddress && !address.trim())) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/refinance-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, message, ...(forAddress ? { address } : {}) }),
      });
      const json = await res.json();
      setStatus(json.success ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div
      aria-live="polite"
      className="max-w-2xl rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
    >
      {(status === "editing" || status === "sending") && (
        <form onSubmit={send}>
          <div className="mb-4 h-[2px] w-8 bg-valar-amber" />
          <h2 className="mb-2 text-2xl font-bold text-valar-navy">
            {forAddress ? "Send Lena your address" : "Send Lena a message"}
            <span className="text-valar-amber">.</span>
          </h2>
          <p className="mb-5 leading-relaxed text-gray-600">
            {forAddress
              ? "Add your property address. Your message is ready below: change anything you like, then press send."
              : "Your message is ready. Change anything you like, then press send. Lena already has your calculation."}
          </p>
          {forAddress && (
            <div className="mb-4">
              <label
                htmlFor="review-address"
                className="mb-1.5 block text-sm font-semibold text-valar-navy"
              >
                Property address
              </label>
              <input
                id="review-address"
                type="text"
                required
                autoComplete="street-address"
                maxLength={200}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-valar-concrete px-4 py-3 text-base text-valar-navy focus:border-valar-navy focus:outline-none"
              />
            </div>
          )}
          <label htmlFor="review-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="review-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={REVIEW_MESSAGE_MAX}
            rows={8}
            className="w-full rounded-lg border border-valar-concrete p-4 text-base leading-relaxed text-valar-navy focus:border-valar-navy focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending" || !message.trim() || (forAddress && !address.trim())}
            className="mt-4 rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      {status === "sent" && (
        <>
          <div className="mb-4 h-[2px] w-8 bg-valar-amber" />
          <h2 className="mb-3 text-2xl font-bold text-valar-navy">
            Thank you{firstName ? `, ${firstName}` : ""}
            <span className="text-valar-amber">.</span>
          </h2>
          <p className="leading-relaxed text-gray-600">
            {forAddress
              ? "Your address is with Lena. She will check what your property is worth and come back to you within one business day."
              : "Your message is with Lena. She will be in touch to book a session."}
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <h2 className="mb-3 text-2xl font-bold text-valar-navy">
            We couldn&apos;t send your message<span className="text-valar-amber">.</span>
          </h2>
          <p className="mb-5 leading-relaxed text-gray-600">
            The link may have expired. Reply to the email with your calculation and Lena will get
            back to you, or run the calculator again.
          </p>
          <Link
            href="/refinance"
            className="inline-block rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
          >
            Open the calculator
          </Link>
        </>
      )}
    </div>
  );
}
