"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  CheckCircle2,
  TrendingUp,
  Home as HomeIcon,
  BarChart2,
  DollarSign,
  Briefcase,
  Compass,
  Award,
  Clock,
  FileText,
  Cpu,
  Target,
  Zap,
  Layers,
  ExternalLink,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div data-cmp="AboutPage" className="w-full flex flex-col font-sans">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section data-cmp="AboutPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/about-hero.png" alt="NZ lighthouse at sunrise" fill priority unoptimized className="object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20 max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">About Valar</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
              Navigate the Bigger Picture<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              Helping you move forward with confidence.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Strategy Call
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. INTRODUCTION ─────────────────────────────────────── */}
      <section data-cmp="AboutPage.Introduction" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeIn} className="relative max-w-md mx-auto">
              <Image
                src="/images/lena-intro.png"
                alt="Lena Bykova"
                width={600}
                height={800}
                className="w-full aspect-[3/4] object-cover object-top rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-valar-amber text-valar-navy font-bold text-sm px-4 py-2 rounded-sm shadow">
                Bringing Clarity to Complex Decisions
              </div>
            </motion.div>

            <motion.div variants={stagger}>
              <motion.div variants={fadeIn} className="mb-3">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Meet Lena</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-2">
                Hi, I&apos;m Lena.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo font-medium text-sm mb-6">
                Mortgage Adviser · Financial Professional · Investor
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                For more than 20 years, I have worked across finance, accounting, investment analysis, and advisory. Throughout my career, I have helped businesses, investors, and families navigate important financial decisions and understand their long-term impact.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Today I bring that experience to mortgage advice, financial planning and wealth-building conversations through Valar Financial Advisors.
              </motion.p>
              <motion.div variants={stagger} className="space-y-3">
                {[
                  "20+ Years of Financial Analysis & Decision-Making",
                  "Property Investor",
                  "AI-Powered Financial Analysis",
                  "Long-Term Wealth Thinking",
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeIn} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                    <span className="text-valar-navy text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. BEYOND MORTGAGE APPROVAL ─────────────────────────── */}
      <section data-cmp="AboutPage.BeyondMortgage" className="py-16 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-6"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What I Help Clients Think Through</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-4">
              Beyond Mortgage Approval.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo text-lg max-w-xl">
              A mortgage is not just a loan.<br />It is often one of the biggest financial decisions in life.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="divide-y divide-valar-concrete"
          >
            {[
              { title: "Future Goals", desc: "What do you want your life to look like in 10–15 years?" },
              { title: "Property Strategy", desc: "How can this property support your long-term wealth?" },
              { title: "Cashflow & Risk", desc: "How can we manage repayments, interest rate changes, and financial pressure?" },
              { title: "Investment Thinking", desc: "How can property become part of your wider financial plan?" },
              { title: "Business & Personal Finance", desc: "How do your business decisions and personal property goals work together?" },
              { title: "Clear Starting Point", desc: "What is the smartest first step from where you are today?" },
            ].map((row, i) => (
              <motion.div key={i} variants={fadeIn} className="grid grid-cols-[200px_1fr] gap-8 py-3 items-start">
                <span className="text-valar-navy font-semibold text-sm">{row.title}</span>
                <span className="text-valar-indigo text-sm leading-relaxed">{row.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. REAL EXPERIENCE + SNAPSHOT ───────────────────────── */}
      <section data-cmp="AboutPage.RealExperience" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16"
          >
            <motion.div variants={stagger}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Real Experience, Not Just Theory</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                A Combination of Analysis and Action.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Sometimes that means spending hours modelling scenarios, analysing cashflow, and exploring different financial outcomes. Other times, it means taking on a property project and doing the work myself.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Together with my husband, I live on and continue to develop a lifestyle property near Auckland. We manage our own mortgages, invest in property, and navigate many of the same financial decisions that my clients face.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed">
                Over the years, I have come to believe that wealth is about more than money alone. The decisions we make today shape our future. Freedom. That belief eventually became the foundation of what I now call the Valar formula.
              </motion.p>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <Image
                src="/images/lena-waterfront.jpg"
                alt="Lena Bykova, Auckland waterfront"
                width={800}
                height={1000}
                className="w-full aspect-[4/5] object-cover object-top rounded-lg shadow-xl"
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── THE VALAR FORMULA ───────────────────────────────────── */}
      <section data-cmp="AboutPage.ValarFormula" className="py-14 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-8 text-center"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">The Valar Formula</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-8">
              Wealth is not built from money alone.
            </motion.h2>
          </motion.div>

          {/* Formula bar */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-3 mb-14 text-center"
          >
            {["Capital", "Clarity", "Discipline", "Time"].map((word, i, arr) => (
              <span key={i} className="flex items-center gap-3">
                <span className="bg-valar-indigo border border-valar-amber/30 text-white font-bold text-xl px-8 py-4 rounded-sm">{word}</span>
                {i < arr.length - 1 && <span className="text-valar-amber text-3xl font-light">×</span>}
              </span>
            ))}
            <span className="text-valar-amber text-3xl font-light mx-1">=</span>
            <span className="bg-valar-amber text-valar-navy font-bold text-xl px-8 py-4 rounded-sm">Financial Freedom</span>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          >
            {[
              { word: "Capital", desc: "Use every resource available to you, not just money." },
              { word: "Clarity", desc: "Know where you are going and why." },
              { word: "Discipline", desc: "Turn good intentions into consistent action." },
              { word: "Time", desc: "Use compounding and patience to your advantage." },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.ValarFormula.Pillar" className="bg-valar-fog p-6 rounded-sm border-t-2 border-valar-amber">
                <h3 className="font-bold text-valar-navy mb-3">{card.word}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="border-l-2 border-valar-amber pl-6 max-w-2xl mx-auto"
          >
            <p className="text-valar-lilac leading-relaxed">
              Most people focus on the next decision. We believe better outcomes come from understanding where that decision fits within the bigger picture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. QUALIFICATIONS ───────────────────────────────────── */}
      <section data-cmp="AboutPage.Qualifications" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-8"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-4">
              Behind the Advice.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo text-sm">
              A combination of education, practical experience, and continuous learning shapes the perspective I bring to clients.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-valar-fog border border-valar-concrete rounded-lg p-8">
              <h3 className="font-bold text-valar-navy mb-5 text-sm uppercase tracking-wider">Qualifications &amp; Credentials</h3>
              <ul className="space-y-3">
                {[
                  "Master's Degree in Finance & Accounting",
                  "Graduate Diploma (Level 7) in Information Technology, Business Intelligence & Generative AI",
                  "NZ Certificate in Financial Services (Level 5) – Residential Property Lending",
                  "NZ Certificate in Financial Services (Level 5) – Investment",
                  "Licensed Financial Adviser (FSP1010055)",
                  "CFA Program Candidate",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    <span className="text-valar-indigo text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-valar-fog border border-valar-concrete rounded-lg p-8">
              <h3 className="font-bold text-valar-navy mb-5 text-sm uppercase tracking-wider">Professional Focus</h3>
              <ul className="space-y-3">
                {[
                  "Mortgage Advice",
                  "Financial Planning",
                  "Investment Analysis",
                  "Cash Flow & Financial Modelling",
                  "Property Investment",
                  "Business Performance & Growth",
                  "AI-Powered Research & Analysis",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    <span className="text-valar-indigo text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 12. FINAL CTA ───────────────────────────────────────── */}
      <section data-cmp="AboutPage.FinalCta" className="py-24 bg-valar-navy text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Take the First Step</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Make Your Next Financial Step With Clarity<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-lilac text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you are buying your first home, refinancing, investing in property, or planning your future, Valar can help you build a strategy around your goals.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Strategy Call
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold transition-colors">
                <Phone className="w-5 h-5" /> Contact Valar
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. LICENSING ───────────────────────────────────────── */}
      <section data-cmp="AboutPage.Licensing" className="py-16 bg-white border-t border-valar-concrete">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeIn} className="text-xl font-bold text-valar-navy mb-5">
              Licensing &amp; Disclosure.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo text-sm leading-relaxed mb-4 max-w-2xl">
              Lena Bykova trades as Valar Financial Advisors.<br />Mortgage advice is provided through Fundsmart Limited, licensed Financial Advice Provider (FSP1008314).
            </motion.p>
            <motion.div variants={stagger} className="flex flex-wrap gap-4 mb-6">
              {[
                { label: "Disclosure Statement", href: "/disclosure" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Disclosure and Nature of Advice", href: "/about/complaints" },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Link href={link.href} className="inline-flex items-center gap-1.5 text-valar-indigo hover:text-valar-amber text-sm transition-colors">
                    <FileText className="w-3.5 h-3.5" /> {link.label} <ExternalLink className="w-3 h-3 opacity-50" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
