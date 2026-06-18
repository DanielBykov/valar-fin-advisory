"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  BarChart2,
  TrendingUp,
  DollarSign,
  Layers,
  Cpu,
  LineChart,
  Briefcase,
  Store,
  Lightbulb,
  Users,
  Building2,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function BusinessAdvisoryPage() {
  return (
    <div data-cmp="BusinessAdvisoryPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section data-cmp="BusinessAdvisoryPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/business-advisory-hero.png" fill priority unoptimized className="object-cover object-center" alt="Business advisory hero" />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/80 via-valar-navy/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/30 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20 text-white">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Business</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
              AI-Driven Business Advisory<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.div variants={fadeIn} className="text-base text-valar-lilac max-w-2xl leading-relaxed mb-10 border-l-2 border-valar-amber pl-4">
              Helping business owners build up a finance system with AI-powered tools.
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY BUSINESS ADVISORY */}
      <section data-cmp="BusinessAdvisoryPage.WhyBusinessAdvisory" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
          >
            <motion.div variants={staggerContainer}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Business Advisory?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                Many business owners are experts in their trade — but struggle with the numbers<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                Valar helps business owners gain clarity on performance, profitability, and future opportunities through business intelligence and AI-powered insights.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Questions we help answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Where are the hidden opportunities to improve profitability?",
                  "Which customers create the most value for the business?",
                  "What trends are emerging in my financial data?",
                  "How will today's decisions affect future cash flow and profit?",
                  "Which projects are worth pursuing — and which should be avoided?",
                  "What are the biggest financial risks facing my business?",
                ].map((q, i) => (
                  <motion.li data-cmp="BusinessAdvisoryPage.WhyBusinessAdvisory.QuestionItem" key={i} variants={fadeIn} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-valar-concrete shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    <span className="text-valar-navy text-sm leading-relaxed">{q}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES VALAR DIFFERENT */}
      <section data-cmp="BusinessAdvisoryPage.WhyValar" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={staggerContainer}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What Makes Valar Different?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Clarity Behind Every Business Decision<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-lilac leading-relaxed mb-4">
                Every business generates data. The challenge is turning that information into meaningful insight.
              </motion.p>
              <motion.p variants={fadeIn} className="text-white font-medium">
                Valar helps business owners make better decisions through business intelligence, AI-driven analysis, and strategic planning.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, label: "Cashflow visibility" },
                { icon: BarChart2, label: "Performance analysis" },
                { icon: LineChart, label: "Financial forecasting" },
                { icon: TrendingUp, label: "Growth planning" },
                { icon: Layers, label: "Business intelligence" },
                { icon: Cpu, label: "AI & technology tools" },
              ].map((item, i) => (
                <motion.div data-cmp="BusinessAdvisoryPage.WhyValar.CapabilityCard" key={i} variants={fadeIn} className="bg-valar-indigo border border-white/10 rounded-sm p-4 flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-valar-amber flex-shrink-0" />
                  <span className="text-sm text-valar-lilac font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE CAN HELP WITH */}
      <section data-cmp="BusinessAdvisoryPage.WhatWeOffer" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What We Can Help With</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Six areas of business advisory support<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Row 1 — 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Cashflow Forecasting",
                  desc: "Cash visibility and forward planning.",
                  items: ["Cashflow forecasting", "Scenario planning", "Working capital analysis"],
                },
                {
                  icon: BarChart2,
                  title: "Financial Dashboards & BI",
                  desc: "Clear metrics, always accessible.",
                  items: ["KPI dashboards", "Management reporting", "Performance tracking"],
                },
                {
                  icon: LineChart,
                  title: "Business Performance Analysis",
                  desc: "What drives profitability and growth.",
                  items: ["Revenue analysis", "Margin analysis", "Profitability by service or project"],
                },
              ].map((card, i) => (
                <motion.div data-cmp="BusinessAdvisoryPage.WhatWeOffer.ServiceCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-lg border border-valar-concrete">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-valar-amber" />
                    </div>
                    <h3 className="font-bold text-valar-navy text-sm leading-tight">{card.title}</h3>
                  </div>
                  <p className="text-valar-indigo text-sm mb-4 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-valar-navy">
                        <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Row 2 — 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Investment & Growth Analysis",
                  desc: "Evaluate opportunities before committing.",
                  items: ["Investment analysis", "Project feasibility", "Growth scenarios"],
                },
                {
                  icon: Layers,
                  title: "Lending & Funding Support",
                  desc: "Funding options and borrowing capacity.",
                  items: ["Business lending analysis", "Loan structure review", "Funding requirements"],
                },
                {
                  icon: Cpu,
                  title: "AI & Technology Solutions",
                  desc: "Better visibility and smarter decisions.",
                  items: ["AI-assisted reporting", "Automated dashboards", "Financial data integration"],
                },
              ].map((card, i) => (
                <motion.div data-cmp="BusinessAdvisoryPage.WhatWeOffer.ServiceCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-lg border border-valar-concrete">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-valar-amber" />
                    </div>
                    <h3 className="font-bold text-valar-navy text-sm leading-tight">{card.title}</h3>
                  </div>
                  <p className="text-valar-indigo text-sm mb-4 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-valar-navy">
                        <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section data-cmp="BusinessAdvisoryPage.WhoIsFor" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Who Is This For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Built for businesses that want better information<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Building2, title: "Trades & Construction", desc: "Businesses managing projects, staff, vehicles, and equipment." },
              { icon: Briefcase, title: "Professional Services", desc: "Consultants, agencies, and service-based businesses." },
              { icon: Store, title: "Retail Businesses", desc: "Businesses seeking visibility over profitability and cashflow." },
              { icon: Lightbulb, title: "Start-Ups", desc: "Founders building financial structure for growth." },
              { icon: TrendingUp, title: "Growing Businesses", desc: "Business owners wanting better information to support decisions." },
              { icon: Building2, title: "Property Developers", desc: "Managing projects and cashflow across multiple developments." },
            ].map((card, i) => (
              <motion.div data-cmp="BusinessAdvisoryPage.WhoIsFor.AudienceCard" key={i} variants={fadeIn} className="bg-valar-fog border border-valar-concrete rounded-sm p-6 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-valar-amber/20 flex items-center justify-center flex-shrink-0">
                  <card.icon className="w-4 h-4 text-valar-amber" />
                </div>
                <div>
                  <h3 className="font-bold text-valar-navy mb-1">{card.title}</h3>
                  <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="BusinessAdvisoryPage.HowItWorks" className="py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              From discovery to implementation<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            {[
              { num: "01", title: "Discovery Session", body: "Your business, goals, challenges, and priorities." },
              { num: "02", title: "Information Review", body: "Financial information, systems, and reporting processes." },
              { num: "03", title: "Analysis & Recommendations", body: "Opportunities, risks, and practical improvements." },
              { num: "04", title: "Implementation Support", body: "Dashboards, forecasting tools, and financial frameworks." },
            ].map((step, i, arr) => (
              <div key={i}>
                <motion.div data-cmp="BusinessAdvisoryPage.HowItWorks.Step" variants={fadeIn} className="grid grid-cols-[1fr_2fr] gap-8 items-start py-5">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-valar-amber">{step.num}</span>
                    <h3 className="text-base font-bold text-valar-navy">{step.title}</h3>
                  </div>
                  <p className="text-valar-indigo text-sm leading-relaxed">{step.body}</p>
                </motion.div>
                {i < arr.length - 1 && (
                  <div className="flex justify-start pl-6">
                    <ChevronDown className="w-4 h-4 text-valar-amber" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="BusinessAdvisoryPage.FinalCta" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Better Understand Your Business?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">
                Good decisions start with good information<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Build a stronger financial foundation with better visibility, reporting, and AI-driven insights.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                  <Calendar className="w-5 h-5" /> Book a Consultation
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-80 rounded-sm overflow-hidden"
            >
              <Image src="/images/lena-client.jpg" fill unoptimized className="object-cover object-center" alt="Lena with client" />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
