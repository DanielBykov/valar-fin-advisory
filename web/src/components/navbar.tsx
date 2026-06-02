"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#061634] text-white font-sans">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center">
          <span className="bg-white text-[#061634] rounded px-3 py-1 flex flex-col leading-none">
            <span className="font-sans font-bold text-lg tracking-tight">VALAR</span>
            <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-[#061634]/70">
              Financial Advisors
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium px-4 py-1.5 hover:text-[#E8A23A] transition-colors relative",
              pathname === "/" &&
                "text-[#E8A23A] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-[#E8A23A] after:rounded-full"
            )}
          >
            Home
          </Link>
          <span className="text-white/20 select-none text-xs">|</span>

          {/* Services Mega Menu */}
          <div className="group relative h-20 flex items-center">
            <Link
              href="/services"
              className={cn(
                "text-sm font-medium hover:text-[#E8A23A] transition-colors flex items-center gap-1",
                pathname?.startsWith("/services") && "text-[#E8A23A]"
              )}
            >
              Services <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-max max-w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
              <div className="bg-white text-[#061634] shadow-xl rounded-b-xl border border-gray-100 p-8 grid grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Private
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/services/mortgage-advice" className="block hover:text-[#E8A23A]">
                        <div className="font-semibold text-[15px]">Mortgage Advice</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Strategic mortgage structuring and lending support
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/financial-planning" className="block hover:text-[#E8A23A]">
                        <div className="font-semibold text-[15px]">Financial Planning</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Clear financial direction aligned with long-term goals
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Wealth Building
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/services/wealth-management" className="block hover:text-[#E8A23A]">
                        <div className="font-semibold text-[15px]">Wealth Management Plan</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Long-term roadmap for wealth building
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services/investment-property-analysis"
                        className="block hover:text-[#E8A23A]"
                      >
                        <div className="font-semibold text-[15px]">Investment Property Analysis</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Data-driven property analysis
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Business
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/services/small-business-loans" className="block hover:text-[#E8A23A]">
                        <div className="font-semibold text-[15px]">Small Business Loans</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Funding solutions for small businesses
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/business-advisory" className="block hover:text-[#E8A23A]">
                        <div className="font-semibold text-[15px]">Business Advisory Services</div>
                        <div className="text-xs text-gray-500 mt-1 leading-snug">
                          Business forecasting and growth support
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F6F7F9] -m-8 ml-0 p-8 flex flex-col rounded-br-xl border-l border-gray-100">
                  <div className="w-full h-32 bg-[#C9CED6] rounded mb-4" />
                  <h4 className="font-bold text-lg leading-tight mb-2">Buying Your First Home?</h4>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    Understand the process and key decisions before you speak to the bank.
                  </p>
                  <Link
                    href="/services/first-home-buyers"
                    className="text-[#061634] font-semibold text-sm hover:text-[#E8A23A] flex items-center"
                  >
                    Explore the Roadmap <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <span className="text-white/20 select-none text-xs">|</span>

          {/* Insights Mega Menu */}
          <div className="group relative h-16 flex items-center">
            <Link
              href="/insights"
              className={cn(
                "text-sm font-medium px-4 hover:text-[#E8A23A] transition-colors flex items-center gap-1",
                pathname === "/insights" && "text-[#E8A23A]"
              )}
            >
              Insights <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-max max-w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
              <div className="bg-white text-[#061634] shadow-xl rounded-b-xl border border-gray-100 p-8 grid grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Market & Analysis
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        Property Market Updates
                      </Link>
                    </li>
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        Real Client Scenarios
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Education & Guidance
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        Learning Hub
                      </Link>
                    </li>
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        First-Home Buyers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
                    Tools & Support
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        Calculators
                      </Link>
                    </li>
                    <li>
                      <Link href="/insights" className="text-[15px] hover:text-[#E8A23A] block">
                        FAQs
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#2E4882] text-white -m-8 ml-0 p-8 flex flex-col rounded-br-xl">
                  <h4 className="font-bold text-lg leading-tight mb-2 mt-auto">
                    Understanding the NZ Property Market
                  </h4>
                  <p className="text-sm text-[#C8CBE3] mb-4">
                    Latest perspectives from our advisory team.
                  </p>
                  <Link
                    href="/insights"
                    className="text-[#E8A23A] font-semibold text-sm hover:text-white flex items-center"
                  >
                    Explore Insights <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <span className="text-white/20 select-none text-xs">|</span>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium px-4 py-1.5 hover:text-[#E8A23A] transition-colors",
              pathname === "/about" && "text-[#E8A23A]"
            )}
          >
            About
          </Link>
          <span className="text-white/20 select-none text-xs">|</span>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium px-4 py-1.5 hover:text-[#E8A23A] transition-colors",
              pathname === "/contact" && "text-[#E8A23A]"
            )}
          >
            Contact
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="flex items-center gap-2 border border-white/60 hover:border-white hover:bg-white/10 text-white font-medium text-sm px-5 py-2 rounded-sm transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Get Updates
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#2E4882] border-t border-[#061634]/20">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/services" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/insights" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Insights</Link>
            <Link href="/about" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/contact" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
            <div className="pt-4">
              <Link
                href="/contact"
                className="block w-full text-center border border-white text-white font-bold py-3 rounded-sm hover:bg-white hover:text-[#061634] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get Updates
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
