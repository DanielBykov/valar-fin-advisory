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
    a: "You can start the process as early as possible — even if you are only beginning to think about buying a home. Speaking with an adviser early can help you understand your borrowing potential, deposit requirements, available lending options, and what steps may improve your position over time.",
  },
  {
    q: "Do I need to pay for mortgage advice?",
    a: "In most cases, mortgage advisory services are free for the client. Usually, the bank pays the adviser after settlement once the loan is completed. Your adviser will explain clearly how the process works and whether any conditions may apply.",
  },
  {
    q: "How much can I borrow?",
    a: "Borrowing capacity depends on several factors including income, existing debt, living expenses, deposit size, employment type, interest rates, and financial commitments. We help assess your affordability and explore different lending scenarios based on your goals.",
  },
  {
    q: "Can I buy a property with less than a 20% deposit?",
    a: "Yes — in some situations, it may be possible to purchase a property with a smaller deposit depending on your financial position, income, and lender criteria. Currently, some lenders may allow borrowing with deposits as low as 5%. However, lower-deposit lending will often include additional conditions such as higher interest rates or low-equity premiums, stricter servicing requirements, and limitations on certain property types. Available options can differ significantly between lenders, which is why understanding your situation early can be valuable.",
  },
  {
    q: "Can you help if I'm self-employed or have non-standard income?",
    a: "Yes — many lenders can work with self-employed clients, contractors, or clients with more complex income structures. Usually, lenders require an existing history of income and financial documents. Some banks may prefer two years of financial history, while others may consider shorter periods depending on the situation. Every case is different, which is why it is important to assess your circumstances individually and structure the application appropriately.",
  },
  {
    q: "Do I need a signed offer before applying for a mortgage?",
    a: "Not always. In many situations, clients first apply for a pre-approval to understand their borrowing range and strengthen their position before searching for a property. However, some lending situations may require a signed Sale & Purchase Agreement before a lender can provide a final decision, depending on deposit size, LVR, lender policy, property type, income structure, or the complexity of the application.",
  },
  {
    q: "How long does mortgage approval take?",
    a: "Timeframes can vary depending on the lender, the complexity of the application, and whether a signed Sale & Purchase Agreement is already in place. In many cases, preliminary assessment may happen within a few days, pre-approvals may take several business days, and live purchase applications are often prioritised by lenders. When preparing a Sale & Purchase Agreement, we commonly suggest allowing approximately 10–15 working days for finance approval conditions, depending on the situation and lender requirements.",
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
      <section className="bg-valar-navy text-white pt-28 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Mortgage Advice</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
              Mortgage Advice Built Around<br className="hidden md:block" /> Your Financial Future<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-valar-lilac max-w-3xl leading-relaxed mb-10 border-l-2 border-valar-amber pl-4 font-light">
              Strategic mortgage guidance for first home buyers, homeowners, investors, and growing families across New Zealand. At Valar, we help clients structure lending with clarity, flexibility, and long-term financial goals in mind.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
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

      {/* WHY WORK WITH A MORTGAGE ADVISER */}
      <section className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Work With a Mortgage Adviser?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6">
              We don&apos;t focus only on what you can borrow today.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-valar-indigo max-w-3xl leading-relaxed">
              Buying property is one of the biggest financial decisions most people will make. At Valar, we help you structure lending around your long-term goals, future flexibility, and overall financial strategy.
            </motion.p>
          </motion.div>

          {/* Comparison table */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="overflow-x-auto mb-16">
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
                  ["One lending perspective", "Independent guidance across multiple options"],
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
            <p className="text-valar-indigo font-medium mb-4">We help clients understand:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Borrowing power and affordability",
                "Repayment flexibility",
                "Fixed, floating, offset, and split lending structures",
                "Refinancing opportunities",
                "Future investment and renovation plans",
                "Long-term financial strategy",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-valar-navy text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* MORTGAGE SOLUTIONS */}
      <section className="py-24 bg-valar-navy text-white">
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
              { icon: HomeIcon, title: "Property & Home Mortgages", desc: "Helping individuals and families purchase, upgrade, or restructure owner-occupied homes.", items: ["Home purchases", "Upgrading or relocating", "Repayment structuring", "Fixed vs floating strategy", "Offset and flexible lending", "Long-term affordability planning"] },
              { icon: TrendingUp, title: "Investment Mortgages", desc: "Strategic lending for investment properties and long-term portfolio growth.", items: ["Investment property finance", "Equity structuring", "Cashflow-focused lending", "Interest-only options", "Portfolio strategy", "Future borrowing capacity planning"] },
              { icon: RefreshCw, title: "Refinancing & Restructuring", desc: "Reviewing your existing lending and exploring better opportunities.", items: ["Lower interest rates", "Improved loan structure", "Reduced repayments", "Greater flexibility", "Debt restructuring", "Potential cashback offers"] },
              { icon: Building2, title: "Building & Construction Loans", desc: "Support for clients building a new home, renovating, or completing construction projects.", items: ["Construction lending", "Progressive drawdown loans", "Turnkey builds", "Valuation and CCC requirements", "Timeline planning", "Support through the build process"] },
              { icon: CreditCard, title: "Debt Consolidation", desc: "Helping simplify finances and improve cashflow by restructuring existing debt — to improve financial clarity and long-term stability.", items: ["Personal loans", "Credit cards", "Vehicle finance", "Short-term debt"] },
              { icon: Layers, title: "Top-Up Loans & Equity Release", desc: "Using existing equity strategically for future goals.", items: ["Renovations and home improvements", "Green loans and energy-efficient upgrades", "Investment opportunities", "Lifestyle projects", "Emergency funding"] },
            ].map((sol, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-valar-indigo p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-4">
                  <sol.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="text-xl font-bold">{sol.title}</h3>
                </div>
                <p className="text-valar-lilac text-sm leading-relaxed mb-5">{sol.desc}</p>
                <ul className="space-y-1.5">
                  {sol.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-valar-steel">
                      <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* FEATURED — First Home Buyers */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-8">
            <Link href="/services/first-home-buyers" className="group block overflow-hidden rounded-sm border-t-4 border-valar-amber relative">
              <div className="relative h-72 md:h-96 overflow-hidden">
                <Image src="/images/first-home.png" alt="First Home Buyers" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-valar-navy/90 via-valar-navy/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-3 block">Featured Service</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  First Home Buyers<span className="text-valar-amber">.</span>
                </h3>
                <p className="text-valar-lilac text-lg leading-relaxed mb-6 max-w-2xl">
                  Buying your first home is one of the most significant financial decisions you will make. At Valar, we help bring clarity, structure, and confidence throughout the entire process — from understanding your borrowing power to settlement.
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
      <section className="py-24 bg-valar-fog">
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
              { num: "01", title: "Initial Conversation", body: "We begin with a short 20–30 minute discussion to understand your goals, plans, and financial situation." },
              { num: "02", title: "Documents & Assessment", body: "You receive a secure link where you can upload documents and provide information about income and employment, assets and savings, existing lending, deposit, property goals, and ownership structure." },
              { num: "03", title: "Strategy & Structure", body: "Your adviser reviews your situation, assesses affordability, and explores suitable lending structures and scenarios. In many cases, we can provide an estimated borrowing range even before a formal pre-approval is submitted." },
              { num: "04", title: "Application & Approval", body: "Once the strategy is confirmed, we prepare and submit the application to the lender or lenders best suited to your goals and circumstances. We help guide you through valuations, inspections, legal services, and supporting documents throughout the process." },
              { num: "05", title: "Settlement & Ongoing Support", body: "Once approval is received, we continue supporting you through settlement and onboarding with the lender. Your mortgage adviser remains your main point of contact throughout the process." },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="flex gap-6 bg-white p-8 rounded-lg shadow-sm border border-valar-concrete">
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
      <section className="py-24 bg-white">
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
      <section className="py-24 bg-valar-navy text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Discuss Your Options?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Start with a clear conversation<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-lilac text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you&apos;re buying your first home, refinancing, investing, or planning your next step, we&apos;re here to help you build a lending strategy with confidence.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Phone className="w-5 h-5" /> Request a Call Back
              </Link>
            </motion.div>
            <motion.p variants={fadeIn} className="mt-8 text-valar-steel text-xs">
              I agree to allow Valar Financial Advisors to contact me regarding my enquiry and to store and process my personal information.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
