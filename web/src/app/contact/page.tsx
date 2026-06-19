"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Calendar, MapPin, Clock, Linkedin, Instagram, Facebook, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      setSucceeded(true);
      setSubmittedEmail(data.email as string);
    } else {
      setError("Something went wrong. Please try again or email me directly.");
    }
    setSubmitting(false);
  }

  return (
    <div data-cmp="ContactPage" className="w-full flex flex-col bg-valar-fog min-h-screen">

      {/* Hero */}
      <section data-cmp="ContactPage.Hero" className="bg-valar-navy text-white pt-28 pb-14 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-6 bg-valar-amber mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in Touch<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light text-lg border-l-2 border-valar-amber pl-4">
            Pick the option that works best for you.
          </p>
        </div>
      </section>

      {/* Two columns */}
      <section data-cmp="ContactPage.Main" className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left — Book a Clarity Call */}
          <div data-cmp="ContactPage.Book" className="flex flex-col gap-6 h-full">
            <div className="bg-valar-navy text-white rounded-xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-valar-amber flex-shrink-0" />
                <h2 className="text-xl font-bold">Book a Clarity Call</h2>
              </div>
              <p className="text-valar-lilac text-sm leading-relaxed mb-6">
                A free 15–20 minute call to talk through your situation and explore whether Valar is the right fit. No obligation, no fee.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold px-6 py-3 rounded-sm transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" /> Pick a time
              </Link>
            </div>

            {/* Contact details */}
            <div className="bg-white rounded-xl p-8 border border-valar-concrete shadow-sm space-y-5 flex-1">
              <h3 className="text-xs font-bold text-valar-navy uppercase tracking-widest">Contact Details</h3>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-valar-indigo/60 uppercase tracking-wide mb-0.5">Email</p>
                  <a href="mailto:lena.bykova@valar.co.nz" className="text-sm text-valar-navy font-medium hover:text-valar-amber transition-colors">
                    lena.bykova@valar.co.nz
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-valar-indigo/60 uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-sm text-valar-navy font-medium">Auckland area and around New Zealand</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-valar-indigo/60 uppercase tracking-wide mb-0.5">Response Time</p>
                  <p className="text-sm text-valar-navy font-medium">Typically within 1 business day</p>
                </div>
              </div>

              <div className="pt-2 border-t border-valar-concrete">
                <p className="text-xs text-valar-indigo/60 uppercase tracking-wide mb-3">Follow & Connect</p>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/lena.valarnz/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-valar-fog border border-valar-concrete flex items-center justify-center text-valar-navy hover:bg-valar-navy hover:text-valar-amber transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://www.linkedin.com/company/valar-advisors" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-valar-fog border border-valar-concrete flex items-center justify-center text-valar-navy hover:bg-valar-navy hover:text-valar-amber transition-all">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://www.facebook.com/lena.valarnz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-valar-fog border border-valar-concrete flex items-center justify-center text-valar-navy hover:bg-valar-navy hover:text-valar-amber transition-all">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://wa.me/642108635695" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-md bg-valar-fog border border-valar-concrete flex items-center justify-center text-valar-navy hover:bg-valar-navy hover:text-valar-amber transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Send a Message */}
          <div data-cmp="ContactPage.Message" className="bg-white rounded-xl p-8 md:p-10 border border-valar-concrete shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-valar-amber flex-shrink-0" />
              <h2 className="text-xl font-bold text-valar-navy">Send a Message</h2>
            </div>
            {succeeded ? (
              <div className="flex flex-col py-6 gap-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-valar-amber flex-shrink-0" />
                  <h3 className="text-xl font-bold text-valar-navy">Message sent.</h3>
                </div>
                <p className="text-sm text-valar-indigo leading-relaxed">
                  Thank you for reaching out. I'll review your message and get back to you within 1 business day. A confirmation has been sent to your email.
                </p>
                <div className="rounded-xl bg-valar-navy p-6 space-y-3">
                  <p className="text-xs font-semibold text-valar-amber uppercase tracking-wide">Stay updated</p>
                  <p className="text-sm text-valar-lilac leading-relaxed">
                    Once a week — market news, recent property research, useful guides and calculators. No spam.
                  </p>
                  <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      defaultValue={submittedEmail}
                      className="bg-valar-indigo border border-valar-indigo rounded-md px-3 h-10 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-valar-amber text-white placeholder:text-white/40"
                    />
                    <button type="submit" className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-bold text-sm px-4 h-10 rounded-sm transition-colors whitespace-nowrap">
                      Subscribe
                    </button>
                  </form>
                </div>
                <div className="border-t border-valar-concrete pt-6 space-y-3">
                  <p className="text-xs font-semibold text-valar-navy uppercase tracking-wide">In the meantime</p>
                  <div className="flex flex-col gap-3">
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
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">First Name</label>
                    <input id="firstName" name="firstName" autoComplete="given-name" className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">Last Name</label>
                    <input id="lastName" name="lastName" autoComplete="family-name" className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">Phone <span className="text-valar-indigo/40 normal-case font-normal">(optional)</span></label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" className="bg-valar-fog w-full h-10 px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-valar-navy uppercase tracking-wide">Message</label>
                  <textarea id="message" name="message" rows={5} required placeholder="Tell us what you'd like to discuss." className="bg-valar-fog w-full p-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20 resize-none placeholder:text-valar-indigo/40" />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full bg-valar-navy hover:bg-valar-indigo text-white font-bold py-3 rounded-sm transition-colors text-sm disabled:opacity-60">
                  {submitting ? "Sending…" : "Send Message"}
                </button>
                <p className="text-center text-xs text-valar-indigo/50">
                  By submitting, you agree to our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-valar-navy">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
