"use client";

import Image from "next/image";
import { InlineWidget } from "react-calendly";

export default function BookPage() {
  return (
    <div data-cmp="BookPage" className="w-full flex flex-col bg-valar-fog min-h-screen">
      <section data-cmp="BookPage.Hero" className="relative text-white px-4 md:px-6 overflow-hidden min-h-[120px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/book-hero.png" alt="Book a clarity call" fill priority className="object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-valar-navy/50" />
        </div>
        <div className="container mx-auto max-w-3xl text-center relative z-10 pt-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Book a Clarity Call<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light text-sm mt-1">
            Free 15–20 minute call — pick a time that works for you.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section data-cmp="BookPage.Disclaimer" className="py-6 px-4 md:px-6 bg-white border-b border-valar-concrete">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="h-full w-[2px] bg-valar-amber flex-shrink-0 self-stretch min-h-[1.5rem]" />
            <div className="space-y-2 text-sm text-valar-indigo leading-relaxed">
              <p className="font-semibold text-valar-navy">What happens on this call</p>
              <p>
                A free 15–20 minute conversation about where you are, what you're trying to achieve, and whether Valar is the right fit.
              </p>
              <p className="italic text-valar-indigo/70">
                This call is not a financial advice service. Regulated advice begins only after both parties have signed a scope of engagement. There is no obligation to proceed and no fee for this call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-cmp="BookPage.Calendly" className="py-0 px-4 pb-2">
        <p className="text-center text-xs text-valar-indigo/60 pt-3">
          By booking, you agree to our{" "}
          <a href="/privacy-policy" className="underline hover:text-valar-navy">Privacy Policy</a>.
        </p>
        <div className="container mx-auto max-w-3xl">
          <InlineWidget
            url="https://calendly.com/lena-bykova-valar/new-meeting"
            styles={{ height: "750px" }}
            pageSettings={{
              backgroundColor: "f7f7f5",
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: "f0a500",
              textColor: "061634",
            }}
          />
        </div>
      </section>
    </div>
  );
}
