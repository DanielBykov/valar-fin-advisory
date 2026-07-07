"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface GuideDownloadModalProps {
  open: boolean;
  onClose: () => void;
  guide: {
    title: string;
    description?: string;
    key: string;
  };
}

export function GuideDownloadModal({ open, onClose, guide }: GuideDownloadModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/guide-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, guideKey: guide.key, guideTitle: guide.title }),
    });
    const json = await res.json();
    if (json.success) {
      setSucceeded(true);
    } else {
      setError(json.error || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-valar-navy/70 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-valar-indigo/40 hover:text-valar-navy transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {succeeded ? (
          <div className="text-center py-2">
            {/* Valar logo on navy */}
            <div className="mx-auto mb-6 inline-flex items-center justify-center bg-valar-navy rounded-md px-5 py-3">
              <Image
                src="/images/valar-logo.png"
                alt="Valar Financial Advisors"
                width={180}
                height={48}
                className="h-5 w-auto object-contain"
                unoptimized
              />
            </div>

            <h3 className="text-xl font-bold text-valar-navy mb-1">
              Thanks for your request.
            </h3>
            <p className="text-base text-valar-navy/80 mb-4">Your guide is ready.</p>
            <div className="h-[2px] w-8 bg-valar-amber mx-auto mb-5" />

            <a
              href={`/resources/guides/${guide.key}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold py-3 px-6 rounded-sm transition-colors text-sm"
            >
              Download the guide →
            </a>

            <p className="text-sm text-valar-indigo leading-relaxed mt-5">
              We&apos;ve also emailed your copy of the{" "}
              <span className="font-semibold">First Home Buyer Guide</span>. Keep an eye on your inbox.
            </p>
            <p className="text-sm font-bold text-valar-navy mt-5">
              Happy to assist you whenever you&apos;re ready.
            </p>

            <p className="text-sm text-valar-indigo leading-relaxed mt-5">Want to learn more?</p>
            <p className="text-sm leading-relaxed mt-1">
              <a href="/services/first-home-buyers" className="text-valar-navy underline font-semibold hover:text-valar-amber">
                First Home Buyer page
              </a>
              <span className="text-valar-indigo/40 mx-2">·</span>
              <a href="/book" className="text-valar-navy underline font-semibold hover:text-valar-amber">
                Book a clarity call
              </a>
            </p>

            <button
              onClick={onClose}
              className="mt-6 text-sm text-valar-indigo/60 underline hover:text-valar-navy transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="h-[2px] w-6 bg-valar-amber mb-4" />
              <h2 className="text-xl font-bold text-valar-navy mb-1">{guide.title}</h2>
              {guide.description && (
                <p className="text-sm text-valar-indigo leading-relaxed">{guide.description}</p>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="gd-firstName" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">
                  First Name
                </label>
                <input
                  id="gd-firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="gd-email" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="gd-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="gd-phone" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">
                  Phone <span className="text-valar-indigo/40 normal-case font-normal">(optional)</span>
                </label>
                <input
                  id="gd-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="subscribe"
                  value="yes"
                  className="mt-0.5 accent-valar-amber w-4 h-4 flex-shrink-0"
                />
                <span className="text-xs text-valar-indigo leading-relaxed">
                  Keep me updated — occasional market news, research and guides from Valar.
                </span>
              </label>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold py-3 rounded-sm transition-colors text-sm disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send me the guide"}
              </button>
              <p className="text-center text-xs text-valar-indigo/50">
                By submitting, you agree to our{" "}
                <a href="/privacy-policy" className="underline hover:text-valar-navy">Privacy Policy</a>.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
