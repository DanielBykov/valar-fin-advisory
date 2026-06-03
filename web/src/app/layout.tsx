import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Valar Financial Advisors",
  description:
    "Strategic mortgage and financial advice in New Zealand — clarity for your financial future.",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main data-cmp="Main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
