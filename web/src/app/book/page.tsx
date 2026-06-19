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
