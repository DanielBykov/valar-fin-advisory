"use client";

import { X } from "lucide-react";
import { type LeadMagnet } from "@/lib/lead-magnets";
import { GuideCaptureForm, type CaptureCopy } from "@/components/guide-capture-form";

interface GuideDownloadModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * What is being offered, straight from the registry. Whether there is a file
   * to download is a property of the magnet, not something a page restates —
   * the split calculator used to declare a key that pointed its download button
   * at somebody else's PDF.
   */
  guide: LeadMagnet;
  /**
   * Which page asked. The same magnet is offered from five places, and knowing
   * which one is the difference between a list and a list you can act on.
   */
  source: string;
  /** Overrides for any visible string — see `CaptureCopy`. */
  copy?: Partial<CaptureCopy>;
  /**
   * Replaces the title block above the fields. The Valári download needs its
   * terms read before the form, which a title and a description cannot carry.
   */
  header?: React.ReactNode;
  /** Passed to the form: first and last name on one row. */
  pairNames?: boolean;
}

/**
 * The dialog around the capture form: backdrop, card, close.
 *
 * The exchange itself lives in `GuideCaptureForm`, which the Ukrainian page
 * renders straight onto the page instead. A cold visitor from a Facebook group
 * is one tap from leaving, and a form behind a button is that tap.
 */
export function GuideDownloadModal({
  open,
  onClose,
  guide,
  source,
  copy,
  header,
  pairNames,
}: GuideDownloadModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-valar-navy/70 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      {/* Scrolls inside itself: a longer form (the Valári one, with terms and
          two ticks) is taller than a phone screen, and a fixed card cut it off. */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 z-10 text-left">
        <button
          onClick={onClose}
          // On a white chip so it stays visible over a dark header as well.
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-1 text-valar-indigo/60 hover:text-valar-navy transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <GuideCaptureForm
          guide={guide}
          source={source}
          copy={copy}
          onClose={onClose}
          pairNames={pairNames}
          header={
            header ?? (
              <div className="mb-6">
                <div className="h-[2px] w-6 bg-valar-amber mb-4" />
                <h2 className="text-xl font-bold text-valar-navy mb-1">{guide.title}</h2>
                {guide.description && (
                  <p className="text-sm text-valar-indigo leading-relaxed">{guide.description}</p>
                )}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
