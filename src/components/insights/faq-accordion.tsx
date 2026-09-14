"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { FaqItem } from "@/lib/faqs";

/**
 * Takes only the three fields it actually renders, not a whole `FaqItem`.
 *
 * The FAQ page passes items parsed out of `content/faqs.md`, which carry draft
 * flags, service tags and review dates as well. `/ua` writes its questions in
 * TypeScript and has none of those — and requiring it to invent `draft: false`
 * to reuse a working accordion would be the type asking for paperwork rather
 * than for what it needs.
 */
export default function FaqAccordion({
  items,
  defaultOpen = 0,
}: {
  items: Pick<FaqItem, "id" | "question" | "answer">[];
  /**
   * Which item starts expanded, or `null` for none.
   *
   * `/ua` renders four of these, one per group of questions. Four accordions
   * each opening their own first item would show four answers at once, which
   * is the wall the grouping exists to avoid — so only the first group opens
   * one, and the rest start closed.
   */
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div data-cmp="FaqAccordion" className="border-t border-valar-concrete">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.id} data-cmp="FaqAccordion.Item" className="border-b border-valar-concrete">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-valar-navy transition-colors hover:text-valar-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valar-amber"
              >
                {item.question}
                <span className="shrink-0 text-valar-amber" aria-hidden="true">
                  {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="space-y-3 pb-6 text-base leading-relaxed text-gray-600"
            >
              {item.answer.map((block, b) =>
                block.type === "p" ? (
                  <p key={b}>{block.text}</p>
                ) : (
                  <ul key={b} className="list-disc space-y-1 pl-5">
                    {block.items.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
