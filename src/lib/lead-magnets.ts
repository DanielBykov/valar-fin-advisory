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
  | "split-structure-review";

/**
 * Env var names, not values. The ids are secrets-adjacent configuration that
 * differs between local and Vercel, and this module is imported by client
 * components — only the server ever resolves one.
 */
export type GroupEnvVar = "MAILERLITE_FHB_GROUP_ID" | "MAILERLITE_CALCULATORS_GROUP_ID";

export type LeadMagnet = {
  key: LeadMagnetKey;
  /** Shown on the capture card, in the email, and in Lena's notification. */
  title: string;
  description?: string;
  /** Which MailerLite group this enrols into, and therefore which automation fires. */
  groupEnv: GroupEnvVar;
  /**
   * Public path of the PDF. Undefined means it does not exist yet: the lead is
   * still captured and Lena is still told, but nothing offers a download that
   * would 404 and nothing promises a document that cannot be sent.
   */
  file?: string;
  /**
   * What the thank-you screen says when there is no file. The default assumes a
   * document still being written, which is wrong for a magnet that is not a
   * document at all — a structure review is answered by Lena, not finished.
   */
  pendingNote?: string;
};

export const LEAD_MAGNETS: Record<LeadMagnetKey, LeadMagnet> = {
  "first-home-buyer-guide": {
    key: "first-home-buyer-guide",
    title: "First Home Buyer Guide",
    description:
      "A practical roadmap with clear steps you can work through, tick off, and make your own.",
    groupEnv: "MAILERLITE_FHB_GROUP_ID",
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
    file: "/resources/guides/pay-your-mortgage-off-faster.pdf",
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
    pendingNote:
      "Lena will look at your split herself and come back to you — usually within a working day.",
  },
};

export function getLeadMagnet(key: unknown): LeadMagnet | undefined {
  return typeof key === "string" ? LEAD_MAGNETS[key as LeadMagnetKey] : undefined;
}

/** Whether there is a document to deliver yet. */
export function isReady(magnet: LeadMagnet): boolean {
  return Boolean(magnet.file);
}
