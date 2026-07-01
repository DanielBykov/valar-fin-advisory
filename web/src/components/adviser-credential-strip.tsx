import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Service-page E-E-A-T strip — short adviser credential block referencing
 * Lena Bykova, FSP number and years of experience, with a link to About.
 *
 * Server component. Drop it into any service page (above the final CTA) to
 * surface the author/adviser behind the page — required for YMYL finance SEO.
 */
export function AdviserCredentialStrip() {
  return (
    <section
      data-cmp="AdviserCredentialStrip"
      className="py-12 bg-white border-y border-valar-concrete"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-valar-amber">
            <Image
              src="/images/lena-portrait.jpg"
              alt="Lena Bykova, Mortgage & Investment Adviser"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-valar-amber font-bold mb-1">
              Advice from
            </p>
            <h3 className="text-xl font-bold text-valar-navy mb-1">
              Lena Bykova — Mortgage & Investment Adviser
            </h3>
            <p className="text-sm text-valar-indigo">
              Licensed Financial Adviser (FSP1010055) · 20+ years across finance, valuation, investment analysis and business advisory in New Zealand.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-bold text-valar-navy hover:text-valar-amber transition-colors whitespace-nowrap group"
          >
            About Lena
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
