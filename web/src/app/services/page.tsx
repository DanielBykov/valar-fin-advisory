"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, TrendingUp, Briefcase, ChevronRight, BookOpen } from "lucide-react";

export default function ServicesPage() {
  return (
    <div data-cmp="ServicesPage" className="w-full flex flex-col bg-valar-fog min-h-screen">
      {/* Hero */}
      <section data-cmp="ServicesPage.Hero" className="bg-valar-navy text-white pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[1px] w-12 bg-valar-amber mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Services</h1>
          <p className="text-xl md:text-2xl font-light text-valar-lilac max-w-3xl leading-relaxed border-l-2 border-valar-amber pl-4">
            Strategic financial advisory tailored to your personal goals, property ambitions, and business growth.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-20 max-w-6xl space-y-32">
        {/* Private Section */}
        <section data-cmp="ServicesPage.PrivateSection">
          <div className="flex items-center gap-4 mb-12">
            <LayoutGrid className="w-8 h-8 text-valar-amber" />
            <h2 className="text-3xl font-bold text-valar-navy">Private Advisory</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div data-cmp="ServicesPage.PrivateSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Mortgage Advice</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                We handle the entire lending process, from initial strategy and bank negotiation to structuring the debt for optimal flexibility. Whether you are a first-home buyer, upgrading, or refinancing, we secure the right terms aligned with your life stage.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/mortgage-advice" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
            <div data-cmp="ServicesPage.PrivateSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Financial Planning</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                Clear, actionable financial direction. We assess your current position, map out your long-term goals, and implement structured strategies covering KiwiSaver, investments, risk management, and retirement planning.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/financial-planning" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>

          {/* First Home Buyer banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-8"
          >
            <Link href="/services/first-home-buyers" className="group block relative overflow-hidden rounded-xl bg-valar-navy">
              <Image
                src="/images/first-home.png"
                alt="First home"
                fill
                className="object-cover object-center opacity-30 group-hover:opacity-40 transition-opacity duration-300"
              />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10">
                <div>
                  <span className="text-valar-amber font-bold tracking-widest text-xs uppercase block mb-3">First Home Buyers</span>
                  <h4 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2">
                    All you want to know about the First Home Buyer process<span className="text-valar-amber">.</span>
                  </h4>
                  <p className="text-valar-lilac text-sm leading-relaxed max-w-xl">
                    Explore more information about deposits, lending options, KiwiSaver, and the full buying process — or download the free guide.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 bg-valar-amber group-hover:bg-valar-amber-hover text-valar-navy font-bold text-sm px-6 py-3.5 rounded-sm transition-colors whitespace-nowrap">
                  <BookOpen className="w-4 h-4" /> Explore Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* Wealth Section */}
        <section data-cmp="ServicesPage.WealthSection">
          <div className="flex items-center gap-4 mb-12">
            <TrendingUp className="w-8 h-8 text-valar-amber" />
            <h2 className="text-3xl font-bold text-valar-navy">Wealth Building</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div data-cmp="ServicesPage.WealthSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Wealth Management Plan</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                A highly structured, long-term roadmap designed to build and preserve wealth. We construct diversified strategies that compound over time, adjusting the framework as market conditions and personal circumstances evolve.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/wealth-management-plan" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
            <div data-cmp="ServicesPage.WealthSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Investment Property Analysis</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                Data-driven analysis for property investors. We advise on leveraging equity, portfolio structuring, yield versus capital growth decisions, and the optimal debt frameworks to minimize risk while scaling your holdings.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/investment-property-analysis" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* Business Section */}
        <section data-cmp="ServicesPage.BusinessSection">
          <div className="flex items-center gap-4 mb-12">
            <Briefcase className="w-8 h-8 text-valar-amber" />
            <h2 className="text-3xl font-bold text-valar-navy">Business Support</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div data-cmp="ServicesPage.BusinessSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Small Business Loans</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                Strategic funding solutions for business expansion, equipment finance, or working capital. We prepare robust business cases for lenders and secure commercial terms that protect your personal assets where possible.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/small-business-loans" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
            <div data-cmp="ServicesPage.BusinessSection.Card" className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-valar-navy mb-4">Business Advisory Services</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                Growth-focused advisory for established enterprises. We assist with cashflow forecasting, risk management, succession planning, and ensuring your business structure supports your overarching personal wealth goals.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto items-center">
                <Link href="/book" className="bg-valar-navy text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-valar-indigo transition-colors">Book Strategy Call</Link>
                <Link href="/contact" className="border border-gray-200 text-valar-navy px-6 py-3 rounded-sm font-semibold text-sm hover:border-valar-navy transition-colors">Enquire</Link>
                <Link href="/services/business-advisory" className="text-valar-amber font-semibold text-sm hover:underline flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <section data-cmp="ServicesPage.BottomCta" className="bg-valar-amber py-20 mt-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">Ready to discuss your strategy?</h2>
          <Link href="/book" className="inline-flex items-center justify-center bg-valar-navy text-white px-8 py-4 rounded-sm font-bold hover:bg-valar-indigo transition-colors">
            Book a Consultation <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
