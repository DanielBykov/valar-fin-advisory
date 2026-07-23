"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function SubscribeContent() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSucceeded(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div data-cmp="SubscribePage" className="w-full flex flex-col bg-valar-fog min-h-screen">

      {/* Hero */}
      <section className="relative text-white overflow-hidden min-h-[200px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/subscribe-hero.webp" alt="Subscribe" fill sizes="100vw" priority className="object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-valar-navy/70" />
        </div>
        <div className="container mx-auto max-w-2xl px-4 md:px-6 relative z-10 pt-20 pb-10 text-center">
          <div className="h-[2px] w-6 bg-valar-amber mx-auto mb-5" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Stay Updated<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light leading-relaxed">
            Once a week — market news, property research, useful guides and calculators. No spam.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-md">
          {succeeded ? (
            <div className="bg-white rounded-xl p-10 border border-valar-concrete shadow-sm text-center space-y-4">
              <CheckCircle className="w-10 h-10 text-valar-amber mx-auto" />
              <h2 className="text-xl font-bold text-valar-navy">You're subscribed.</h2>
              <p className="text-sm text-valar-indigo leading-relaxed">
                Welcome. You'll hear from me soon — one email a week, worth reading.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/services" className="flex items-center justify-between px-4 py-3 rounded-md border border-valar-concrete hover:border-valar-amber hover:bg-valar-fog transition-all group">
                  <span className="text-sm text-valar-navy font-medium">Explore our services</span>
                  <span className="text-valar-amber text-sm group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/insights" className="flex items-center justify-between px-4 py-3 rounded-md border border-valar-concrete hover:border-valar-amber hover:bg-valar-fog transition-all group">
                  <span className="text-sm text-valar-navy font-medium">Browse the Knowledge Hub</span>
                  <span className="text-valar-amber text-sm group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 md:p-10 border border-valar-concrete shadow-sm">
              <h2 className="text-lg font-bold text-valar-navy mb-1">What you'll receive</h2>
              <ul className="space-y-1.5 mb-8">
                {[
                  "NZ property market updates",
                  "Recent research worth reading",
                  "Guides, tools and calculators",
                  "Occasional insights from client work",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-valar-indigo">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold py-3 rounded-sm transition-colors text-sm disabled:opacity-60"
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
                <p className="text-center text-xs text-valar-indigo/50">
                  By subscribing, you agree to our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-valar-navy">Privacy Policy</Link>.
                  Unsubscribe any time.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
