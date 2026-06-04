"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Phone,
  ChevronDown,
  Briefcase,
  Truck,
  Wrench,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Users,
  HardHat,
  Building2,
  Lightbulb,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function FAQItem({ question, answer }: { question: string; answer: string | string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-valar-concrete">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-valar-navy text-base">{question}</span>
        <ChevronDown className={`w-5 h-5 text-valar-amber flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {Array.isArray(answer) ? (
              <ul className="pb-5 space-y-1">
                {answer.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-valar-indigo">
                    <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-valar-indigo text-sm leading-relaxed pb-5">{answer}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SmallBusinessLoansPage() {
  return (
    <div data-cmp="SmallBusinessLoansPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section data-cmp="SmallBusinessLoansPage.Hero" className="bg-valar-navy text-white pt-28 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Business Finance</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
              Small Business Loans<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-valar-steel font-light mb-8">
              Funding Solutions for Growing Businesses
            </motion.p>
            <motion.div variants={fadeIn} className="text-base text-valar-lilac max-w-2xl leading-relaxed mb-10 border-l-2 border-valar-amber pl-4">
              Helping small business owners, self-employed professionals, tradespeople, and property developers access funding for growth, equipment, vehicles, and working capital.
            </motion.div>
            <motion.div data-cmp="SmallBusinessLoansPage.Hero.Cta" variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Phone className="w-5 h-5" /> Request a Call Back
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY SMALL BUSINESS LOANS */}
      <section data-cmp="SmallBusinessLoansPage.WhyBusinessLoans" className="py-24 bg-valar-fog">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Small Business Loans?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                Running a business often requires investment<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Whether you are purchasing equipment, financing a vehicle, improving cashflow, or preparing for growth, finding the right funding solution can be challenging.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                Many business owners focus only on their main bank. However, depending on the business, there may be alternative lenders, specialist finance providers, or different funding structures available.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Why work with Valar?</motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo font-medium mb-5 text-sm">
                Business lending is not only about finding a lender. It is about presenting your business effectively, understanding your borrowing capacity, and finding a funding solution that supports your goals.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-2">
                {[
                  "Understand available funding options",
                  "Compare lenders",
                  "Assess borrowing capacity",
                  "Prepare supporting information",
                  "Structure applications effectively",
                  "Navigate the approval process",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeIn} className="flex items-center gap-3 text-sm text-valar-navy">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE CAN HELP WITH */}
      <section data-cmp="SmallBusinessLoansPage.WhatWeHelpWith" className="py-24 bg-valar-navy text-white">
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
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Funding for every stage of your business<span className="text-valar-amber">.</span>
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
              {
                icon: DollarSign,
                title: "Working Capital",
                desc: "Funding to support day-to-day business operations, cashflow requirements, and growth opportunities.",
              },
              {
                icon: Wrench,
                title: "Equipment Finance",
                desc: "Funding for machinery, tools, technology, and equipment required to operate and grow your business.",
              },
              {
                icon: Truck,
                title: "Vehicle Finance",
                desc: "Finance solutions for business vehicles, commercial vehicles, and fleet purchases.",
              },
              {
                icon: TrendingUp,
                title: "Business Expansion",
                desc: "Funding support for businesses planning to grow, invest, hire, or expand operations.",
              },
              {
                icon: RefreshCw,
                title: "Refinancing & Restructuring",
                desc: "Reviewing existing lending arrangements and exploring funding structures that may better support your business goals.",
              },
            ].map((card, i) => (
              <motion.div data-cmp="SmallBusinessLoansPage.WhatWeHelpWith.FundingCard" key={i} variants={fadeIn} className={`bg-valar-indigo p-8 rounded-sm border-t-2 border-valar-amber ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <card.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="font-bold text-lg">{card.title}</h3>
                </div>
                <p className="text-valar-lilac text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section data-cmp="SmallBusinessLoansPage.WhoIsThisFor" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Who Is This Service For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Built for business owners who need results<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Briefcase, title: "Self-Employed Professionals", desc: "Consultants, contractors, and professionals seeking funding support." },
              { icon: HardHat, title: "Tradespeople", desc: "Businesses requiring vehicles, equipment, machinery, or working capital." },
              { icon: Building2, title: "Small Business Owners", desc: "Businesses seeking growth funding or improved lending structures." },
              { icon: Users, title: "Property Developers & Renovators", desc: "Projects requiring finance support and lending guidance." },
              { icon: Lightbulb, title: "Start-Ups", desc: "Businesses seeking funding opportunities and assistance preparing their business case." },
            ].map((card, i) => (
              <motion.div data-cmp="SmallBusinessLoansPage.WhoIsThisFor.AudienceCard" key={i} variants={fadeIn} className={`bg-valar-fog p-8 rounded-lg border border-valar-concrete ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-valar-navy flex items-center justify-center mb-5">
                  <card.icon className="w-4 h-4 text-valar-amber" />
                </div>
                <h3 className="font-bold text-valar-navy mb-2">{card.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="SmallBusinessLoansPage.HowItWorks" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What to Expect</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              From initial discussion to settlement<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              { num: "01", title: "Initial Discussion", body: "We discuss your business, funding requirements, and goals." },
              { num: "02", title: "Information Review", body: "We review available financial information and supporting documentation." },
              { num: "03", title: "Funding Strategy", body: "We identify potential funding options and recommend a suitable structure." },
              { num: "04", title: "Application Support", body: "We assist with preparing and presenting the application to the lender." },
              { num: "05", title: "Approval & Settlement", body: "We guide you through the approval process and help coordinate next steps once funding is approved." },
            ].map((step, i) => (
              <motion.div data-cmp="SmallBusinessLoansPage.HowItWorks.Step" key={i} variants={fadeIn} className="flex gap-6 bg-white p-7 rounded-lg border border-valar-concrete shadow-sm">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-valar-navy text-white flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
                <div className="flex items-center">
                  <div>
                    <h3 className="text-base font-bold text-valar-navy mb-1">{step.title}</h3>
                    <p className="text-valar-indigo text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section data-cmp="SmallBusinessLoansPage.Faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Frequently Asked Questions</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Common questions<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <FAQItem
              question="Can you help if my bank has declined my application?"
              answer="Potentially. Different lenders have different lending criteria, and alternative funding options may be available depending on your circumstances."
            />
            <FAQItem
              question="Do I need an established business?"
              answer="Not necessarily. Funding may be available for both established businesses and newer ventures, depending on the business model and lender requirements."
            />
            <FAQItem
              question="What can business lending be used for?"
              answer={["Equipment purchases", "Vehicle purchases", "Working capital", "Business growth", "Project funding", "Refinancing existing facilities"]}
            />
            <FAQItem
              question="What information will I need to provide?"
              answer="Requirements vary depending on the lender and type of funding, but generally include business information, financial statements, and details about how the funds will be used."
            />
            <FAQItem
              question="Do you provide business valuation services?"
              answer="No. This service focuses on funding solutions, lending structures, and support through the lending process."
            />
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="SmallBusinessLoansPage.FinalCta" className="py-24 bg-valar-navy text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Explore Your Funding Options?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Let&apos;s find the right funding for your business<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-lilac text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you are looking to finance equipment, vehicles, working capital, or business growth, we can help you understand your options and navigate the lending process with confidence.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Phone className="w-5 h-5" /> Request a Call Back
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
