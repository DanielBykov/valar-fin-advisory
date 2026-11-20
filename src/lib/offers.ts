/*
 * Valar's own offers to clients. One switch per offer, the same pattern as
 * INSIGHTS_LIVE: every article block and page section that mentions an offer
 * reads its switch, so an offer turns off in one edit and no copy is left
 * advertising something that no longer exists.
 */

/**
 * Valar covers part of the legal fees on a refinance arranged through Valar,
 * paid to the client after settlement. Set by Lena on 2026-11-20; later that
 * day she gave it an end date, 31 March 2027, so copy can say "until" truthfully.
 *
 * Valar pays it out of the commission the lender pays Valar, and the copy that
 * advertises it says so.
 */
export const LEGAL_FEE_OFFER_LIVE = true;

/** Last day the offer applies (inclusive). Copy that names a deadline reads this. */
export const LEGAL_FEE_OFFER_ENDS = "2027-03-31";

/**
 * On and not yet expired. Anything that sends or renders later than it is built
 * (an email, a server page) checks this, so the offer stops on its own date.
 */
export const legalFeeOfferOn = (todayIso: string) =>
  LEGAL_FEE_OFFER_LIVE && todayIso <= LEGAL_FEE_OFFER_ENDS;

/** Loan size at or above which the larger amount applies. */
export const LEGAL_FEE_OFFER_THRESHOLD = 500_000;
export const LEGAL_FEE_OFFER_LARGE = 800;
export const LEGAL_FEE_OFFER_SMALL = 400;

/**
 * If the loan is repaid or moved within this many months, the lender claws back
 * Valar's commission, and Valar can ask for the payment back. Lena, 2026-11-20.
 */
export const LEGAL_FEE_OFFER_CLAWBACK_MONTHS = 24;
