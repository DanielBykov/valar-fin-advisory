"use client";

/*
 * Share row at the end of every article. Plain share links rather than the
 * platforms' own widgets: those load third-party scripts that set cookies
 * before consent, and the site only loads Meta's pixel after the banner.
 *
 * Client component only for "Copy link", which needs the clipboard and a
 * moment of "Copied" feedback.
 */

import { useState } from "react";
import { Check, Facebook, Link as LinkIcon, Linkedin, Mail, MessageCircle } from "lucide-react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: Facebook,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: Linkedin,
    },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: MessageCircle },
    { label: "Email", href: `mailto:?subject=${t}&body=${u}`, Icon: Mail },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (old browser, insecure context): nothing useful to show.
    }
  };

  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-valar-concrete bg-white px-3.5 py-2 text-[14px] font-semibold text-valar-navy transition-colors hover:border-valar-navy";

  return (
    <div data-cmp="ArticlePage.Share" className="my-10">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-navy">
        Found this useful? Share it
      </p>
      <div className="flex flex-wrap gap-2.5">
        {links.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={btn}>
            <Icon aria-hidden className="h-4 w-4" strokeWidth={2} />
            {label}
          </a>
        ))}
        <button type="button" onClick={copy} className={btn}>
          {copied ? (
            <Check aria-hidden className="h-4 w-4 text-valar-indigo" strokeWidth={2.5} />
          ) : (
            <LinkIcon aria-hidden className="h-4 w-4" strokeWidth={2} />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
