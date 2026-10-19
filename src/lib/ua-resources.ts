/**
 * Everything the Ukrainian page links out to, in one list.
 *
 * `/ua` is not a page that gets rewritten each time something new exists — it
 * is a page that grows. A video, a course, an article: each one is a row here,
 * and the section it belongs to appears the moment the row does and stays gone
 * while the list is empty. That is the difference between "add the link" and
 * "redesign the page", and it is the whole reason this file is separate from
 * the page that renders it.
 *
 * An empty section is worse than no section. A heading reading "Відео" over
 * nothing tells a first-time visitor the page is unfinished, which is the one
 * impression a cold landing page cannot afford — so nothing here is a
 * placeholder waiting to be filled in on the page itself.
 */

import { Calculator, Split, Wallet, type LucideIcon } from "lucide-react";

export type UaResourceKind =
  /** Курс — a paid or free structured programme, hosted anywhere. */
  | "course"
  /** Відео — YouTube, Instagram, a webinar recording. */
  | "video"
  /** Стаття — long-form reading, on this site or elsewhere. */
  | "article"
  /** Інструмент — a calculator on this site. */
  | "tool";

export type UaResource = {
  kind: UaResourceKind;
  title: string;
  description: string;
  href: string;
  /**
   * Leaves the site. Controls target/rel, and shows the visitor it will.
   */
  external?: boolean;
  /**
   * A short qualifier under the title — length, price, or the language it is
   * actually in, where saying so helps.
   */
  meta?: string;
  /** Shown in an amber square beside the title, as on the page's other cards. */
  icon?: LucideIcon;
};

export const UA_RESOURCES: UaResource[] = [
  /*
   * The three calculators that are live on the site, each described by the
   * one thing it shows that the others do not (Lena, 2026-10-16).
   *
   * No "Англійською" tag any more, at Lena's call: the forms are numbers and
   * a few labels, people manage, and a language warning on every tile was
   * talking visitors out of trying.
   *
   * Rent-vs-buy is not here: it is switched off in `calculators.ts`, and its
   * tile would have sent people to a 404 on the live site.
   */
  {
    kind: "tool",
    title: "Розрахунок платежів",
    description: "Платіж і відсотки за весь термін. І як дострокове погашення скорочує кредит.",
    href: "/calculators/repayments",
    icon: Calculator,
  },
  {
    kind: "tool",
    title: "Split: розділення кредиту",
    description: "Як розбити позику на частини з різними ставками й термінами.",
    href: "/calculators/split-loan",
    icon: Split,
  },
  {
    kind: "tool",
    title: "Скільки я можу позичити",
    description: "Від платежу, комфортного вам, а не від максимуму банку. З тестом на ріст ставки.",
    href: "/calculators/what-can-i-buy",
    icon: Wallet,
  },

  /*
   * The course and the videos go here as they become linkable. Templates, not
   * dead rows — an entry with no working href would render a tile that 404s,
   * which is worse than the section not existing yet.
   *
   * {
   *   kind: "course",
   *   title: "Як купити дім у Новій Зеландії",
   *   description: "…",
   *   href: "https://…",
   *   external: true,
   *   meta: "Українською · N уроків",
   * },
   *
   * {
   *   kind: "video",
   *   title: "…",
   *   description: "…",
   *   href: "https://youtube.com/…",
   *   external: true,
   *   meta: "Українською · N хв",
   * },
   */
];

export function resourcesOfKind(kind: UaResourceKind): UaResource[] {
  return UA_RESOURCES.filter((r) => r.kind === kind);
}
