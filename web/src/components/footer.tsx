"use client";

import Link from "next/link";
import { Linkedin, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#061634] text-[#C8CBE3] pt-20 pb-8 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1 — Brand block */}
          <div className="lg:col-span-3">
            <div className="flex flex-col mb-4">
              <span className="font-sans font-bold text-2xl tracking-tight leading-none text-white">VALAR</span>
              <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#C8CBE3] leading-tight">
                Financial Advisors
              </span>
            </div>
            <p className="text-sm mb-4 leading-relaxed max-w-xs">
              Strategic financial guidance for property, wealth and long-term decisions.
            </p>
            <p className="text-xs text-[#8F93B5] mb-6 tracking-wide">
              Property · Wealth · Financial Clarity
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-[#2E4882] flex items-center justify-center hover:bg-[#E8A23A] hover:text-[#061634] transition-colors text-white">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-[#2E4882] flex items-center justify-center hover:bg-[#E8A23A] hover:text-[#061634] transition-colors text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-[#2E4882] flex items-center justify-center hover:bg-[#E8A23A] hover:text-[#061634] transition-colors text-white">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#E8A23A] mb-6">SERVICES</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/mortgage-advice" className="hover:text-white transition-colors">Mortgage Advice</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Refinance & Restructuring</Link></li>
              <li><Link href="/services/financial-planning" className="hover:text-white transition-colors">Financial Planning</Link></li>
              <li><Link href="/services/investment-property-analysis" className="hover:text-white transition-colors">Investment Property Advice</Link></li>
              <li><Link href="/services/wealth-management" className="hover:text-white transition-colors">Wealth Management Planning</Link></li>
              <li><Link href="/services/small-business-loans" className="hover:text-white transition-colors">Business Lending</Link></li>
              <li><Link href="/services/business-advisory" className="hover:text-white transition-colors">Advisory Services</Link></li>
            </ul>
          </div>

          {/* Insights & Learning */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#E8A23A] mb-6">INSIGHTS & LEARNING</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/insights" className="hover:text-white transition-colors">Market Updates</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Learning Hub</Link></li>
              <li><Link href="/services/first-home-buyers" className="hover:text-white transition-colors">First-Home Buyers</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Property Strategy</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Financial Clarity</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Calculators & Tools</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Real Client Scenarios</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#E8A23A] mb-6">ABOUT VALAR</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Lena</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Valar</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">How We Work</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Book Strategy Call</Link></li>
              <li className="pt-2"><Link href="#" className="hover:text-white transition-colors">Disclosure Statement</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-[#2E4882] pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="font-bold text-lg text-[#E8A23A] mb-2">STAY UPDATED</h4>
            <p className="text-sm text-[#C8CBE3] max-w-md leading-relaxed">
              Thoughtful market insights, property strategy and financial guidance — delivered occasionally, not excessively.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 lg:justify-end" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#2E4882] border-none text-white placeholder:text-white/50 h-12 min-w-[280px] rounded-md px-4 outline-none focus:ring-2 focus:ring-[#E8A23A]"
            />
            <button
              type="submit"
              className="bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] font-semibold text-sm px-8 h-12 rounded-sm transition-colors whitespace-nowrap"
            >
              Subscribe to Insights
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#2E4882] flex flex-col md:flex-row justify-between items-center text-xs text-[#C8CBE3]/70 gap-4">
          <p>© 2026 Valar Financial Advisors. All rights reserved.</p>
          <p className="text-center md:text-right max-w-3xl">
            Lena Bykova trades as Valar Financial Advisors. FSP1010055. FAP: Fundsmart Mortgages and Finance. A disclosure statement is available free of charge on request.
          </p>
        </div>
      </div>
    </footer>
  );
}
