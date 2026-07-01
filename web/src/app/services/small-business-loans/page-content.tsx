"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
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
import { AdviserCredentialStrip } from "@/components/adviser-credential-strip";
import { faqs } from "./faqs";

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

export default function SmallBusinessLoansContent() {
  return (
    <div data-cmp="SmallBusinessLoansPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section data-cmp="SmallBusinessLoansPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/small-business-loans-hero.png" fill priority unoptimized className="object-cover object-center" alt="Business loans hero" />
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
              Small Business Loans<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.div variants={fadeIn} className="text-base text-valar-lilac max-w-2xl leading-relaxed mb-10 border-l-2 border-valar-amber pl-4">
              Helping small business owners access funding for growth and working capital.
            </motion.div>
            <motion.div data-cmp="SmallBusinessLoansPage.Hero.Cta" variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
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
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                Finding the right funding solution can be challenging.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Why work with Valar?</motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo font-medium mb-5 text-sm">
                Business lending is about presenting your business effectively and finding resources that support your goals.
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
                desc: "Funding to support day-to-day operations, cashflow, and growth.",
              },
              {
                icon: Wrench,
                title: "Assets",
                desc: "Equipment, machinery, vehicles, and fleet purchases.",
              },
              {
                icon: RefreshCw,
                title: "Finance & Restructuring",
                desc: "Reviewing existing lending and exploring better options.",
              },
            ].map((card, i) => (
              <motion.div data-cmp="SmallBusinessLoansPage.WhatWeHelpWith.FundingCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-4">
                  <card.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="font-bold text-lg text-valar-navy">{card.title}</h3>
                </div>
                <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section data-cmp="SmallBusinessLoansPage.WhoIsThisFor" className="py-14 bg-white">
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
            className="flex flex-wrap gap-3"
          >
            {[
              "Self-Employed Professionals",
              "Tradespeople",
              "Small Business Owners",
              "Property Developers & Renovators",
              "Start-Ups",
            ].map((item, i) => (
              <motion.div data-cmp="SmallBusinessLoansPage.WhoIsThisFor.Item" key={i} variants={fadeIn} className="px-5 py-3 border border-valar-amber rounded-sm text-valar-navy font-medium text-sm">
                {item}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="SmallBusinessLoansPage.HowItWorks" className="py-14 bg-valar-fog">
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
            className="max-w-3xl"
          >
            {[
              { num: "01", title: "Initial Discussion", body: "We discuss your business, funding requirements, and goals." },
              { num: "02", title: "Information Review", body: "We review available financial information and supporting documentation." },
              { num: "03", title: "Funding Strategy", body: "We identify potential funding options and recommend a suitable structure." },
              { num: "04", title: "Application Support", body: "We assist with preparing and presenting the application to the lender." },
              { num: "05", title: "Approval & Settlement", body: "We guide you through the approval process and coordinate next steps." },
            ].map((step, i, arr) => (
              <div key={i}>
                <motion.div data-cmp="SmallBusinessLoansPage.HowItWorks.Step" variants={fadeIn} className="grid grid-cols-[1fr_2fr] gap-8 items-start py-5">
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
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      <AdviserCredentialStrip />

      {/* FINAL CTA */}
      <section data-cmp="SmallBusinessLoansPage.FinalCta" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Explore Your Funding Options?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">
                Let&apos;s find the right funding for your business<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Understand your options and navigate the lending process with confidence.
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
