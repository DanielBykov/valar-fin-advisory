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
   * actually in. The calculators are in English and saying so on the tile is
   * the honest version: a Ukrainian speaker who taps expecting Ukrainian and
   * gets English has been told something untrue by the page.
   */
  meta?: string;
};

export const UA_RESOURCES: UaResource[] = [
  /*
   * The calculators are the only resources that exist in a finished, linkable
   * state today. They are in English — deliberately listed anyway, because the
   * numbers are the point and a person deciding whether they can afford a
   * house will work through an English form to find out.
   */
  {
    kind: "tool",
    title: "Скільки я можу позичити",
    description:
      "Оцінка суми, яку банк може дати саме вам, з урахуванням доходу, боргів і депозиту.",
    href: "/calculators/what-can-i-buy",
    meta: "Англійською",
  },
  {
    kind: "tool",
    title: "Розрахунок платежів",
    description:
      "Скільки виходить на місяць, скільки відсотків ви заплатите за весь термін, і що змінює дострокове погашення.",
    href: "/calculators/repayments",
    meta: "Англійською",
  },
  {
    kind: "tool",
    title: "Оренда чи покупка",
    description:
      "Порівняння двох сценаріїв на одному горизонті: що насправді виходить дорожче.",
    href: "/calculators/rent-vs-buy",
    meta: "Англійською",
  },
  {
    kind: "tool",
    title: "Розділення кредиту",
    description:
      "Як розбити позику на частини з різними ставками й термінами, і що це дає.",
    href: "/calculators/split-loan",
    meta: "Англійською",
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
