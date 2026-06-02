"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Phone,
  ChevronDown,
  Download,
  CheckCircle2,
  Home as HomeIcon,
  Gavel,
  FileText,
  Users,
  Scale,
  Clipboard,
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
    <div className="border-b border-[#C9CED6]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#061634] text-sm md:text-base">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#E8A23A] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
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
              <ul className="pb-5 space-y-1.5">
                {answer.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#2E4882]">
                    <div className="w-1 h-1 rounded-full bg-[#E8A23A] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#2E4882] text-sm leading-relaxed pb-5">{answer}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FirstHomeBuyersPage() {
  return (
    <div className="w-full flex flex-col font-sans">

      {/* HERO — full-bleed photo */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/first-home.png" alt="First Home Buyers" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061634]/95 via-[#061634]/60 to-[#061634]/20" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 pb-20 pt-32 max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-[#E8A23A]" />
              <span className="text-[#8F93B5] font-bold tracking-widest text-xs uppercase">First Home Buyers</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-4 leading-[1.05]">
              Your First Home Starts With a Clear Plan<span className="text-[#E8A23A]">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-[#C8CBE3] max-w-2xl leading-relaxed border-l-2 border-[#E8A23A] pl-4 font-light mb-10">
              Helping first-home buyers understand deposits, lending options, KiwiSaver, and the home-buying process in New Zealand.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-8 py-4 rounded-sm font-bold transition-colors">
                <Download className="w-5 h-5" /> Download Free Guide
              </Link>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CAN FEEL OVERWHELMING */}
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Buying Your First Home</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634] mb-6 leading-tight">
                It can feel overwhelming<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed mb-4">
                Buying your first home is one of the biggest financial decisions you will ever make. Many first-home buyers come to us with similar questions.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed">
                The good news is that every situation is different, and there are often more options available than people realise. Understanding the process early can help you make better decisions and avoid costly mistakes.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase mb-5">Common questions we answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Can I buy with less than a 20% deposit?",
                  "How much can I borrow?",
                  "Can I use KiwiSaver?",
                  "Do I need pre-approval?",
                  "What happens if I find a property before approval?",
                  "What costs should I budget for?",
                  "Should I buy at auction?",
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

      {/* DOWNLOAD GUIDE CALLOUT */}
      <section className="py-16 bg-[#2E4882] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase mb-3">Free Resource</motion.p>
              <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold mb-2">Download the First Home Buyer Guide<span className="text-[#E8A23A]">.</span></motion.h2>
              <motion.p variants={fadeIn} className="text-[#C8CBE3] leading-relaxed max-w-xl">
                Covers the home-buying process, lending basics, common questions, and practical tips to help you prepare with confidence.
              </motion.p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex-shrink-0">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-8 py-4 rounded-sm font-bold transition-colors whitespace-nowrap">
                <Download className="w-5 h-5" /> Download Guide
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8-STEP ROADMAP */}
      <section className="py-24 bg-[#061634] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">The First Home Buyer Roadmap</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Eight steps from planning to keys<span className="text-[#E8A23A]">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { num: "01", title: "Understand Your Position", desc: "Review income, savings, KiwiSaver balance, expenses, and financial goals." },
              { num: "02", title: "Build Your Deposit", desc: "Understand your savings position and available deposit options." },
              { num: "03", title: "Estimate Borrowing Capacity", desc: "Gain an understanding of how much you may be able to borrow." },
              { num: "04", title: "Prepare Documents", desc: "Get your financial information ready before you start making offers." },
              { num: "05", title: "Find a Property", desc: "Begin your search with a realistic budget and clear strategy." },
              { num: "06", title: "Make an Offer", desc: "Submit an offer and complete any required due diligence." },
              { num: "07", title: "Finance Approval", desc: "Work through lender requirements and final approval conditions." },
              { num: "08", title: "Settlement & Moving In", desc: "Complete settlement and collect the keys to your new home." },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-[#2E4882] p-6 rounded-sm border-t-2 border-[#E8A23A]">
                <div className="text-3xl font-bold text-[#E8A23A]/30 mb-3 leading-none">{step.num}</div>
                <h3 className="font-bold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-[#C8CBE3] text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NO PRE-APPROVAL */}
      <section className="py-24 bg-white">
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">No Pre-Approval?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634] mb-6 leading-tight">
                You may still be able to buy<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed mb-4">
                Many first-home buyers believe they must obtain pre-approval before they can start looking at properties. In reality, this is not always possible.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed mb-4">
                For buyers with smaller deposits, lenders may sometimes prefer to assess a specific property rather than provide a general pre-approval. This means many low-deposit purchases begin as a <span className="font-semibold text-[#061634]">live deal</span> — where a signed Sale &amp; Purchase Agreement is submitted to the lender for assessment.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed mb-8">
                Speaking with a mortgage adviser early can still be extremely valuable. Even without pre-approval, you can understand your likely borrowing capacity, prepare your documents, identify suitable lenders, and be ready to move quickly when the right property becomes available.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/book" className="inline-flex items-center gap-2 bg-[#061634] hover:bg-[#2E4882] text-white px-7 py-3.5 rounded-sm font-bold text-sm transition-colors">
                  <Phone className="w-4 h-4" /> Talk to a Mortgage Adviser
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                { label: "Understand your likely borrowing capacity", check: true },
                { label: "Prepare documents in advance", check: true },
                { label: "Identify suitable lenders", check: true },
                { label: "Be ready to move quickly", check: true },
                { label: "Avoid unnecessary delays", check: true },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="flex items-center gap-3 bg-[#F6F7F9] p-5 rounded-lg border border-[#C9CED6]">
                  <CheckCircle2 className="w-5 h-5 text-[#E8A23A] flex-shrink-0" />
                  <span className="text-[#061634] font-medium text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DEPOSIT TIERS */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Understanding Your Deposit</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              Many buyers assume they need 20%<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#2E4882] mt-4 max-w-2xl leading-relaxed">
              Depending on your circumstances and lender criteria, smaller deposits may also be possible.
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
              { pct: "20%", title: "Standard Deposit", desc: "The traditional standard deposit used by many lenders. Most widely accepted and typically avoids low-equity conditions.", highlight: false },
              { pct: "10%", title: "Low-Deposit Option", desc: "Possible for many first-home buyers depending on lender requirements and eligibility.", highlight: true },
              { pct: "5%", title: "Minimum Deposit", desc: "Available in some situations, subject to lender criteria and eligibility. Additional conditions may apply.", highlight: false },
            ].map((tier, i) => (
              <motion.div key={i} variants={fadeIn} className={`p-8 rounded-lg border ${tier.highlight ? "bg-[#061634] text-white border-[#E8A23A]" : "bg-white border-[#C9CED6]"}`}>
                <div className={`text-5xl font-bold mb-4 ${tier.highlight ? "text-[#E8A23A]" : "text-[#061634]"}`}>{tier.pct}</div>
                <h3 className={`font-bold text-lg mb-3 ${tier.highlight ? "text-white" : "text-[#061634]"}`}>{tier.title}</h3>
                <p className={`text-sm leading-relaxed ${tier.highlight ? "text-[#C8CBE3]" : "text-[#2E4882]"}`}>{tier.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-[#2E4882] text-xs mt-6 italic"
          >
            Low-deposit lending may involve additional conditions, restrictions, or low-equity premiums.
          </motion.p>
        </div>
      </section>

      {/* HOW CAN YOU BUY */}
      <section className="py-24 bg-[#061634] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">How Can You Buy a Property?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Three ways properties are sold in New Zealand<span className="text-[#E8A23A]">.</span>
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
                title: "Buying Through Negotiation",
                desc: "The most common way to buy a home. You submit an offer to the vendor, usually with conditions such as:",
                items: ["Finance approval", "Building inspection", "Solicitor's approval"],
                note: "If your offer is accepted, you move forward through the Sale & Purchase process.",
              },
              {
                icon: Gavel,
                title: "Buying at Auction",
                desc: "Properties sold at auction are usually purchased unconditionally. Most due diligence should be completed before auction day, including:",
                items: ["Finance preparation", "Legal review", "Building inspection", "Valuation (if required)"],
                note: "If you are the successful bidder, you are committed to purchasing immediately.",
              },
              {
                icon: FileText,
                title: "Buying by Tender",
                desc: "Offers are submitted confidentially and buyers do not know what other parties are offering.",
                items: ["Confidential submission", "Vendor reviews all offers", "Conditions may be accepted"],
                note: "The vendor reviews all offers before making a decision.",
              },
            ].map((method, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-[#2E4882] p-8 rounded-sm border-t-2 border-[#E8A23A]">
                <method.icon className="w-6 h-6 text-[#E8A23A] mb-4" />
                <h3 className="font-bold text-lg mb-3">{method.title}</h3>
                <p className="text-[#C8CBE3] text-sm mb-4 leading-relaxed">{method.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {method.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#C8CBE3]">
                      <div className="w-1 h-1 rounded-full bg-[#E8A23A] flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[#8F93B5] text-xs italic leading-relaxed">{method.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BUILD YOUR TEAM */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Build Your Team Early</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              The right professionals make all the difference<span className="text-[#E8A23A]">.</span>
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
                icon: Users,
                title: "Mortgage Adviser",
                desc: "Helps you understand borrowing capacity, lending options, and deposit requirements, and guides you through the finance process.",
              },
              {
                icon: Scale,
                title: "Property Lawyer",
                desc: "Reviews legal documents, explains risks, assists with the Sale & Purchase Agreement, and manages settlement.",
              },
              {
                icon: Clipboard,
                title: "Building Inspector",
                desc: "Provides an independent assessment of the property's condition and helps identify potential issues before you commit. A good inspection can help you avoid unexpected costs.",
              },
            ].map((pro, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
                <div className="w-10 h-10 rounded-full bg-[#061634] flex items-center justify-center mb-5">
                  <pro.icon className="w-4 h-4 text-[#E8A23A]" />
                </div>
                <h3 className="font-bold text-[#061634] text-lg mb-3">{pro.title}</h3>
                <p className="text-[#2E4882] text-sm leading-relaxed">{pro.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY WORK WITH VALAR — comparison table */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Why Work With Valar?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              Beyond getting a loan approved<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#2E4882] mt-4 max-w-2xl leading-relaxed">
              Buying your first home is about understanding your options, preparing properly, and making confident financial decisions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 bg-[#C9CED6] text-[#061634] font-bold rounded-tl-lg">Working Directly With a Bank</th>
                  <th className="text-left py-4 px-6 bg-[#061634] text-white font-bold rounded-tr-lg">Working With Valar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["One lender", "Multiple lending options"],
                  ["One lending policy", "Strategy before application"],
                  ["Limited comparison", "Deposit planning guidance"],
                  ["Focus on approval", "KiwiSaver guidance"],
                  ["Less support with preparation", "Support with documents"],
                  ["Transaction-focused", "Guidance from planning to settlement"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F7F9]"}>
                    <td className="py-4 px-6 text-[#2E4882] text-sm border-b border-[#C9CED6]">{row[0]}</td>
                    <td className="py-4 px-6 text-[#061634] text-sm font-medium border-b border-[#C9CED6] bg-[#061634]/5">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E8A23A] flex-shrink-0" />
                        {row[1]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <FAQItem question="When should I speak with a mortgage adviser?" answer="As early as possible. Many clients speak with us months or even years before they buy. Early planning helps you understand your borrowing capacity, deposit requirements, and possible lending options." />
            <FAQItem question="How much deposit do I need?" answer="Many buyers assume they need a 20% deposit, but this is not always the case. Depending on your situation and lender criteria, smaller deposits may be possible." />
            <FAQItem question="Can I buy with a 5% deposit?" answer="In some situations, yes. Eligibility depends on lender requirements, income, deposit sources, and the property being purchased." />
            <FAQItem question="Can I use KiwiSaver?" answer="Eligible first-home buyers may be able to use KiwiSaver as part of their deposit." />
            <FAQItem question="How much can I borrow?" answer={["Your income", "Your expenses", "Existing debt", "Dependants", "Deposit size", "Lender criteria"]} />
            <FAQItem question="Do I need pre-approval before looking for a property?" answer="Not always. Some buyers obtain pre-approval first, while others proceed through a live deal where a specific property is assessed by the lender." />
            <FAQItem question="What is a live deal?" answer="A live deal means there is a specific property under contract and a signed Sale & Purchase Agreement has been submitted to the lender for assessment." />
            <FAQItem question="Why speak with an adviser without pre-approval?" answer="A mortgage adviser can help you understand your likely borrowing range, prepare documents, identify suitable lenders, and avoid unnecessary delays when you find a property." />
            <FAQItem
              question="What costs should I expect?"
              answer={[
                "Legal fees: approximately $1,500–$5,000+",
                "Building inspection: approximately $650–$1,000+",
                "Valuation: approximately $800–$1,300+ (if required)",
                "Moving costs",
                "Ongoing: rates, insurance, maintenance, utilities",
                "Note: some lenders may offer cashback around $5,000",
              ]}
            />
            <FAQItem question="Do I need to pay for mortgage advice?" answer="In most cases, no. Mortgage advisory services are generally paid by the lender after settlement." />
            <FAQItem question="How long should I allow for finance approval?" answer="For live deals, we commonly suggest allowing approximately 10–15 working days for finance approval conditions. We generally recommend allowing at least 10 working days, and preferably 15 working days, to allow enough time for lender assessment, legal review, valuation requirements, and inspections." />
            <FAQItem question="Can I buy at auction?" answer="Yes, but auctions can be challenging for first-home buyers because most due diligence must be completed before auction day and the purchase is usually unconditional." />
            <FAQItem question="Can my parents help me buy a home?" answer="Potentially, yes. Some buyers receive assistance through gifted deposits, guarantees, or other family support arrangements." />
            <FAQItem question="What happens if my application is declined?" answer="A decline from one lender does not necessarily mean home ownership is not possible. Different lenders have different lending criteria and alternative options may be available." />
            <FAQItem question="What should I do before attending open homes?" answer="Understand your deposit position, borrowing capacity, KiwiSaver options, likely costs, and speak with a mortgage adviser before you start making offers." />
          </motion.div>
        </div>
      </section>

      {/* NOT READY YET */}
      <section className="py-24 bg-[#2E4882] text-white">
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Not Ready to Buy Yet?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6">
                Many clients speak with us 6–24 months before buying<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#C8CBE3] leading-relaxed mb-8">
                Starting early often creates more options later. We can help you understand what you may need and how to get there.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/book" className="inline-flex items-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-7 py-3.5 rounded-sm font-bold text-sm transition-colors">
                  <Calendar className="w-4 h-4" /> Start Planning Early
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                "How much deposit you may need",
                "How much you may be able to borrow",
                "What steps may improve your position",
                "How to prepare for home ownership",
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="flex items-center gap-3 bg-[#061634]/30 border border-white/10 p-4 rounded-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#E8A23A] flex-shrink-0" />
                  <span className="text-[#C8CBE3] text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Ready to Take the First Step?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Whether you&apos;re buying next month or just exploring<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#C8CBE3] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              We&apos;re here to help you understand your options and take the next step with confidence.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] px-8 py-4 rounded-sm font-bold transition-colors">
                <Download className="w-5 h-5" /> Download Free Guide
              </Link>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
