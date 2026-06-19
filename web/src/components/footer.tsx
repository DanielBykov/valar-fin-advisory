"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer data-cmp="Footer" className="bg-valar-navy text-valar-lilac pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Column 1 — Brand block */}
          <div data-cmp="Footer.Brand">
            <div className="mb-4">
              <Image src="/images/logo-white.png" alt="Valar Financial Advisors" width={180} height={60} className="object-contain -mt-2 -ml-3" style={{ height: "auto" }} />
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Clarity as a path to freedom.
            </p>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-valar-amber font-bold mb-2">Get in touch</p>
              <a href="mailto:lena.bykova@valar.co.nz" className="text-sm hover:text-white transition-colors">lena.bykova@valar.co.nz</a>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/valar-advisors" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-valar-indigo flex items-center justify-center hover:bg-valar-amber hover:text-valar-navy transition-colors text-white">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/lena.valarnz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-valar-indigo flex items-center justify-center hover:bg-valar-amber hover:text-valar-navy transition-colors text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/lena.valarnz" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-valar-indigo flex items-center justify-center hover:bg-valar-amber hover:text-valar-navy transition-colors text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-valar-indigo flex items-center justify-center hover:bg-valar-amber hover:text-valar-navy transition-colors text-white">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div data-cmp="Footer.ServicesLinks">
            <h4 className="font-bold text-xs uppercase tracking-wider text-valar-amber mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/mortgage-advice" className="hover:text-white transition-colors">Mortgage Advice</Link></li>
              <li><Link href="/services/financial-planning" className="hover:text-white transition-colors">Financial Planning</Link></li>
              <li><Link href="/services/wealth-management-plan" className="hover:text-white transition-colors">Wealth Management Plan</Link></li>
              <li><Link href="/services/investment-property-analysis" className="hover:text-white transition-colors">Investment Property Analysis</Link></li>
              <li><Link href="/services/small-business-loans" className="hover:text-white transition-colors">Small Business Loans</Link></li>
              <li><Link href="/services/business-advisory" className="hover:text-white transition-colors">Business Advisory Services</Link></li>
            </ul>
          </div>

          {/* Column 3 — About */}
          <div data-cmp="Footer.AboutLinks">
            <h4 className="font-bold text-xs uppercase tracking-wider text-valar-amber mb-6">About Valar</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Valar</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Knowledge Hub</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Book a Clarity Call</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Disclosure Statement</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div data-cmp="Footer.Newsletter" className="border-t border-valar-indigo pt-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="font-bold text-lg text-valar-amber mb-2">STAY UPDATED</h4>
            <p className="text-sm text-valar-lilac max-w-md leading-relaxed">
              Thoughtful market insights — delivered occasionally, not excessively.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 lg:justify-end" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="bg-valar-indigo border-none text-white placeholder:text-white/50 h-12 min-w-[280px] rounded-md px-4 outline-none focus:ring-2 focus:ring-valar-amber"
            />
            <button
              type="submit"
              className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-semibold text-sm px-8 h-12 rounded-sm transition-colors whitespace-nowrap"
            >
              Subscribe to Insights
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div data-cmp="Footer.BottomBar" className="pt-8 border-t border-valar-indigo flex flex-col md:flex-row justify-between items-center text-xs text-valar-lilac/70 gap-4">
          <p>© 2026 Valar Financial Advisor Ltd.<br />All rights reserved.</p>
          <p className="text-center md:text-right max-w-3xl">
            Lena Bykova (FSP1010055) trades as Valar Financial Advisors.<br />A disclosure statement is available free of charge on request.
          </p>
        </div>
      </div>
    </footer>
  );
}
