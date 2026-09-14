import { readFileSync } from "node:fs";
import path from "node:path";
import { CARD_CONTACT, CARD_PHOTO_FILE } from "@/lib/business-card";

// Built once per deploy. The file only changes when business-card.ts does.
export const dynamic = "force-static";

// vCard 3.0 rather than 4.0, for the widest import support across phones.

/** Text values escape backslash, newline, comma and semicolon (vCard 3.0). */
function text(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Lines fold at 75 characters: CRLF, then a single space. The photo line is
 * around 20 KB, so it is folded rather than trusting every importer to cope
 * with one enormous line. Every value here is ASCII, so characters and octets
 * are the same count.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const out = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) out.push(" " + line.slice(i, i + 74));
  return out.join("\r\n");
}

export function GET() {
  const c = CARD_CONTACT;
  const photo = readFileSync(path.join(process.cwd(), CARD_PHOTO_FILE)).toString("base64");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${text(c.lastName)};${text(c.firstName)};;;`,
    `FN:${text(`${c.firstName} ${c.lastName}`)}`,
    `ORG:${text(c.org)}`,
    `TITLE:${text(c.title)}`,
    `TEL;TYPE=CELL,VOICE:${c.phoneDial}`,
    `EMAIL;TYPE=INTERNET,WORK:${c.email}`,
    `URL;TYPE=WORK:${c.website}`,
    // X-ABLabel is Apple's label extension. Apps that do not know it keep the URL.
    `item1.URL:${c.linkedin}`,
    "item1.X-ABLabel:LinkedIn",
    `NOTE:${text(c.note)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`,
    "END:VCARD",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Lena-Bykova-Valar.vcf"',
    },
  });
}
