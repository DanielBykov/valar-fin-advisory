/**
 * Lena's networking card: the one place its details live.
 *
 * `/card` shows them and `/card/lena-bykova.vcf` packs them into the contact
 * file, so the page and the saved contact cannot disagree. The QR code on the
 * printed business card points at `/card`, not at the file, which means these
 * details can change here without reprinting a single card.
 */
export const CARD_CONTACT = {
  firstName: "Lena",
  lastName: "Bykova",
  title: "Mortgage & Investment Adviser",
  org: "Valar Financial Advisors",
  phoneDisplay: "+64 21 086 35695",
  phoneDial: "+642108635695",
  email: "lena.bykova@valar.co.nz",
  website: "https://valar.co.nz",
  linkedin: "https://www.linkedin.com/in/lenabykova/",
  linkedinDisplay: "linkedin.com/in/lenabykova",
  // Sits under the contact in the phone's address book, for the moment months
  // later when nobody remembers where they met.
  note: "Home loans, investment property and business lending. valar.co.nz",
} as const;

/** The downloadable contact file, served by `src/app/card/lena-bykova.vcf/route.ts`. */
export const CARD_VCF_PATH = "/card/lena-bykova.vcf";

/** The photo packed into the contact file. JPEG rather than webp, the safe format for phone contact apps. */
export const CARD_PHOTO_FILE = "public/images/lena-vcard.jpg";
