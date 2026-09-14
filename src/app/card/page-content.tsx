"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import avatarImg from "../../../public/images/lena-avatar.webp";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Globe,
  House,
  Linkedin,
  Mail,
  Phone,
  QrCode,
  UserPlus,
} from "lucide-react";
import { CARD_CONTACT, CARD_VCF_PATH } from "@/lib/business-card";

// /card is where the QR code on Lena's printed business card lands, so it is
// built like /start: no site chrome, no entrance animation, one column of
// full-width tap targets. The difference is the primary action. Someone met at
// a networking event is not ready to book a call yet; they are ready to keep
// the contact. So "Save my contact" leads and booking sits in the shelf below.

const tile =
  "group w-full flex items-center gap-4 rounded-sm px-5 py-4 text-left transition-colors cursor-pointer";
const tileSecondary =
  "border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/50 text-white";
const contactRow =
  "flex items-center gap-4 px-5 py-3.5 text-[15px] text-white/90 transition-colors hover:bg-white/[0.06] hover:text-white";

export default function CardContent() {
  const [androidHint, setAndroidHint] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const c = CARD_CONTACT;

  const contacts = [
    { href: `tel:${c.phoneDial}`, label: c.phoneDisplay, Icon: Phone, external: false },
    { href: `mailto:${c.email}`, label: c.email, Icon: Mail, external: false },
    { href: c.linkedin, label: c.linkedinDisplay, Icon: Linkedin, external: true },
    { href: "/", label: "valar.co.nz", Icon: Globe, external: false },
  ];

  // Business first, then home buyers: the card is handed out at networking
  // events where both kinds of people are in the room.
  const shelf = [
    {
      href: "/services/small-business-loans",
      title: "Small Business Loans",
      sub: "Funding for equipment, vehicles, cashflow and growth.",
      Icon: Briefcase,
      cmp: "BusinessLoans",
    },
    {
      href: "/services/first-home-buyers",
      title: "First Home Buyers",
      sub: "From first questions to a clear plan.",
      Icon: House,
      cmp: "FirstHome",
    },
    {
      href: "/book",
      title: "Book a clarity call",
      sub: "Talk through your situation with me.",
      Icon: Calendar,
      cmp: "Book",
    },
  ];

  return (
    <div
      data-cmp="CardPage"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-valar-navy font-sans"
    >
      {/* The same banner-artwork gradient as /start. See the note there for why
          it is a gradient and not the source PNG. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(105deg, #051633 0%, #14274f 38%, #24375e 38%, #2b416d 60%, #384c77 60%, #475e94 100%)",
        }}
      />

      <div
        data-cmp="CardPage.Column"
        className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 py-12 md:my-12 md:rounded-sm md:border md:border-white/10 md:bg-valar-navy/25 md:px-10 md:py-14 md:shadow-2xl"
      >
        <div className="relative h-8 w-[150px]">
          <Image src="/images/valar-logo.webp" alt="Valar" fill sizes="150px" priority className="object-contain" />
        </div>

        {/* lena-avatar.webp is already a face-centred square crop, so a plain
            cover fill works here without the offset trick /start needs. */}
        <div className="mt-9 relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-valar-amber ring-offset-4 ring-offset-valar-navy">
          <Image
            src={avatarImg}
            alt="Lena Bykova"
            fill
            sizes="128px"
            placeholder="blur"
            priority
            className="object-cover"
          />
        </div>

        <h1 className="mt-7 text-center text-[30px] font-medium leading-tight tracking-tight text-white">
          Lena Bykova
        </h1>
        <p className="mt-2 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          {c.title}
        </p>
        <p className="mt-4 max-w-md text-center text-[17px] font-light leading-relaxed text-white/85">
          Home loans and investment property. I also help business owners with lending.
        </p>

        {/* PRIMARY. A plain <a> with no download attribute, so the phone decides
            what to do with a vCard: iPhone opens the contact sheet, Android
            downloads the file and needs one more tap, hence the hint. */}
        <div className="mt-8 w-full">
          <a
            href={CARD_VCF_PATH}
            onClick={() => setAndroidHint(/android/i.test(navigator.userAgent))}
            data-cmp="CardPage.Link.SaveContact"
            className={`${tile} bg-valar-amber text-valar-navy hover:bg-valar-amber-hover`}
          >
            <UserPlus className="h-5 w-5 shrink-0" />
            <span className="flex-1 font-bold">Save my contact</span>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
          {androidHint && (
            <p role="status" className="mt-3 text-center text-sm font-light text-valar-lilac">
              On Android, tap Open on the download to add me to your contacts.
            </p>
          )}
        </div>

        <ul
          data-cmp="CardPage.Contacts"
          className="mt-6 w-full divide-y divide-white/10 rounded-sm border border-white/15"
        >
          {contacts.map(({ href, label, Icon, external }) => {
            const inner = (
              <>
                <Icon className="h-[18px] w-[18px] shrink-0 text-valar-amber" />
                <span className="truncate">{label}</span>
              </>
            );
            return (
              <li key={href}>
                {href === "/" ? (
                  <Link href={href} className={contactRow}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className={contactRow}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-9 self-start text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          Where I can help
        </p>
        <div className="mt-3 flex w-full flex-col gap-3">
          {shelf.map(({ href, title, sub, Icon, cmp }) => (
            <Link key={href} href={href} data-cmp={`CardPage.Link.${cmp}`} className={`${tile} ${tileSecondary}`}>
              <Icon className="h-5 w-5 shrink-0 text-valar-amber" />
              <span className="flex-1">
                <span className="block font-bold">{title}</span>
                <span className="block text-sm font-light text-valar-lilac">{sub}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-valar-lilac transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {/* For Lena more than the visitor: at an event with no printed cards left
            she opens this page on her phone and the other person scans it. */}
        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          aria-expanded={qrOpen}
          data-cmp="CardPage.QrToggle"
          className="mt-9 inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-valar-horizon transition-colors hover:text-valar-amber"
        >
          <QrCode className="h-4 w-4" />
          {qrOpen ? "Hide QR code" : "Show QR code"}
        </button>
        {qrOpen && (
          <div data-cmp="CardPage.Qr" className="mt-4 overflow-hidden rounded-sm bg-white">
            <Image
              src="/images/valar-card-qr.svg"
              alt="QR code for valar.co.nz/card"
              width={220}
              height={220}
              unoptimized
              className="block"
            />
          </div>
        )}

        {/* The Disclosure link keeps the public disclosure one tap away, as on
            /start. Keep it when tidying. */}
        <div className="mt-10 w-full border-t border-white/10 pt-6 text-center">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-valar-lilac/60">
            <Link href="/disclosure" className="transition-colors hover:text-valar-amber">Disclosure</Link>
            <span className="text-valar-lilac/25">|</span>
            <Link href="/privacy-policy" className="transition-colors hover:text-valar-amber">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
