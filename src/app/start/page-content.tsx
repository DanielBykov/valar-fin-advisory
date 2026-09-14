"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import portraitImg from "../../../public/images/lena-portrait.webp";
import { Calendar, ArrowRight, Download, Gauge, ChevronDown, Globe, Instagram, Linkedin, Facebook } from "lucide-react";
import { GuideDownloadModal } from "@/components/guide-download-modal";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";


// Set this to the borrowing-capacity tool's URL and the tile appears. Left null
// on purpose: a dead link in the Instagram bio is worse than one fewer tile.
const BORROWING_CAPACITY_URL: string | null = null;

// No entrance animation on this page, deliberately. Nearly all of its traffic
// arrives in the Instagram in-app browser — the slowest, most throttled context
// the site runs in — and a JS-driven fade-in there can leave a first-time
// visitor looking at a blank navy screen. The links paint immediately instead.

// Each tile is a full-width tap target: one phone, one thumb.
const tile =
  "group w-full flex items-center gap-4 rounded-sm px-5 py-4 text-left transition-colors cursor-pointer";
const tileSecondary =
  "border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/50 text-white";

export default function StartContent() {
  const [guideOpen, setGuideOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div
      data-cmp="StartPage"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-valar-navy font-sans"
    >
      <GuideDownloadModal open={guideOpen} onClose={() => setGuideOpen(false)} guide={LEAD_MAGNETS["first-home-buyer-guide"]}
        source="Instagram link page" />

      {/* The Valar banner artwork, rebuilt as a gradient rather than shipped as
          the source PNG.

          The artwork is portrait (2474x3498) and this page is viewed at every
          aspect ratio from a 390px phone to a 3440px monitor. object-cover on a
          wide screen crops it to a thin horizontal band, and in that band the
          left 40% of the artwork is #061634 — valar-navy exactly — so the whole
          effect vanished and the page just looked dark blue again.

          Measured off the source: three panels, two crisp diagonal edges at 15°
          off vertical, ramping #051633 -> #455c90. As a gradient it fills any
          viewport with the full composition, stays crisp at any size, costs no
          bytes, and cannot band. No scrim over it — the darkest point is navy
          and the lightest still holds white text at 6.6:1. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(105deg, #051633 0%, #14274f 38%, #24375e 38%, #2b416d 60%, #384c77 60%, #475e94 100%)",
        }}
      />

      {/* On a phone this is simply the page. On a wide monitor it becomes a
          framed card so the narrow column reads as deliberate, not as a
          full-width layout that failed to fill. */}
      <div
        data-cmp="StartPage.Column"
        className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 py-12 md:my-12 md:rounded-sm md:border md:border-white/10 md:bg-valar-navy/25 md:px-10 md:py-14 md:shadow-2xl"
      >
        {/* The plain VALAR mark, not the lockup with the "Financial Advisors"
            tagline — the brand stands alone here. */}
        <div className="relative h-8 w-[150px]">
          <Image src="/images/valar-logo.webp" alt="Valar" fill sizes="150px" priority className="object-contain" />
        </div>

        {/* The source photo is a half-body shot, so the face is small in frame.
            object-position can only shift a cover crop by a few pixels, so the
            image is rendered at 2.6x the circle and offset instead. Framed to
            leave air above the head and shoulders below the chin — tighter than
            this and the crop reads as a mugshot. */}
        <div className="mt-9 relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-valar-amber ring-offset-4 ring-offset-valar-navy">
          <Image
            src={portraitImg}
            alt="Lena Bykova"
            width={333}
            height={373}
            placeholder="blur"
            priority
            className="absolute max-w-none"
            style={{ left: "-106px", top: "-65px" }}
          />
        </div>

        <p className="mt-7 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          Lena Bykova
        </p>

        <h1 className="mt-3 text-center text-[26px] font-medium leading-snug tracking-tight text-white">
          More than a mortgage adviser<span className="text-valar-amber">.</span>
        </h1>

        {/* One paragraph, and it stops short of naming the action — the button
            immediately below already says "book a clarity call". */}
        <p className="mt-4 max-w-md text-center text-[17px] font-light leading-relaxed text-white/85">
          I help you get the home loan and build wealth behind it.
          Feel free to discuss your financial situation.
        </p>

        {/* PRIMARY */}
        <div className="mt-8 w-full">
          <Link
            href="/book"
            data-cmp="StartPage.Link.Book"
            className={`${tile} bg-valar-amber text-valar-navy hover:bg-valar-amber-hover`}
          >
            <Calendar className="h-5 w-5 shrink-0" />
            <span className="flex-1 font-bold">Book a clarity call</span>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* SECONDARY */}
        <p className="mt-8 self-start text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          Or take something useful with you
        </p>

        <div className="mt-3 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            data-cmp="StartPage.Link.Guide"
            className={`${tile} ${tileSecondary}`}
          >
            <Download className="h-5 w-5 shrink-0 text-valar-amber" />
            <span className="flex-1">
              <span className="block font-bold">First Home Buyer Guide</span>
              <span className="block text-sm font-light text-valar-lilac">
                Free — sent straight to your inbox.
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-valar-lilac transition-transform group-hover:translate-x-1" />
          </button>

          {BORROWING_CAPACITY_URL && (
            <Link
              href={BORROWING_CAPACITY_URL}
              data-cmp="StartPage.Link.Borrowing"
              className={`${tile} ${tileSecondary}`}
            >
              <Gauge className="h-5 w-5 shrink-0 text-valar-amber" />
              <span className="flex-1">
                <span className="block font-bold">How much can you borrow?</span>
                <span className="block text-sm font-light text-valar-lilac">
                  Check your borrowing capacity in a couple of minutes.
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-valar-lilac transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {/* Opens in place rather than navigating — a visitor who taps "about"
              should not be thrown out of the page they came to. */}
          <div>
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
              data-cmp="StartPage.Link.About"
              className={`${tile} ${tileSecondary} ${aboutOpen ? "rounded-b-none border-b-0" : ""}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm font-bold text-valar-amber">
                L
              </span>
              <span className="flex-1">
                <span className="block font-bold">About Lena</span>
                <span className="block text-sm font-light text-valar-lilac">
                  20+ years in Finance and Investments
                </span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-valar-lilac transition-transform ${aboutOpen ? "rotate-180" : ""}`}
              />
            </button>

            {aboutOpen && (
              <div
                data-cmp="StartPage.About.Panel"
                className="space-y-3 rounded-b-sm border border-t-0 border-white/25 bg-white/[0.06] px-5 pb-5 pt-1 text-[15px] font-light leading-relaxed text-valar-lilac"
              >
                <p>
                  Hi, I&apos;m Lena. I help people make confident property and financial decisions —
                  mortgage advice, financial planning, and strategic thinking.
                </p>
                <p>
                  I&apos;ve always been focused on strategy, thinking ahead, and using financial
                  resources wisely. Better financial decisions create more freedom, stability and
                  opportunity for people and their families.
                </p>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/"
          data-cmp="StartPage.Link.Website"
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-valar-horizon transition-colors hover:text-valar-amber"
        >
          There&apos;s more on my website
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* SOCIALS — the globe goes to the site, alongside the three channels */}
        <div className="mt-8 flex items-center gap-3">
          {[
            { href: "https://www.instagram.com/lena.valarnz/", label: "Instagram", Icon: Instagram },
            { href: "https://www.linkedin.com/company/valar-advisors", label: "LinkedIn", Icon: Linkedin },
            { href: "https://www.facebook.com/lena.valarnz", label: "Facebook", Icon: Facebook },
            { href: "https://valar.co.nz", label: "Website", Icon: Globe },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-valar-lilac transition-colors hover:border-valar-amber hover:text-valar-amber"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        {/* Name and title live here, under the brand rather than competing with it.
            The Disclosure link is what satisfies the standing public-disclosure
            obligation — keep it. */}
        <div className="mt-10 w-full border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-white/80">
            Lena Bykova <span className="text-valar-lilac/40">&middot;</span>{" "}
            <span className="text-valar-lilac">Financial Adviser</span>
          </p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-valar-lilac/60">
            <Link href="/" className="transition-colors hover:text-valar-amber">valar.co.nz</Link>
            <span className="text-valar-lilac/25">|</span>
            <Link href="/disclosure" className="transition-colors hover:text-valar-amber">Disclosure</Link>
            <span className="text-valar-lilac/25">|</span>
            <Link href="/privacy-policy" className="transition-colors hover:text-valar-amber">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
