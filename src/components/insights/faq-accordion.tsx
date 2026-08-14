"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Faq } from "@/lib/insights";

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div data-cmp="FaqAccordion" className="border-t border-valar-concrete">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} data-cmp="FaqAccordion.Item" className="border-b border-valar-concrete">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-valar-navy transition-colors hover:text-valar-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valar-amber"
              >
                {item.q}
                <span className="shrink-0 text-valar-amber" aria-hidden="true">
                  {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="max-w-[62ch] pb-6 text-[15px] leading-relaxed text-gray-600"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
