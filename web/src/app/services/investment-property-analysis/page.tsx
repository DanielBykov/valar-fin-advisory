"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Phone,
  ChevronDown,
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
    <div className="border-b border-[#C9CED6]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#061634] text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#E8A23A] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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
            <p className="text-[#2E4882] text-sm leading-relaxed pb-5">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InvestmentPropertyAnalysisPage() {
  return (
    <div className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section className="bg-[#061634] text-white pt-28 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-[#E8A23A]" />
              <span className="text-[#8F93B5] font-bold tracking-widest text-xs uppercase">Property Investment</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
              Investment Property Analysis<span className="text-[#E8A23A]">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#8F93B5] font-light mb-8">
              Is This Property Helping You Build Wealth?
            </motion.p>
            <motion.div variants={fadeIn} className="text-base text-[#C8CBE3] max-w-2xl leading-relaxed mb-10 border-l-2 border-[#E8A23A] pl-4">
              Financial modelling and strategic analysis designed to support better investment decisions.
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Phone className="w-5 h-5" /> Request a Call Back
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY PROPERTY INVESTMENT ANALYSIS */}
      <section className="py-24 bg-[#F6F7F9]">
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Why Property Investment Analysis?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634] mb-6 leading-tight">
                Good investment decisions start with good analysis<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed mb-6">
                Many investment decisions are made based on emotions, headlines, assumptions, or advice from people whose goal is to sell a property. At Valar, we take a different approach.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#2E4882] font-semibold mb-2">Our role is not to sell property.</motion.p>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed">Our role is to help you make informed investment decisions.</motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase mb-5">Questions we help answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Will this property support my wealth-building goals?",
                  "How will it affect my cashflow?",
                  "What are the risks?",
                  "What happens if interest rates change?",
                  "How much equity could I build over time?",
                  "What impact will it have on future borrowing capacity?",
                  "Is it better to focus on yield, growth, or a balanced strategy?",
                ].map((q, i) => (
                  <motion.li key={i} variants={fadeIn} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-[#C9CED6] shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8A23A] flex-shrink-0 mt-1.5" />
                    <span className="text-[#061634] text-sm leading-relaxed">{q}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES VALAR DIFFERENT */}
      <section className="py-24 bg-[#061634] text-white">
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">What Makes Valar Different?</span>
              </motion.div>
              <motion.p variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Real estate agents sell property<span className="text-[#E8A23A]">.</span>
              </motion.p>
              <motion.p variants={fadeIn} className="text-2xl font-light text-[#8F93B5] mb-8">
                We analyse investments.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#C8CBE3] leading-relaxed">
                Every recommendation is built around financial outcomes, scenario modelling, and long-term strategy — with no incentive to sell you anything.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, label: "Cashflow analysis" },
                { icon: TrendingUp, label: "Equity growth" },
                { icon: Layers, label: "Borrowing capacity" },
                { icon: ShieldCheck, label: "Risk management" },
                { icon: BarChart2, label: "Portfolio structure" },
                { icon: HomeIcon, label: "Lending optimisation" },
                { icon: Target, label: "Long-term wealth creation" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className={`bg-[#2E4882] border border-white/10 rounded-sm p-4 flex items-center gap-3 ${i === 6 ? "col-span-2" : ""}`}>
                  <item.icon className="w-4 h-4 text-[#E8A23A] flex-shrink-0" />
                  <span className="text-sm text-[#C8CBE3] font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE ANALYSE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">What We Analyse</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              A complete picture of the investment<span className="text-[#E8A23A]">.</span>
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
                  title: "Property Cashflow",
                  desc: "Understanding the true financial performance of an investment property.",
                  items: ["Rental income", "Operating expenses", "Mortgage costs", "Net cashflow", "Holding costs"],
                },
                {
                  icon: TrendingUp,
                  title: "Yield vs Growth",
                  desc: "Different investment strategies produce different outcomes.",
                  items: ["Cashflow strategy — stronger rental returns", "Growth strategy — long-term capital appreciation", "Balanced strategy — combining both objectives"],
                },
                {
                  icon: Layers,
                  title: "Equity & Borrowing Capacity",
                  desc: "Property investing often relies on effective use of leverage.",
                  items: ["Current equity position", "Future equity growth", "Loan-to-value ratios (LVR)", "Future borrowing capacity", "Leverage opportunities"],
                },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-[#E8A23A]" />
                    </div>
                    <h3 className="font-bold text-[#061634]">{card.title}</h3>
                  </div>
                  <p className="text-[#2E4882] text-sm mb-4 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#061634]">
                        <div className="w-1 h-1 rounded-full bg-[#E8A23A] flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Row 2 — 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: BarChart2,
                  title: "Portfolio Structure",
                  desc: "For investors with existing properties, we can review your full portfolio.",
                  items: ["Portfolio performance", "Lending structures", "Portfolio cashflow", "Future expansion opportunities", "Concentration risk", "Long-term sustainability"],
                },
                {
                  icon: ShieldCheck,
                  title: "Sensitivity & Risk Analysis",
                  desc: "Markets change. Interest rates move. Rental markets fluctuate. We test different assumptions to help investors understand potential outcomes before making decisions.",
                  items: ["Interest rate scenarios", "Rental market fluctuations", "Vacancy risk", "Capital growth assumptions", "Downside stress testing"],
                },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-[#E8A23A]" />
                    </div>
                    <h3 className="font-bold text-[#061634]">{card.title}</h3>
                  </div>
                  <p className="text-[#2E4882] text-sm mb-4 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#061634]">
                        <div className="w-1 h-1 rounded-full bg-[#E8A23A] flex-shrink-0 mt-1.5" />
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

      {/* SCENARIO MODELLING */}
      <section className="py-24 bg-[#2E4882] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Scenario Modelling</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Every analysis includes multiple scenarios<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#C8CBE3] mt-4 max-w-2xl leading-relaxed">
              Understanding multiple outcomes helps investors make more informed decisions and avoid unexpected surprises.
            </motion.p>
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
                colour: "border-[#8F93B5]",
                dot: "bg-[#8F93B5]",
                desc: "Expected performance under normal market conditions — the most likely outcome based on current data and reasonable assumptions.",
              },
              {
                label: "Best Case",
                colour: "border-[#E8A23A]",
                dot: "bg-[#E8A23A]",
                desc: "Stronger growth and favourable market conditions — helps you understand the upside potential of the investment.",
              },
              {
                label: "Worst Case",
                colour: "border-red-400",
                dot: "bg-red-400",
                desc: "Lower growth, higher interest rates, reduced rental performance, or other downside scenarios — essential for understanding risk before committing.",
              },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeIn} className={`bg-[#061634]/40 border-t-2 ${s.colour} rounded-sm p-8`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <h3 className="font-bold text-lg">{s.label}</h3>
                </div>
                <p className="text-[#C8CBE3] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section className="py-24 bg-[#F6F7F9]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">What You Receive</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              A complete analysis you can act on<span className="text-[#E8A23A]">.</span>
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
              { num: "01", title: "Property Investment Analysis Report", desc: "A written summary outlining opportunities, risks, assumptions, and recommendations." },
              { num: "02", title: "Custom Financial Model", desc: "An Excel-based model that allows you to review assumptions and explore future scenarios." },
              { num: "03", title: "Cashflow & Yield Analysis", desc: "Clear analysis of expected returns and investment performance." },
              { num: "04", title: "Equity & Borrowing Capacity Review", desc: "Understanding how the investment may influence future borrowing opportunities." },
              { num: "05", title: "Investment Strategy Recommendations", desc: "Guidance on how the property may fit into your broader wealth-building objectives." },
              { num: "06", title: "Action Plan & Next Steps", desc: "Practical recommendations to support future decision-making." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-[#C9CED6]">
                <div className="text-4xl font-bold text-[#C9CED6] mb-4 leading-none">{item.num}</div>
                <h3 className="text-base font-bold text-[#061634] mb-3">{item.title}</h3>
                <p className="text-[#2E4882] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Who Is This For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              This service may be suitable for<span className="text-[#E8A23A]">.</span>
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
              { icon: HomeIcon, title: "First-Time Property Investors", desc: "Understanding whether a property aligns with your financial goals before you commit." },
              { icon: Layers, title: "Existing Portfolio Owners", desc: "Reviewing portfolio performance, lending structures, and future expansion opportunities." },
              { icon: Briefcase, title: "High-Income Professionals", desc: "Exploring property as part of a broader wealth strategy with a structured approach." },
              { icon: Wrench, title: "Builders & Renovators", desc: "Evaluating project feasibility, expected returns, and risk before starting a project." },
              { icon: Clock, title: "Long-Term Investors", desc: "Creating a structured and disciplined approach to building wealth through property." },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeIn} className={`bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6] ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-[#061634] flex items-center justify-center mb-5">
                  <card.icon className="w-4 h-4 text-[#E8A23A]" />
                </div>
                <h3 className="font-bold text-[#061634] mb-3">{card.title}</h3>
                <p className="text-[#2E4882] text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section className="py-24 bg-[#F6F7F9]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              From discovery to clear recommendations<span className="text-[#E8A23A]">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                num: "01",
                title: "Discovery Session",
                body: "We discuss your goals, investment strategy, and current financial position.",
              },
              {
                num: "02",
                title: "Information Gathering",
                body: "You provide information about the property or portfolio being analysed — purchase price, rental estimates, lending information, existing portfolio details, and future plans.",
              },
              {
                num: "03",
                title: "Financial Modelling & Analysis",
                body: "We build financial models, assess risks, and evaluate multiple future scenarios.",
              },
              {
                num: "04",
                title: "Presentation & Recommendations",
                body: "We review the findings together and discuss practical recommendations and next steps.",
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="flex gap-6 bg-white p-8 rounded-lg border border-[#C9CED6] shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#061634] text-white flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#061634] mb-2">{step.title}</h3>
                  <p className="text-[#2E4882] leading-relaxed text-sm">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Frequently Asked Questions</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              Common questions<span className="text-[#E8A23A]">.</span>
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
      <section className="py-24 bg-[#061634] text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Ready to Analyse Your Next Investment?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Good investment decisions start with good analysis<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#C8CBE3] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you are considering your first investment property, reviewing an existing portfolio, or planning your next acquisition — we can help you understand the numbers before making the decision.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-8 py-4 rounded-sm font-bold transition-colors">
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
