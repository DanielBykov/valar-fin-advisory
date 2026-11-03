/**
 * Everything the Russian page links out to, the same growing list as
 * `ua-resources.ts`: a section appears when it has a row and is absent until
 * then, because a heading over nothing tells a cold visitor the page is
 * unfinished.
 */

import { Calculator, Split, Wallet } from "lucide-react";
import type { UaResource, UaResourceKind } from "@/lib/ua-resources";

export const RU_RESOURCES: UaResource[] = [
  {
    kind: "tool",
    title: "Расчёт платежей",
    description: "Платежи за весь срок и эффект досрочного погашения.",
    href: "/calculators/repayments",
    icon: Calculator,
  },
  {
    kind: "tool",
    title: "Mortgage split",
    description: "Как разбить кредит на части с разными ставками и сроками.",
    href: "/calculators/split-loan",
    icon: Split,
  },
  {
    kind: "tool",
    title: "Сколько я могу занять?",
    description: "Расчёт комфортного вам платежа и тест на рост ставок в будущем.",
    href: "/calculators/what-can-i-buy",
    icon: Wallet,
  },
];

export function ruResourcesOfKind(kind: UaResourceKind): UaResource[] {
  return RU_RESOURCES.filter((r) => r.kind === kind);
}
