import type { Metadata } from "next";
import {Inter, Lora, Source_Serif_4} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Not in use. Remove later
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
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
      className={`${inter.variable} ${lora.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Navbar />
        <main data-cmp="Main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
