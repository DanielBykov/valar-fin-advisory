"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Phone,
  CheckCircle,
  ChevronDown,
  Home as HomeIcon,
  TrendingUp,
  RefreshCw,
  Building2,
  CreditCard,
  Layers,
} from "lucide-react";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const faqs = [
  {
    q: "When should I speak with a mortgage adviser?",
    a: "As early as possible — even before you're ready to buy. Early advice helps you understand borrowing potential, deposit requirements, and what steps to take.",
  },
  {
    q: "Do I need to pay for mortgage advice?",
    a: "In most cases, no. The bank pays the adviser after settlement. Your adviser will explain how the process works and if any conditions apply.",
  },
  {
    q: "How much can I borrow?",
    a: "It depends on income, existing debt, living expenses, deposit size, and employment type. We assess your affordability and explore lending scenarios based on your goals.",
  },
  {
    q: "Can I buy a property with less than a 20% deposit?",
    a: "Yes — some lenders allow deposits as low as 5%. Lower-deposit lending usually comes with additional conditions, including higher rates and stricter servicing requirements.",
  },
  {
    q: "Can you help if I'm self-employed or have non-standard income?",
    a: "Yes — many lenders work with self-employed clients and contractors. Most require two years of financial history, though some consider shorter periods depending on the situation.",
  },
  {
    q: "Do I need a signed offer before applying for a mortgage?",
    a: "Not always. Many clients apply for pre-approval before finding a property. Some situations require a signed Sale & Purchase Agreement depending on deposit size and lender policy.",
  },
  {
    q: "How long does mortgage approval take?",
    a: "Timeframes vary by lender and complexity. Pre-approvals typically take several business days. We recommend allowing 10–15 working days for finance conditions on a Sale & Purchase Agreement.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-valar-concrete last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-4 group"
      >
        <span className="font-semibold text-valar-navy text-lg leading-snug group-hover:text-valar-amber transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-valar-amber flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-6 text-valar-indigo leading-relaxed text-[15px] max-w-3xl">{a}</p>}
    </div>
  );
}

export default function MortgageAdvicePage() {
  return (
    <div data-cmp="MortgageAdvicePage" className="w-full flex flex-col font-sans">
      {/* HERO */}
      <section data-cmp="MortgageAdvicePage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/mortgage-hero.png"
            alt="New Zealand coastal home"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/65 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Foundations</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Strategic Mortgage Advice<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              Clear guidance for first home buyers, homeowners, investors and business owners.
            </motion.p>
            <motion.div data-cmp="MortgageAdvicePage.Hero.Cta" variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY WORK WITH A MORTGAGE ADVISER */}
      <section data-cmp="MortgageAdvicePage.WhyAdviser" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-8">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Work With a Mortgage Adviser?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">
              We focus on the bigger financial picture
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-valar-indigo max-w-3xl leading-relaxed">
              Because a mortgage is not just about buying a property—it&apos;s about building your future.
            </motion.p>
          </motion.div>

          {/* Comparison table */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-valar-concrete text-valar-navy font-bold text-left px-6 py-4 rounded-tl-lg">Working Directly With a Bank</th>
                  <th className="bg-valar-navy text-white font-bold text-left px-6 py-4 rounded-tr-lg">Working With Valar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Access to one bank's products only", "Access to multiple lenders and lending options"],
                  ["Lending advice limited to one lender's policy", "Strategic guidance tailored to your situation"],
                  ["Focus mainly on loan approval", "Focus on long-term outcomes and flexibility"],
                  ["Standard lending structure", "Personalised mortgage strategy"],
                  ["Limited comparison between options", "Comparison of different structures and scenarios"],
                  ["Mostly transactional process", "Ongoing strategic support and guidance"],
                  ["You manage much of the process yourself", "End-to-end support throughout the process"],
                ].map(([bank, valar], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-valar-fog"}>
                    <td className="px-6 py-4 text-valar-indigo border-r border-valar-concrete">{bank}</td>
                    <td className="px-6 py-4 text-valar-navy font-medium flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                      {valar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <p className="text-xl font-bold text-valar-navy mb-6">We help clients understand:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Borrowing power and affordability",
                "Repayment flexibility",
                "Future investment and renovations",
                "Refinancing opportunities",
                "Fixed, floating, offset and split",
                "Long-term financial strategy",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-white border border-valar-concrete rounded-sm px-4 py-3 text-valar-navy font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-valar-amber flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* MORTGAGE SOLUTIONS */}
      <section data-cmp="MortgageAdvicePage.MortgageSolutions" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Mortgage Solutions</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              The full range of lending support<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: HomeIcon, title: "Property & Home Mortgages", desc: "Helping individuals and families purchase.", items: ["Home purchases", "Upgrading or relocating", "Repayment structuring", "Fixed vs floating strategy", "Offset and flexible lending"] },
              { icon: TrendingUp, title: "Investment Mortgages", desc: "Strategic lending for investment properties and long-term portfolio growth.", items: ["Investment property finance", "Equity structuring", "Cashflow-focused lending", "Interest-only options", "Portfolio strategy"] },
              { icon: RefreshCw, title: "Refinancing & Restructuring", desc: "Reviewing your existing lending and exploring better opportunities.", items: ["Lower interest rates", "Improved loan structure", "Reduced repayments", "Greater flexibility", "Debt restructuring"] },
              { icon: Building2, title: "Building & Construction Loans", desc: "Support building a new home, renovating or construction projects.", items: ["Construction lending", "Progressive drawdown loans", "Turnkey builds", "Valuation and CCC requirements", "Timeline planning"] },
              { icon: CreditCard, title: "Debt Consolidation", desc: "Helping simplify and improve cash flow by restructuring existing debt.", items: ["Personal loans", "Credit cards", "Vehicle finance", "Short-term debt", "Financial clarity"] },
              { icon: Layers, title: "Top-Up Loans & Equity Release", desc: "Using existing equity strategically for future goals.", items: ["Renovations and home improvements", "Green loans and energy-efficient upgrades", "Investment opportunities", "Lifestyle projects", "Emergency funding"] },
            ].map((sol, i) => (
              <motion.div data-cmp="MortgageAdvicePage.MortgageSolutions.SolutionCard" key={i} variants={fadeIn} className="bg-valar-concrete p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-4">
                  <sol.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="text-xl font-bold text-valar-navy">{sol.title}</h3>
                </div>
                <p className="text-valar-indigo text-xs leading-relaxed mb-5">{sol.desc}</p>
                <ul className="space-y-1.5">
                  {sol.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-valar-navy">
                      <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* FEATURED — First Home Buyers */}
          <motion.div data-cmp="MortgageAdvicePage.MortgageSolutions.FeaturedFirstHome" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-8">
            <Link href="/services/first-home-buyers" className="group block overflow-hidden rounded-sm border-t-4 border-valar-amber relative">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <Image src="/images/first-home-buyers-banner.png" alt="First Home Buyers" fill className="object-cover object-bottom group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-valar-navy/90 via-valar-navy/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-3 block">Featured Service</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  First Home Buyers<span className="text-valar-amber">.</span>
                </h3>
                <p className="text-valar-lilac text-lg leading-relaxed mb-6 max-w-2xl">
                  We bring clarity, structure and confidence to your financial decision.
                </p>
                <div className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-7 py-3.5 rounded-sm font-bold text-sm transition-colors">
                  Explore First Home Buyer Guidance <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="MortgageAdvicePage.HowItWorks" className="pt-24 pb-12 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              A clear path from first conversation to settlement<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-6">
            {[
              { num: "01", title: "Initial Conversation", body: "A short discussion to understand your goals, plans, and financial situation." },
              { num: "02", title: "Documents & Assessment", body: "You upload documents covering income, savings, existing lending, deposit, and property goals via a secure link." },
              { num: "03", title: "Strategy & Structure", body: "We review your situation, assess affordability, and explore suitable lending structures — often with an early borrowing estimate." },
              { num: "04", title: "Application & Approval", body: "We prepare and submit your application to the most suitable lender, supporting you through every requirement." },
              { num: "05", title: "Settlement & Ongoing Support", body: "We support you through settlement and remain your main point of contact with the lender." },
            ].map((step, i) => (
              <motion.div data-cmp="MortgageAdvicePage.HowItWorks.Step" key={i} variants={fadeIn} className="flex gap-6 bg-white p-8 rounded-lg shadow-sm border border-valar-concrete">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-valar-navy text-white flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-valar-navy mb-2">{step.title}</h3>
                  <p className="text-valar-indigo leading-relaxed text-sm">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section data-cmp="MortgageAdvicePage.Faq" className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Frequently Asked Questions</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Common questions, clear answers<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="MortgageAdvicePage.FinalCta" className="pt-12 pb-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left — text + CTA */}
            <motion.div variants={fadeIn}>
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Discuss Your Options?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-valar-navy mt-4 mb-6">
                Start with a clear conversation<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-valar-indigo text-lg leading-relaxed mb-8">
                Whether you&apos;re buying your first home, refinancing, investing, or planning your next step — let&apos;s talk.
              </p>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
            {/* Right — photo */}
            <motion.div variants={fadeIn} className="relative h-80 md:h-96 rounded-sm overflow-hidden">
              <Image
                src="/images/lena-client.jpg"
                alt="Lena Bykova discussing with a client"
                fill
                unoptimized
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
