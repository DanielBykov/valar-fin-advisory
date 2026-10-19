"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Play, type LucideIcon } from "lucide-react";

export type WebinarChapter = {
  /** As Lena reads it off the player: "m:ss" or "h:mm:ss". */
  at: string;
  title: string;
};

export type WebinarSection = { title: string; chapters: WebinarChapter[] };

function toSeconds(at: string): number {
  return at.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

/**
 * The recording, its chapters, and the form that unlocks them.
 *
 * The chapters are on the page, not in the player. Cloudflare's player has no
 * chapter markers, and a list written here is in Ukrainian and in the site's
 * own type.
 *
 * The full list with its timings is part of what the email buys (Lena,
 * 2026-10-16). Before the form, the questions the webinar answers sit under
 * the video instead — enough for a visitor to see that their question is in
 * there, and they fill the space the frame leaves beside a taller form. After
 * it, the eight blocks appear below with their timings, and each line jumps
 * the player.
 *
 * The frame is a fixed 16:9 because the recording is. A frame that stretched
 * to the form's height put black bars above and below the video.
 */
export function UaWebinarPlayer({
  embedUrl,
  unlocked,
  title,
  sections,
  teaser,
  duration,
  poster,
  aside,
  unlockedNote,
}: {
  embedUrl: string | null;
  unlocked: boolean;
  title: string;
  /** The webinar's own blocks, each holding the timings inside it. */
  sections: WebinarSection[];
  /** What sits under the video before the form is filled in. */
  teaser: {
    facts: string[];
    heading: string;
    questions: string[];
    /** What the visitor walks away with, each line led by an icon and a bold phrase. */
    outcomes: { icon: LucideIcon; lead: string; text: string }[];
  };
  /** Shown above the full contents, e.g. "1 год 54 хв". */
  duration: string;
  /** What fills the frame until the player can. */
  poster: ReactNode;
  /** The capture form, beside the player until it has been filled in. */
  aside: ReactNode;
  /** A line under the full-width player once the form is done with. */
  unlockedNote: ReactNode;
}) {
  /*
   * A chapter click reloads the player at that point rather than seeking the
   * one already there. Cloudflare's player SDK was tried first and its seek
   * never reached a player that had not started yet, which is every player
   * on this page until someone presses play (2026-10-16). `startTime` and
   * `autoplay` on the embed URL are honoured on load, need no script from a
   * third party, and the click itself is what lets the browser autoplay.
   *
   * `jump.n` changes on every click so the frame reloads even when the same
   * chapter is clicked twice.
   */
  const [jump, setJump] = useState<{ seconds: number; n: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const src =
    !unlocked || embedUrl === null
      ? null
      : jump === null
        ? embedUrl
        : `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}startTime=${jump.seconds}s&autoplay=true`;
  const playable = src !== null;

  function jumpTo(seconds: number) {
    setJump((prev) => ({ seconds, n: (prev?.n ?? 0) + 1 }));
    // On a phone the list sits a screen below the player, so a click that
    // starts the video somewhere out of sight looks like it did nothing.
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <>
      {/* Two columns while there is a form to fill in, one once there is not
          (Lena, 2026-10-16): the form has done its job, and the space it held
          goes to the video, which is what the person came for.

          Stretched rather than top-aligned: the closing note below the video
          is pinned to the bottom of its column so it ends level with the form
          beside it. */}
      <div className={`mt-10 grid gap-10 ${unlocked ? "" : "md:grid-cols-[1.45fr_1fr]"}`}>
        <div className="flex flex-col">
          <div
            ref={frameRef}
            className="relative aspect-video w-full scroll-mt-6 overflow-hidden rounded-sm bg-valar-navy"
          >
            {src !== null ? (
              <iframe
                key={jump?.n ?? 0}
                src={src}
                title={title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              poster
            )}
          </div>

          {unlocked && <div className="mt-5">{unlockedNote}</div>}

          {!unlocked && (
            <div className="mt-5 flex flex-1 flex-col">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                {teaser.facts.join(" · ")}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-valar-navy">{teaser.heading}</p>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 md:mb-6">
                {teaser.questions.map((q) => (
                  <li key={q} className="flex gap-3 text-[15px] leading-snug text-valar-navy">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-valar-amber" />
                    {q}
                  </li>
                ))}
              </ul>
              {/* The same amber wash as the page's other asides, so it reads as
                  a promise set apart from the list rather than one more line
                  of it. `mt-auto` is what lands it level with the form.

                  Two lines, each led by an icon and a bold phrase, rather than
                  one paragraph (Lena, 2026-10-16): as running text it read pale
                  and gave the eye nothing to land on. */}
              <ul className="mt-6 space-y-3 rounded-sm border-l-2 border-valar-amber bg-valar-amber/15 px-5 py-4 md:mt-auto">
                {teaser.outcomes.map(({ icon: Icon, lead, text }) => (
                  <li key={lead} className="flex gap-3 text-[15px] leading-relaxed text-valar-navy">
                    <Icon
                      className="mt-1 h-[18px] w-[18px] shrink-0 text-valar-amber"
                      strokeWidth={2}
                    />
                    <span>
                      <span className="font-bold">{lead}</span> {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {!unlocked && aside}
      </div>
      {unlocked && (
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Зміст вебінару
            </p>
            <p className="text-[14px] text-valar-indigo/70">
              {duration} ·{" "}
              {playable
                ? "натисніть на розділ, щоб перейти до нього"
                : "розділи стануть клікабельними, щойно запис буде на сторінці"}
            </p>
          </div>

          {/* Columns, not a grid: the list reads down the first column and then
            the second, which is the order the webinar runs in. A two-column
            grid would read across, alternating early and late blocks. A block
            never splits across the columns. */}
          <div className="mt-5 gap-x-10 md:columns-2">
            {sections.map((s) => (
              <div key={s.title} className="mb-6 break-inside-avoid">
                <p className="text-[15px] font-bold text-valar-navy">{s.title}</p>
                <ol className="mt-1">
                  {s.chapters.map((c) => {
                    const row = (
                      <>
                        <span className="w-[4.25rem] shrink-0 text-[14px] font-semibold tabular-nums text-valar-amber">
                          {c.at}
                        </span>
                        <span className="text-[15px] leading-snug text-valar-indigo">
                          {c.title}
                        </span>
                      </>
                    );
                    return (
                      <li key={c.at} className="border-b border-valar-concrete/70">
                        {playable ? (
                          <button
                            type="button"
                            onClick={() => jumpTo(toSeconds(c.at))}
                            className="group flex w-full items-baseline gap-3 py-2 text-left transition-colors hover:bg-valar-fog"
                          >
                            {row}
                            <Play className="ml-auto h-3.5 w-3.5 shrink-0 self-center text-valar-amber opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        ) : (
                          <div className="flex items-baseline gap-3 py-2">{row}</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
