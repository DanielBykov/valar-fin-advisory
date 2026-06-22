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
import { GuideDownloadModal } from "@/components/guide-download-modal";

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
        <span className="font-semibold text-valar-navy text-sm md:text-base">{question}</span>
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
              <ul className="pb-5 space-y-1.5">
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

const FIRST_HOME_GUIDE = {
  key: "first-home-buyer-guide",
  title: "First Home Buyer Guide",
  description: "A practical roadmap with clear steps you can work through, tick off, and make your own.",
};

export default function FirstHomeBuyersContent() {
  const [guideOpen, setGuideOpen] = useState(false);
  return (
    <div data-cmp="FirstHomeBuyersPage" className="w-full flex flex-col font-sans">
      <GuideDownloadModal open={guideOpen} onClose={() => setGuideOpen(false)} guide={FIRST_HOME_GUIDE} />

      {/* HERO */}
      <section data-cmp="FirstHomeBuyersPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/first-home-hero.png"
            alt="First Home Buyers"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">First Home Buyers</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Your First Home Starts Here<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              From questions and confusion to a clear plan and confident first step.
            </motion.p>
            <motion.div data-cmp="FirstHomeBuyersPage.Hero.Cta" variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setGuideOpen(true)} className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Download className="w-5 h-5" /> Download Free Guide
              </button>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CAN FEEL OVERWHELMING */}
      <section data-cmp="FirstHomeBuyersPage.Overwhelming" className="py-24 bg-valar-fog">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Buying Your First Home</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                Do you have questions?<br />You are not alone<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Buying your first home can feel overwhelming. Deposits, KiwiSaver, bank requirements, and property searches often raise more questions than answers.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                There are usually more options available than people realise. Understanding them early can help you make confident decisions and avoid costly mistakes.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Common questions we answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Can I buy with less than a 20% deposit?",
                  "How much can I borrow? Can I use KiwiSaver?",
                  "Do I need pre-approval? Can I buy at auction?",
                  "What happens if I find a property before approval?",
                  "What costs should I budget for?",
                ].map((q, i) => (
                  <motion.li data-cmp="FirstHomeBuyersPage.Overwhelming.QuestionItem" key={i} variants={fadeIn} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-valar-concrete shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    <span className="text-valar-navy text-sm leading-relaxed">{q}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DOWNLOAD GUIDE CALLOUT */}
      <section data-cmp="FirstHomeBuyersPage.DownloadGuide" className="relative py-24 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/first-home-guide-bg.png" alt="" fill unoptimized className="object-cover object-center" />
          <div className="absolute inset-0 bg-valar-navy/25" />
        </div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-3">Free Resource</motion.p>
              <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold mb-2">Download the First Home Buyer Guide.</motion.h2>
              <motion.p variants={fadeIn} className="text-white/70 leading-relaxed max-w-xl">
                Covers the home-buying process, lending basics, common questions, and practical tips to help you prepare with confidence.
              </motion.p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex-shrink-0">
              <button onClick={() => setGuideOpen(true)} className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors whitespace-nowrap">
                <Download className="w-5 h-5" /> Download Guide
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PERSONAL CHECKLIST */}
      <section data-cmp="FirstHomeBuyersPage.Checklist" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-3">Inside the Guide</motion.p>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-4 leading-tight">
                Your personal roadmap<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-6">
                The guide includes a step-by-step checklist you can work through at your own pace — on paper or as a PDF. Each question helps you see exactly where you are in the process and what comes next.
              </motion.p>
              <motion.button
                variants={fadeIn}
                onClick={() => setGuideOpen(true)}
                className="inline-flex items-center gap-2 bg-valar-navy hover:bg-valar-indigo text-white px-6 py-3 rounded-sm font-bold transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Get your copy
              </motion.button>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-3">
              {[
                "Do you know your borrowing capacity?",
                "Have you compared at least three lenders?",
                "Have you arranged a KiwiSaver withdrawal assessment?",
                "Is your deposit verified and ready to move?",
              ].map((q, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="flex items-start gap-4 bg-valar-fog rounded-lg px-5 py-4 border border-valar-concrete"
                >
                  <div className="w-5 h-5 rounded border-2 border-valar-concrete flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-valar-navy leading-relaxed">{q}</span>
                </motion.div>
              ))}
              <motion.p variants={fadeIn} className="text-xs text-valar-indigo/50 pl-1 pt-1">
                + more inside the guide
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8-STEP ROADMAP */}
      <section data-cmp="FirstHomeBuyersPage.Roadmap" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">The First Home Buyer Roadmap</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Eight steps from planning to keys<span className="text-valar-amber">.</span>
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
              { num: "1", title: "Understand Your Position", desc: "Review income, savings, KiwiSaver, expenses and financial goals." },
              { num: "2", title: "Build Your Deposit", desc: "Understand your savings position and available deposit options." },
              { num: "3", title: "Borrowing Capacity", desc: "Gain an understanding of how much you may be able to borrow." },
              { num: "4", title: "Prepare Documents", desc: "Get your financials ready before you start making offers." },
              { num: "5", title: "Find a Property", desc: "Begin your search with a realistic budget and clear strategy." },
              { num: "6", title: "Make an Offer", desc: "Submit an offer and complete any required due diligence." },
              { num: "7", title: "Finance Approval", desc: "Walk through lender requirements and approval conditions." },
              { num: "8", title: "Settlement & Moving In", desc: "Complete settlement and collect the keys to your new home." },
            ].map((step, i) => (
              <motion.div data-cmp="FirstHomeBuyersPage.Roadmap.Step" key={i} variants={fadeIn} className="bg-white p-6 rounded-sm border border-valar-concrete">
                <div className="text-2xl font-bold text-valar-steel mb-3">{step.num}</div>
                <h3 className="font-bold text-valar-navy text-sm mb-2">{step.title}</h3>
                <p className="text-valar-indigo text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NO PRE-APPROVAL */}
      <section data-cmp="FirstHomeBuyersPage.NoPreApproval" className="py-24 bg-white">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">No Pre-Approval?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                You are still able to buy<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Many first-home buyers think they need pre-approval before they can start looking at properties. In reality, some purchases begin as a <span className="font-semibold text-valar-navy">live deal</span>, where a specific property is assessed by the lender before formal approval is issued.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Speaking with a mortgage adviser early can help you understand your options, prepare your documents, and be ready when the right property becomes available.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/book" className="inline-flex items-center gap-2 bg-valar-navy hover:bg-valar-indigo text-white px-7 py-3.5 rounded-sm font-bold text-sm transition-colors">
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
                <motion.div data-cmp="FirstHomeBuyersPage.NoPreApproval.CheckItem" key={i} variants={fadeIn} className="flex items-center gap-3 bg-valar-fog p-5 rounded-lg border border-valar-concrete">
                  <CheckCircle2 className="w-5 h-5 text-valar-amber flex-shrink-0" />
                  <span className="text-valar-navy font-medium text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DEPOSIT TIERS */}
      <section data-cmp="FirstHomeBuyersPage.DepositTiers" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Understanding Your Deposit</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Many buyers assume they need 20%<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo mt-4 max-w-2xl leading-relaxed">
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
              { pct: "20%", title: "Standard Deposit", desc: "The standard deposit. Widely accepted and avoids low-equity conditions.", highlight: false },
              { pct: "10%", title: "Low-Deposit Option", desc: "Common entry point for first-home buyers. Accepted by most lenders.", highlight: true },
              { pct: "5%", title: "Minimum Deposit", desc: "Available in some situations. Additional conditions apply.", highlight: false },
            ].map((tier, i) => (
              <motion.div data-cmp="FirstHomeBuyersPage.DepositTiers.Tier" key={i} variants={fadeIn} className={`p-8 rounded-lg border ${tier.highlight ? "bg-valar-navy text-white border-valar-amber" : "bg-white border-valar-concrete"}`}>
                <div className={`text-5xl font-bold mb-4 ${tier.highlight ? "text-valar-amber" : "text-valar-navy"}`}>{tier.pct}</div>
                <h3 className={`font-bold text-lg mb-3 ${tier.highlight ? "text-white" : "text-valar-navy"}`}>{tier.title}</h3>
                <p className={`text-sm leading-relaxed ${tier.highlight ? "text-valar-lilac" : "text-valar-indigo"}`}>{tier.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-valar-indigo text-xs mt-6 italic"
          >
            Low-deposit lending may involve additional conditions, restrictions, or low-equity premiums.
          </motion.p>
        </div>
      </section>

      {/* HOW CAN YOU BUY */}
      <section data-cmp="FirstHomeBuyersPage.HowToBuy" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How Can You Buy a Property?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Three major ways properties are sold in New Zealand<span className="text-valar-amber">.</span>
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
                title: "Negotiation",
                desc: "Submit a conditional offer to the vendor.",
                items: ["Finance approval", "Building inspection", "Solicitor review"],
                note: "If your offer is accepted, you move forward through the Sale & Purchase process.",
              },
              {
                icon: Gavel,
                title: "Auction",
                desc: "Purchased unconditionally on the day. Prepare in advance:",
                items: ["Finance preparation", "Legal review", "Building inspection"],
                note: "If you are the successful bidder, you are committed to purchasing immediately.",
              },
              {
                icon: FileText,
                title: "Tender",
                desc: "Submit a confidential offer — the vendor decides.",
                items: ["Confidential offer", "Vendor reviews all bids", "Conditions may apply"],
                note: "The vendor reviews all offers before making a decision.",
              },
            ].map((method, i) => (
              <motion.div data-cmp="FirstHomeBuyersPage.HowToBuy.MethodCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-sm border-t-2 border-valar-amber">
                <method.icon className="w-6 h-6 text-valar-amber mb-4" />
                <h3 className="font-bold text-valar-navy text-lg mb-3">{method.title}</h3>
                <p className="text-valar-indigo text-sm mb-4 leading-relaxed">{method.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {method.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-valar-indigo">
                      <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-valar-indigo text-xs italic leading-relaxed">{method.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BUILD YOUR TEAM */}
      <section data-cmp="FirstHomeBuyersPage.BuildYourTeam" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Build Your Team Early</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Three professionals every first-home buyer needs<span className="text-valar-amber">.</span>
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
                desc: "Helps you understand borrowing capacity, lending options, deposit requirements and the finance process.",
              },
              {
                icon: Scale,
                title: "Property Lawyer",
                desc: "Reviews legal documents, explains risks, and manages the Sale & Purchase Agreement and settlement.",
              },
              {
                icon: Clipboard,
                title: "Building Inspector",
                desc: "Provides an independent assessment of the property's condition before you commit.",
              },
            ].map((pro, i) => (
              <motion.div data-cmp="FirstHomeBuyersPage.BuildYourTeam.ProCard" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-lg border border-valar-concrete">
                <pro.icon className="w-8 h-8 text-valar-amber mb-5" />
                <h3 className="font-bold text-valar-navy text-lg mb-3">{pro.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{pro.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY WORK WITH VALAR — comparison table */}
      <section data-cmp="FirstHomeBuyersPage.WhyValar" className="pt-24 pb-12 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Work With Valar?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Beyond getting a loan approved<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo mt-4 max-w-2xl leading-relaxed">
              A mortgage is more than a loan.<br />We walk with you on the whole financial picture — and how this decision shapes your future.
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
                  <th className="text-left py-4 px-6 bg-valar-concrete text-valar-navy font-bold rounded-tl-lg">Working Directly With a Bank</th>
                  <th className="text-left py-4 px-6 bg-valar-navy text-white font-bold rounded-tr-lg">Working With Valar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["One lender", "Multiple lender options"],
                  ["One lending policy", "Strategy before application"],
                  ["Focus on loan approval", "Focus on your full financial picture"],
                  ["Less guidance on deposit options", "Deposit and KiwiSaver planning"],
                  ["You manage the process", "Support from planning to settlement"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-valar-fog"}>
                    <td className="py-4 px-6 text-valar-indigo text-sm border-b border-valar-concrete">{row[0]}</td>
                    <td className="py-4 px-6 text-valar-navy text-sm font-medium border-b border-valar-concrete bg-valar-navy/5">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-valar-amber flex-shrink-0" />
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
      <section data-cmp="FirstHomeBuyersPage.Faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-6"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Frequently Asked Questions</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Common questions<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div>
              <FAQItem question="When should I speak with a mortgage adviser?" answer="As early as possible. Many clients speak with us months or even years before they buy. Early planning helps you understand your borrowing capacity, deposit requirements, and possible lending options." />
              <FAQItem question="How much deposit do I need?" answer="Many buyers assume they need a 20% deposit, but this is not always the case. Depending on your situation and lender criteria, smaller deposits may be possible." />
              <FAQItem question="Can I buy with a 5% deposit?" answer="In some situations, yes. Eligibility depends on lender requirements, income, deposit sources, and the property being purchased." />
              <FAQItem question="Can I use KiwiSaver?" answer="Eligible first-home buyers may be able to use KiwiSaver as part of their deposit." />
              <FAQItem question="How much can I borrow?" answer={["Your income", "Your expenses", "Existing debt", "Dependants", "Deposit size", "Lender criteria"]} />
              <FAQItem question="Do I need pre-approval before looking for a property?" answer="Not always. Some buyers obtain pre-approval first, while others proceed through a live deal where a specific property is assessed by the lender." />
              <FAQItem question="What is a live deal?" answer="A live deal means there is a specific property under contract and a signed Sale & Purchase Agreement has been submitted to the lender for assessment." />
            </div>
            <div>
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* NOT READY YET */}
      <section data-cmp="FirstHomeBuyersPage.NotReadyYet" className="py-24 bg-valar-indigo text-white">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Not Ready to Buy Yet?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold mb-6">
                Many clients speak with us 6–12 months before buying<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-lilac leading-relaxed mb-8">
                Starting early often creates more options later. We can help you understand what you may need and how to get there.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/book" className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-7 py-3.5 rounded-sm font-bold text-sm transition-colors">
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
                <motion.div data-cmp="FirstHomeBuyersPage.NotReadyYet.CheckItem" key={i} variants={fadeIn} className="flex items-center gap-3 bg-valar-navy/30 border border-white/10 p-4 rounded-sm">
                  <CheckCircle2 className="w-4 h-4 text-valar-amber flex-shrink-0" />
                  <span className="text-valar-lilac text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="FirstHomeBuyersPage.FinalCta" className="pt-12 pb-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeIn}>
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Take the First Step?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-valar-navy mt-4 mb-6">
                Start with a clear conversation<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-valar-indigo text-lg leading-relaxed mb-8">
                Whether you are planning to buy next month or just starting to explore your options — we are here to help.
              </p>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
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
