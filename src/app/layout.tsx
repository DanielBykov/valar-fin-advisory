import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { Analytics } from "@/components/consent/analytics";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";

/*
 * Cyrillic is loaded alongside latin because `/ua` is written in it, and
 * without the subset every Ukrainian character falls back to a system font —
 * the page renders in a different typeface than the brand and looks like a
 * mistake. It costs the English pages nothing: next/font emits one file per
 * subset with a `unicode-range`, so a browser only fetches the Cyrillic face on
 * a page that actually draws Cyrillic glyphs.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valar.co.nz"),
  title: "Valar Financial Advisors",
  description:
    "Strategic mortgage and financial advice in New Zealand — clarity for your financial future.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Valar Financial Advisors",
    description:
      "Strategic mortgage and financial advice in New Zealand — clarity for your financial future.",
    images: ["/opengraph.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ConsentProvider>
          <JsonLd data={[getOrganizationSchema(), getWebsiteSchema()]} />
          <Navbar />
          <main data-cmp="Main" className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
