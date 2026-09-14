/**
 * Every place the site asks for an email in exchange for something, described
 * once.
 *
 * It exists because the description used to be copied into each page. Four
 * pages held their own `FIRST_HOME_GUIDE` literal, and the split calculator's
 * "Split structure review" carried `key: "first-home-buyer-guide"` — a
 * copy-paste that pointed its download button at the wrong PDF. A capture point
 * now names a magnet and nothing else, so there is one thing to change and
 * nothing to keep in step.
 *
 * The MailerLite group is part of the magnet, not the page. The group decides
 * which automation fires, and the automation delivers a specific document — so
 * enrolling someone by which page they happened to be on is how a person who
 * asked for the first home guide ends up being sent something else.
 */

export type LeadMagnetKey =
  | "first-home-buyer-guide"
  | "pay-your-mortgage-off-faster"
  | "split-structure-review"
  | "ua-home-buying-journey"
  | "ua-first-home-webinar";

/**
 * Env var names, not values. The ids are secrets-adjacent configuration that
 * differs between local and Vercel, and this module is imported by client
 * components — only the server ever resolves one.
 */
export type GroupEnvVar =
  | "MAILERLITE_FHB_GROUP_ID"
  | "MAILERLITE_CALCULATORS_GROUP_ID"
  | "MAILERLITE_UA_GROUP_ID";

export type LeadMagnet = {
  key: LeadMagnetKey;
  /** Shown on the capture card, in the email, and in Lena's notification. */
  title: string;
  description?: string;
  /** Which MailerLite group this enrols into, and therefore which automation fires. */
  groupEnv: GroupEnvVar;
  /**
   * Where a lead goes when `groupEnv` is not configured yet.
   *
   * Defaults to the first home buyers group: a lead in roughly the right
   * nurture beats a lead in none while a group is being created. `null` opts
   * out, and the Ukrainian magnet does — its automation has to be written in
   * Ukrainian, and someone who asked in Ukrainian receiving an English welcome
   * sequence is a worse outcome than receiving nothing. They still reach Lena,
   * and the document still downloads on the spot.
   */
  fallbackGroupEnv?: GroupEnvVar | null;
  /** Names the group in Lena's notification email. */
  groupLabel: string;
  /**
   * Public path of the PDF. Undefined means there is nothing to hand over: the
   * lead is still captured and Lena is still told, but nothing offers a
   * download that would 404 and nothing promises a document that cannot be
   * sent. For the webinar that is permanent and deliberate — see below.
   */
  file?: string;
  /**
   * What the thank-you screen says when there is no file. The default assumes a
   * document still being written, which is wrong for a magnet that is not a
   * document at all — a structure review is answered by Lena, not finished.
   */
  pendingNote?: string;
  /**
   * The document's own cover, shown on the capture card so the offer is a thing
   * rather than a sentence. Sits with the magnet for the same reason the group
   * does: a page names a magnet, and everything about it follows from that.
   */
  cover?: { src: string; width: number; height: number };
};

export const LEAD_MAGNETS: Record<LeadMagnetKey, LeadMagnet> = {
  "first-home-buyer-guide": {
    key: "first-home-buyer-guide",
    title: "First Home Buyer Guide",
    description:
      "A practical roadmap with clear steps you can work through, tick off, and make your own.",
    groupEnv: "MAILERLITE_FHB_GROUP_ID",
    groupLabel: "First home buyers",
    file: "/resources/guides/first-home-buyer-guide.pdf",
  },

  /*
   * Two A4 pages, ten strategies, one worked example. The title is the
   * numeral because that is what the document calls itself on its own cover —
   * a guide that arrives named differently from the email that promised it
   * reads like the wrong attachment.
   */
  "pay-your-mortgage-off-faster": {
    key: "pay-your-mortgage-off-faster",
    title: "10 Ways to Pay Your Mortgage Off Faster",
    description:
      "The things that actually move the number, in the order worth doing them.",
    groupEnv: "MAILERLITE_CALCULATORS_GROUP_ID",
    groupLabel: "Calculators",
    file: "/resources/guides/pay-your-mortgage-off-faster.pdf",
    cover: {
      src: "/images/guides/pay-your-mortgage-off-faster.png",
      width: 904,
      height: 286,
    },
  },

  /*
   * Not a download. Someone sends their split structure and Lena comes back on
   * it personally, so there is no file and never will be. It sits in the
   * calculators group because the nurture that follows — how to get a mortgage
   * down faster — is the right one for a person modelling extra repayments.
   */
  "split-structure-review": {
    key: "split-structure-review",
    title: "Split structure review",
    description:
      "Send Lena your split and she will come back on what she would change — the parts, the terms, and where the extra repayment is doing the most work.",
    groupEnv: "MAILERLITE_CALCULATORS_GROUP_ID",
    groupLabel: "Calculators",
    pendingNote:
      "Lena will look at your split herself and come back to you — usually within a working day.",
  },

  /*
   * The Ukrainian page's magnet, and the only one whose copy is not in English:
   * title and description are rendered verbatim on the capture card, in the
   * confirmation screen and in the email subject, so a Ukrainian magnet that
   * described itself in English would break the page's only promise at the
   * exact moment someone acts on it.
   *
   * Its own MailerLite group, for the ordinary reason a magnet has one — the
   * group decides which automation fires, and the automation that follows this
   * one has to be written in Ukrainian. Until that group exists the request
   * still succeeds and the download link on the confirmation screen still
   * works; what is missing is the nurture, not the document.
   */
  "ua-home-buying-journey": {
    key: "ua-home-buying-journey",
    title: "Як купити свій перший будинок?",
    description:
      "Покроковий гайд і Coaching Workbook для тих, хто купує житло вперше: від першого кроку до ключів.",
    groupEnv: "MAILERLITE_UA_GROUP_ID",
    groupLabel: "Ukrainian community",
    fallbackGroupEnv: null,
    file: "/resources/guides/home-buying-journey-ua.pdf",
  },

  /*
   * The recorded webinar, gated the same way the guide is: an email buys a
   * link rather than a file. It shares the Ukrainian group deliberately —
   * the same person, the same language, and one nurture sequence rather than
   * two half-written ones. Which of the two they asked for is carried by
   * `lead_source`, which is why the two capture points on `/ua` pass
   * different `source` strings.
   *
   * No `file`, and there never will be one. The recording is not a thing that
   * gets sent — it plays embedded on `/ua` and nowhere else, because a link in
   * an inbox is a link that gets forwarded and the whole point of gating it is
   * that it is not. What the page swaps in on success is the player itself;
   * see `WEBINAR_EMBED_URL` in the page.
   *
   * That is also why `pendingNote` reads as a finished state rather than a
   * promise: for this magnet the "not ready" branch is the only branch.
   */
  "ua-first-home-webinar": {
    key: "ua-first-home-webinar",
    title: "Вебінар: як працює іпотека в Новій Зеландії",
    description:
      "Запис, який можна дивитися коли завгодно, просто на цій сторінці.",
    groupEnv: "MAILERLITE_UA_GROUP_ID",
    groupLabel: "Ukrainian community",
    fallbackGroupEnv: null,
    pendingNote: "Запис відкрито на цій сторінці. Вмикайте.",
  },
};

export function getLeadMagnet(key: unknown): LeadMagnet | undefined {
  return typeof key === "string" ? LEAD_MAGNETS[key as LeadMagnetKey] : undefined;
}

/** Whether there is something to deliver yet. */
export function isReady(magnet: LeadMagnet): boolean {
  return Boolean(magnet.file);
}

