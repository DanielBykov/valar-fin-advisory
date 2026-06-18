"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Home as HomeIcon,
  ShieldCheck,
  Layers,
  DollarSign,
  Target,
  Briefcase,
  Wrench,
  Clock,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-valar-concrete">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-valar-navy text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-valar-amber flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
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
            <p className="text-valar-indigo text-sm leading-relaxed pb-5">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InvestmentPropertyAnalysisPage() {
  return (
    <div data-cmp="InvestmentPropertyAnalysisPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section data-cmp="InvestmentPropertyAnalysisPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/investment-property-hero.png"
            alt="Investment property in New Zealand"
            fill
            priority
            unoptimized
            className="object-cover object-[center_70%]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Wealth Building</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Investment Property Analysis<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              Financial modelling and strategic analysis to support better investment decisions.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY PROPERTY INVESTMENT ANALYSIS */}
      <section data-cmp="InvestmentPropertyAnalysisPage.WhyAnalysis" className="py-24 bg-valar-fog">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Property Investment Analysis?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                Good investment decisions start with<br />good analysis<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                Most investment decisions are driven by emotions or advice from people with something to sell. Our role is to help you make informed decisions — based on numbers, not sales pitches.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Questions we help answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Will this property support my wealth-building goals?",
                  "How will it affect my cashflow?",
                  "What happens if interest rates change?",
                  "How much equity could I build over time?",
                  "Yield, growth, or balanced — which strategy is right for me?",
                ].map((q, i) => (
                  <motion.li data-cmp="InvestmentPropertyAnalysisPage.WhyAnalysis.QuestionItem" key={i} variants={fadeIn} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-valar-concrete shadow-sm">
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
      <section data-cmp="InvestmentPropertyAnalysisPage.WhatMakesDifferent" className="py-24 bg-valar-navy text-white">
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
              <motion.p variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                We don't sell anything<span className="text-valar-amber">.</span>
              </motion.p>
              <motion.p variants={fadeIn} className="text-2xl font-light text-valar-steel mb-8">
                We analyse your current or potential investment.
              </motion.p>
              <motion.div variants={fadeIn} className="border-l-2 border-valar-amber pl-4">
                <p className="text-white/90 leading-relaxed italic">&ldquo;Property can create wealth, or it can also become a nightmare. The difference is in small nuances behind the numbers.&rdquo;</p>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, label: "Cashflow analysis" },
                { icon: TrendingUp, label: "Equity growth" },
                { icon: Layers, label: "Borrowing capacity" },
                { icon: ShieldCheck, label: "Risk management" },
                { icon: BarChart2, label: "Portfolio structure" },
                { icon: HomeIcon, label: "Lending optimisation" },
              ].map((item, i) => (
                <motion.div data-cmp="InvestmentPropertyAnalysisPage.WhatMakesDifferent.FeatureBadge" key={i} variants={fadeIn} className="bg-valar-fog rounded-sm p-4 flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-valar-amber flex-shrink-0" />
                  <span className="text-sm text-valar-navy font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE ANALYSE */}
      <section data-cmp="InvestmentPropertyAnalysisPage.WhatWeAnalyse" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What We Analyse</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              A complete picture of the investment<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: HomeIcon,
                title: "Property Portfolio",
                desc: "Understand before you commit.",
                items: ["Yield vs growth strategy", "Capital appreciation potential", "Interest rate sensitivity", "Downside risk scenarios", "Market assumptions"],
              },
              {
                icon: DollarSign,
                title: "Cashflow & Performance",
                desc: "Know your profit and yield.",
                items: ["Rental income", "Operating expenses", "Mortgage costs", "Net cashflow", "Net yield and profitability"],
              },
              {
                icon: BarChart2,
                title: "Borrowing Capacity",
                desc: "Explore your opportunities.",
                items: ["Lending structure", "Current equity position", "Future borrowing capacity", "Leverage", "Expansion"],
              },
            ].map((card, i) => (
              <motion.div data-cmp="InvestmentPropertyAnalysisPage.WhatWeAnalyse.AnalysisCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-4">
                  <card.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="font-bold text-valar-navy">{card.title}</h3>
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
          </motion.div>
        </div>
      </section>

      {/* SCENARIO MODELLING */}
      <section data-cmp="InvestmentPropertyAnalysisPage.ScenarioModelling" className="py-24 bg-valar-indigo text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Scenario Modelling</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Every analysis includes multiple scenarios<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                label: "Base Case",
                colour: "border-valar-steel",
                dot: "bg-valar-steel",
                desc: "The most likely outcome based on current data and reasonable assumptions.",
              },
              {
                label: "Best Case",
                colour: "border-valar-amber",
                dot: "bg-valar-amber",
                desc: "Stronger growth and favourable conditions — the upside potential.",
              },
              {
                label: "Worst Case",
                colour: "border-red-400",
                dot: "bg-red-400",
                desc: "Lower growth, higher rates, reduced rental performance — understanding the downside before committing.",
              },
            ].map((s, i) => (
              <motion.div data-cmp="InvestmentPropertyAnalysisPage.ScenarioModelling.ScenarioCard" key={i} variants={fadeIn} className={`bg-valar-navy/40 border-t-2 ${s.colour} rounded-sm p-8`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <h3 className="font-bold text-lg">{s.label}</h3>
                </div>
                <p className="text-valar-lilac text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section data-cmp="InvestmentPropertyAnalysisPage.WhatYouReceive" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What You Receive</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              A clear roadmap you can act on<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row gap-0"
          >
            {/* Left column */}
            <div className="flex-1 flex flex-col divide-y divide-valar-concrete">
              {[
                { title: "Property Investment Analysis", desc: "Opportunities, risks, assumptions in one written summary." },
                { title: "Custom Financial Model", desc: "Review assumptions and model multiple future scenarios." },
                { title: "Cashflow & Yield Analysis", desc: "Clear analysis of expected returns and investment performance." },
              ].map((item, i) => (
                <motion.div data-cmp="InvestmentPropertyAnalysisPage.WhatYouReceive.DeliverableItem" key={i} variants={fadeIn} className="py-8 pr-10">
                  <h3 className="text-base font-bold text-valar-navy mb-2">{item.title}</h3>
                  <p className="text-valar-indigo text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Amber divider */}
            <div className="hidden md:block w-px bg-valar-amber mx-2" />

            {/* Right column */}
            <div className="flex-1 flex flex-col divide-y divide-valar-concrete">
              {[
                { title: "Borrowing Capacity Review", desc: "How the investment may influence your future borrowing opportunities." },
                { title: "Investment Strategy", desc: "How the property fits into your broader wealth-building objectives." },
                { title: "Action Plan", desc: "Practical next steps to support your investment decisions." },
              ].map((item, i) => (
                <motion.div data-cmp="InvestmentPropertyAnalysisPage.WhatYouReceive.DeliverableItem" key={i} variants={fadeIn} className="py-8 pl-10">
                  <h3 className="text-base font-bold text-valar-navy mb-2">{item.title}</h3>
                  <p className="text-valar-indigo text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section data-cmp="InvestmentPropertyAnalysisPage.WhoIsThisFor" className="py-24 bg-white">
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
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              This service may be suitable for you<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-5 max-w-4xl"
          >
            {[
              "First-home buyers",
              "Current home owners",
              "Mum and dad investors",
              "Existing portfolio owners",
              "High-income professionals",
              "Builders and renovators",
              "Property developers",
              "Long-term investors",
              "Investors diversifying into property",
            ].map((item, i) => (
              <motion.div data-cmp="InvestmentPropertyAnalysisPage.WhoIsThisFor.Item" key={i} variants={fadeIn} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                <span className="text-valar-navy font-medium">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="InvestmentPropertyAnalysisPage.HowItWorks" className="py-24 bg-valar-fog">
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
              From discovery to clear recommendations<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-start md:items-center gap-0"
          >
            {[
              { num: "01", title: "Discovery" },
              { num: "02", title: "Information Gathering" },
              { num: "03", title: "Financial Modelling & Analysis" },
              { num: "04", title: "Final Meetup & Discussion" },
              { num: "05", title: "Investment Analysis Report", highlight: true },
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-0">
                <motion.div
                  data-cmp="InvestmentPropertyAnalysisPage.HowItWorks.Step"
                  variants={fadeIn}
                  className={`flex flex-col items-center text-center px-4 py-6 flex-1 min-w-0 ${step.highlight ? "bg-valar-amber/10 rounded-lg border border-valar-amber" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 flex-shrink-0 ${step.highlight ? "bg-valar-amber text-white" : "bg-valar-navy text-white"}`}>
                    {step.num}
                  </div>
                  <h3 className={`text-sm font-bold leading-snug ${step.highlight ? "text-valar-amber" : "text-valar-navy"}`}>{step.title}</h3>
                </motion.div>
                {i < arr.length - 1 && (
                  <div className="hidden md:flex items-center self-center flex-shrink-0 px-1 mt-[-18px]">
                    <ChevronRight className="w-5 h-5 text-valar-concrete" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section data-cmp="InvestmentPropertyAnalysisPage.Faq" className="pt-12 pb-24 bg-white">
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
              question="Do you help me find investment properties?"
              answer="No. We do not act as buyer's agents or real estate agents. Our role is to analyse opportunities and assess their financial implications."
            />
            <FAQItem
              question="Do you provide tax advice?"
              answer="No. Tax considerations may be discussed at a high level, but we recommend seeking advice from a qualified accountant or tax adviser for tax-specific matters."
            />
            <FAQItem
              question="Can you review my existing portfolio?"
              answer="Yes. We can analyse existing properties, lending structures, cashflow, equity positions, and future opportunities."
            />
            <FAQItem
              question="Can this be combined with mortgage advice?"
              answer="Absolutely. Many clients use Property Investment Analysis alongside mortgage advice to better understand both the investment opportunity and the most effective lending structure."
            />
            <FAQItem
              question="Is this suitable if I only have one investment property?"
              answer="Yes. The analysis can be completed for a single property, multiple properties, or a future portfolio strategy."
            />
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="InvestmentPropertyAnalysisPage.FinalCta" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Analyse Your Next Investment?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">
                Good investment decisions start with good analysis<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Understand the numbers before you commit — whether it's your first investment or your next one.
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
