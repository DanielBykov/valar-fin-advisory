"use client";

import { Printer } from "lucide-react";

/**
 * The only interactive thing on the report sheet. Split out so the sheet itself
 * can stay a server component — the arithmetic runs once, on the server.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-valar-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-valar-navy/90"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print or save as PDF
    </button>
  );
}
