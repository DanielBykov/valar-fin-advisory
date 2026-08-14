"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Mail, Home, FileText, Compass, BarChart2, Briefcase, Users, Newspaper, TrendingUp, Calculator, Download, HelpCircle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { INSIGHTS_LIVE } from "@/lib/insights";

function navLink(isActive: boolean) {
  return cn(
    "text-base font-medium px-4 py-1.5 transition-colors relative",
    "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-valar-amber after:rounded-full after:transition-opacity after:duration-200",
    isActive
      ? "text-valar-amber after:opacity-100"
      : "text-white hover:text-valar-amber after:opacity-0 hover:after:opacity-100"
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isMobileInsightsOpen, setIsMobileInsightsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Insights shows in the menu once INSIGHTS_LIVE is on — and always when
  // running the site locally, so the menu can be reviewed before it goes public.
  const showInsights = INSIGHTS_LIVE || process.env.NODE_ENV === "development";

  useEffect(() => {
    setIsServicesOpen(false);
    setIsOpen(false);
    setIsMobileServicesOpen(false);
    setIsInsightsOpen(false);
    setIsMobileInsightsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        data-cmp="Navbar"
        className={cn(
          "fixed top-0 z-50 w-full font-sans transition-colors duration-300",
          "bg-gradient-to-r from-valar-navy to-valar-indigo text-white"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="flex items-center ml-6">
            <Image
              src="/images/valar-logo.webp"
              alt="Valar Financial Advisors"
              width={180}
              height={48}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 text-white">
            <Link href="/" className={navLink(pathname === "/")}>
              Home
            </Link>
            <span className="text-white/20 select-none text-xs">|</span>

            {/* Services Mega Menu */}
            <div data-cmp="Navbar.ServicesMegaMenu" className="relative h-16 flex items-center" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
              <Link
                href="/services"
                className={cn(
                  "text-base font-medium px-4 py-1.5 transition-colors flex items-center gap-1 relative",
                  "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-valar-amber after:rounded-full after:transition-opacity after:duration-200",
                  pathname?.startsWith("/services")
                    ? "text-valar-amber after:opacity-100"
                    : "text-white hover:text-valar-amber after:opacity-0 hover:after:opacity-100"
                )}
              >
                Services <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isServicesOpen && "rotate-180")} />
              </Link>
              <div className={cn("absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[1160px] max-w-[95vw] transition-all duration-200 z-50", isServicesOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
                <div className="bg-valar-fog shadow-2xl rounded-2xl border border-valar-concrete/60 grid gap-0 overflow-hidden" style={{gridTemplateColumns: "1fr 1fr 1fr 1.3fr"}}>

                  {/* Private */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Foundations</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/services/mortgage-advice" className="flex items-start gap-3 group/item">
                        <Home className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Strategic Mortgage Advice</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Beyond approvals and interest rates</div>
                        </div>
                      </Link>
                      <Link href="/services/financial-planning" className="flex items-start gap-3 group/item">
                        <FileText className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Financial Planning</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Directionally aligned with long-term goals</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Wealth Building */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Wealth Building</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/services/wealth-management-plan" className="flex items-start gap-3 group/item">
                        <Compass className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Wealth Management Plan</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Long-term roadmap for wealth building</div>
                        </div>
                      </Link>
                      <Link href="/services/investment-property-analysis" className="flex items-start gap-3 group/item">
                        <BarChart2 className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Investment Property Analysis</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Data-driven property analysis</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Business */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Business</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/services/small-business-loans" className="flex items-start gap-3 group/item">
                        <Briefcase className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Small Business Loans</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Funding solutions for small businesses</div>
                        </div>
                      </Link>
                      <Link href="/services/business-advisory" className="flex items-start gap-3 group/item">
                        <Users className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Business Advisory Services</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Business forecasting and growth support</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* First Home Buyers card — row-span-2 so it covers the All Services row below */}
                  <div className="bg-valar-navy overflow-hidden flex flex-col row-span-2">
                    <div className="w-full h-56 overflow-hidden shrink-0">
                      <Image
                        src="/images/first-home-hero.webp"
                        alt="First Home Buyers"
                        width={400}
                        height={224}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="font-bold text-xl leading-tight mb-3 text-white">Buying Your First Home?</h4>
                      <p className="text-sm text-valar-lilac mb-6 leading-relaxed flex-1">
                        Understand the process and key steps.
                      </p>
                      <Link
                        href="/services/first-home-buyers"
                        className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors self-start"
                      >
                        Explore the Roadmap →
                      </Link>
                    </div>
                  </div>

                  {/* All Services — spans cols 1-3 in row 2, FHB covers col 4 */}
                  <div className="col-span-3 px-10 py-4 border-t border-valar-concrete">
                    <Link href="/services" className="text-sm font-semibold text-valar-horizon hover:text-valar-navy transition-colors flex items-center gap-1.5">
                      View all services <span>→</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* Insights Mega Menu — same component shape as Services. Visibility: INSIGHTS_LIVE in src/lib/insights.ts */}
            {showInsights && (
            <><span className="text-white/20 select-none text-xs">|</span>

            <div data-cmp="Navbar.InsightsMegaMenu" className="relative h-16 flex items-center" onMouseEnter={() => setIsInsightsOpen(true)} onMouseLeave={() => setIsInsightsOpen(false)}>
              <Link
                href="/insights"
                className={cn(
                  "text-base font-medium px-4 py-1.5 transition-colors flex items-center gap-1 relative",
                  "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-valar-amber after:rounded-full after:transition-opacity after:duration-200",
                  pathname?.startsWith("/insights")
                    ? "text-valar-amber after:opacity-100"
                    : "text-white hover:text-valar-amber after:opacity-0 hover:after:opacity-100"
                )}
              >
                Insights <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isInsightsOpen && "rotate-180")} />
              </Link>
              <div className={cn("absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[1160px] max-w-[95vw] transition-all duration-200 z-50", isInsightsOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
                <div className="bg-valar-fog shadow-2xl rounded-2xl border border-valar-concrete/60 grid gap-0 overflow-hidden" style={{gridTemplateColumns: "1fr 1fr 1fr 1.3fr"}}>

                  {/* Read */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Read</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/insights" className="flex items-start gap-3 group/item">
                        <Newspaper className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Articles</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Guides, commentary and real client scenarios</div>
                        </div>
                      </Link>
                      <Link href="/insights?tag=market" className="flex items-start gap-3 group/item">
                        <TrendingUp className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Market Updates</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Where NZ lending and rates sit right now</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Tools</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/insights/calculators" className="flex items-start gap-3 group/item">
                        <Calculator className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Calculators</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Repayments, borrowing power and cashflow</div>
                        </div>
                      </Link>
                      <Link href="/services/first-home-buyers" className="flex items-start gap-3 group/item">
                        <Download className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Guides &amp; Downloads</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Free guides to keep and work through</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="p-10 ">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-valar-steel mb-3">Answers</h3>
                    <div className="border-t border-valar-concrete mb-7" />
                    <div className="space-y-7">
                      <Link href="/insights#faq" className="flex items-start gap-3 group/item">
                        <HelpCircle className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">FAQ</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Straight answers to the questions we get most</div>
                        </div>
                      </Link>
                      <Link href="/insights?tag=case-studies" className="flex items-start gap-3 group/item">
                        <Layers className="w-5 h-5 mt-0.5 text-valar-steel group-hover/item:text-valar-horizon shrink-0 transition-colors" />
                        <div>
                          <div className="font-semibold text-[15px] text-valar-navy group-hover/item:text-valar-horizon transition-colors">Case Studies</div>
                          <div className="text-sm text-valar-indigo mt-1 leading-snug">Real structures, real numbers, names removed</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Academy card — row-span-2 so it covers the All Insights row below */}
                  <div className="bg-valar-navy overflow-hidden flex flex-col row-span-2">
                    <div className="w-full h-56 overflow-hidden shrink-0">
                      <Image
                        src="/images/first-home-2.webp"
                        alt="First Home Buyers Academy"
                        width={400}
                        height={224}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="font-bold text-xl leading-tight mb-3 text-white">First Home Buyers Academy</h4>
                      <p className="text-sm text-valar-lilac mb-6 leading-relaxed flex-1">
                        A step-by-step path from &ldquo;can I even buy?&rdquo; to settlement day.
                      </p>
                      <Link
                        href="/services/first-home-buyers"
                        className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors self-start"
                      >
                        Start the Academy →
                      </Link>
                    </div>
                  </div>

                  {/* All Insights — spans cols 1-3 in row 2, Academy card covers col 4 */}
                  <div className="col-span-3 px-10 py-4 border-t border-valar-concrete">
                    <Link href="/insights" className="text-sm font-semibold text-valar-horizon hover:text-valar-navy transition-colors flex items-center gap-1.5">
                      View all insights <span>→</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div></>
            )}

            <span className="text-white/20 select-none text-xs">|</span>
            <Link href="/about" className={navLink(pathname === "/about")}>
              About
            </Link>
            <span className="text-white/20 select-none text-xs">|</span>
            <Link href="/contact" className={navLink(pathname === "/contact")}>
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/subscribe"
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
          <div data-cmp="Navbar.MobileNav" className="md:hidden bg-valar-indigo border-t border-valar-navy/20">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link href="/" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Home</Link>
              {/* Services accordion */}
              <div className="border-b border-white/10">
                <button
                  className="w-full flex items-center justify-between py-3 text-white font-medium"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                >
                  Services
                  <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isMobileServicesOpen && "rotate-180")} />
                </button>
                {isMobileServicesOpen && (
                  <div className="bg-valar-navy/40 rounded-lg mb-3 overflow-hidden">
                    <div className="px-5 pt-4 pb-3 border-b border-white/10">
                      <Link href="/services" className="flex items-center justify-between py-2 text-base font-semibold text-valar-amber hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                        All Services <span>→</span>
                      </Link>
                    </div>
                    <div className="px-5 pt-5 pb-3">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Foundations</p>
                      <Link href="/services/mortgage-advice" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Home className="w-5 h-5 text-valar-steel shrink-0" /> Strategic Mortgage Advice
                      </Link>
                      <Link href="/services/financial-planning" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <FileText className="w-5 h-5 text-valar-steel shrink-0" /> Financial Planning
                      </Link>
                    </div>
                    <div className="px-5 pt-3 pb-3">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Wealth Building</p>
                      <Link href="/services/wealth-management-plan" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Compass className="w-5 h-5 text-valar-steel shrink-0" /> Wealth Management Plan
                      </Link>
                      <Link href="/services/investment-property-analysis" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <BarChart2 className="w-5 h-5 text-valar-steel shrink-0" /> Investment Property Analysis
                      </Link>
                    </div>
                    <div className="px-5 pt-3 pb-5">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Business</p>
                      <Link href="/services/small-business-loans" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Briefcase className="w-5 h-5 text-valar-steel shrink-0" /> Small Business Loans
                      </Link>
                      <Link href="/services/business-advisory" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Users className="w-5 h-5 text-valar-steel shrink-0" /> Business Advisory Services
                      </Link>
                      <Link href="/services/first-home-buyers" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Home className="w-5 h-5 text-valar-steel shrink-0" /> First Home Buyers
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* Insights accordion — mirrors the Services accordion above */}
              {showInsights && (
              <div className="border-b border-white/10">
                <button
                  className="w-full flex items-center justify-between py-3 text-white font-medium"
                  onClick={() => setIsMobileInsightsOpen(!isMobileInsightsOpen)}
                >
                  Insights
                  <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isMobileInsightsOpen && "rotate-180")} />
                </button>
                {isMobileInsightsOpen && (
                  <div className="bg-valar-navy/40 rounded-lg mb-3 overflow-hidden">
                    <div className="px-5 pt-4 pb-3 border-b border-white/10">
                      <Link href="/insights" className="flex items-center justify-between py-2 text-base font-semibold text-valar-amber hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                        All Insights <span>→</span>
                      </Link>
                    </div>
                    <div className="px-5 pt-5 pb-3">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Read</p>
                      <Link href="/insights" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Newspaper className="w-5 h-5 text-valar-steel shrink-0" /> Articles
                      </Link>
                      <Link href="/insights?tag=market" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <TrendingUp className="w-5 h-5 text-valar-steel shrink-0" /> Market Updates
                      </Link>
                    </div>
                    <div className="px-5 pt-2 pb-3">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Tools</p>
                      <Link href="/insights/calculators" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Calculator className="w-5 h-5 text-valar-steel shrink-0" /> Calculators
                      </Link>
                      <Link href="/services/first-home-buyers" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Download className="w-5 h-5 text-valar-steel shrink-0" /> Guides &amp; Downloads
                      </Link>
                    </div>
                    <div className="px-5 pt-2 pb-4">
                      <p className="text-xs uppercase tracking-widest text-valar-steel mb-3">Answers</p>
                      <Link href="/insights#faq" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <HelpCircle className="w-5 h-5 text-valar-steel shrink-0" /> FAQ
                      </Link>
                      <Link href="/insights?tag=case-studies" className="flex items-center gap-3 py-3 text-base text-white/90 hover:text-white" onClick={() => setIsOpen(false)}>
                        <Layers className="w-5 h-5 text-valar-steel shrink-0" /> Case Studies
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              )}
              <Link href="/about" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/contact" className="block py-3 border-b border-white/10 text-white font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
              <div className="pt-4">
                <Link
                  href="/subscribe"
                  className="block w-full text-center border border-white text-white font-bold py-3 rounded-sm hover:bg-white hover:text-valar-navy transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Updates
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for pages without a full-bleed hero — keeps content below the fixed navbar */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
