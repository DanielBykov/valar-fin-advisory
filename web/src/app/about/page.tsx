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
      <section data-cmp="AboutPage.Hero" className="relative min-h-[80vh] flex items-end overflow-hidden bg-valar-navy">
        <div className="absolute inset-0 z-0">
          <Image src="/images/lena-portrait.png" alt="Lena Bykova" fill className="object-cover object-top opacity-40" />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/70 to-valar-navy/30" />
          <div className="absolute inset-0 bg-linear-to-t from-valar-navy/80 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 pb-20 pt-32 max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-5 space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">About Valar</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-5 leading-[1.05] max-w-3xl">
              Financial Advice Built Around Your Future<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-valar-lilac max-w-xl leading-relaxed border-l-2 border-valar-amber pl-4 font-light mb-10">
              Helping Kiwi people make smarter property and financial decisions with clarity.
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
            <motion.div variants={fadeIn} className="relative">
              <Image
                src="/images/lena-portrait.png"
                alt="Lena Bykova"
                width={600}
                height={800}
                className="w-full aspect-[3/4] object-cover object-top rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-valar-amber text-valar-navy font-bold text-sm px-4 py-2 rounded-sm shadow">
                20+ Years Finance Experience
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
                Mortgage Adviser · Financial Strategist · Finance Professional
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                I help people make confident property and financial decisions through mortgage advice, financial planning, and strategic thinking.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                I have always been focused on strategy, thinking ahead, and using financial resources wisely. I believe better financial decisions can create more freedom, stability, and opportunity for people and their families.
              </motion.p>
              <motion.div variants={stagger} className="flex flex-wrap gap-2">
                {["20+ Years Finance Experience", "New Zealand Based", "Level 5 Qualified", "FundSmart Adviser", "Property Investor"].map((badge, i) => (
                  <motion.span key={i} variants={fadeIn} className="bg-valar-fog border border-valar-concrete text-valar-navy text-xs font-semibold px-3 py-1.5 rounded-full">
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. BEYOND MORTGAGE APPROVAL ─────────────────────────── */}
      <section data-cmp="AboutPage.BeyondMortgage" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What I Help Clients Think Through</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-4">
              Beyond Mortgage Approval.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-indigo text-lg max-w-xl">
              A mortgage is not just a loan. It is often one of the biggest financial decisions in life.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              { icon: Compass, title: "Future Goals", desc: "What do you want your life to look like in 10–15 years?" },
              { icon: HomeIcon, title: "Property Strategy", desc: "How can this property support your long-term wealth?" },
              { icon: BarChart2, title: "Cashflow & Risk", desc: "How can we manage repayments, interest rate changes, and financial pressure?" },
              { icon: TrendingUp, title: "Investment Thinking", desc: "How can property become part of your wider financial plan?" },
              { icon: Briefcase, title: "Business & Personal Finance", desc: "How do your business decisions and personal property goals work together?" },
              { icon: Target, title: "Clear Starting Point", desc: "What is the smartest first step from where you are today?" },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.BeyondMortgage.Card" className="bg-white p-7 rounded-lg border border-valar-concrete shadow-sm">
                <div className="w-10 h-10 rounded-full bg-valar-navy flex items-center justify-center mb-4">
                  <card.icon className="w-4 h-4 text-valar-amber" />
                </div>
                <h3 className="font-bold text-valar-navy mb-2">{card.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. THE VALAR FORMULA ────────────────────────────────── */}
      <section data-cmp="AboutPage.ValarFormula" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14 text-center"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">The Valar Formula</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-3">
              Wealth is not built from money alone.
            </motion.h2>
          </motion.div>

          {/* Formula bar */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-3 mb-14 text-center"
          >
            {["Clarity", "Strategy", "Discipline", "Time"].map((word, i, arr) => (
              <span key={i} className="flex items-center gap-3">
                <span className="bg-valar-indigo border border-valar-amber/30 text-white font-bold text-lg px-6 py-3 rounded-sm">{word}</span>
                {i < arr.length - 1 && <span className="text-valar-amber text-2xl font-light">+</span>}
              </span>
            ))}
            <span className="text-valar-amber text-2xl font-light mx-1">=</span>
            <span className="bg-valar-amber text-valar-navy font-bold text-lg px-6 py-3 rounded-sm">Financial Freedom</span>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          >
            {[
              { word: "Clarity", desc: "Know where you are going and why." },
              { word: "Strategy", desc: "Make decisions that connect today with your future goals." },
              { word: "Discipline", desc: "Turn good intentions into consistent action." },
              { word: "Time", desc: "Use compounding, planning, and patience to your advantage." },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.ValarFormula.Pillar" className="bg-valar-indigo p-6 rounded-sm border-t-2 border-valar-amber">
                <h3 className="font-bold text-valar-amber mb-3">{card.word}</h3>
                <p className="text-valar-lilac text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="border-l-2 border-valar-amber pl-6 max-w-2xl mx-auto"
          >
            <p className="text-valar-lilac leading-relaxed">
              At Valar, mortgage advice is only one part of the bigger picture. The goal is to help you create structure, confidence, and long-term financial direction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 5. REAL EXPERIENCE ──────────────────────────────────── */}
      <section data-cmp="AboutPage.RealExperience" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={stagger}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Real Experience, Not Just Theory</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                I Build Wealth Differently Too.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                My approach is both analytical and practical.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Sometimes that means spending hours in Excel, comparing scenarios, modelling cashflow, and analysing investment opportunities.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Other times, it means rolling up my sleeves and working on a property project myself.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-4">
                Together with my husband, we live on and continue to develop a lifestyle property near Auckland. We manage our own mortgage commitments, invest in property, and make many of the same long-term financial decisions that I discuss with my clients.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-navy font-semibold leading-relaxed">
                This gives me both professional knowledge and real-world experience.
              </motion.p>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <Image
                src="/images/wealth-hero.png"
                alt="Lifestyle property near Auckland"
                width={800}
                height={600}
                className="w-full aspect-[4/3] object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-valar-navy text-white text-xs font-semibold px-4 py-2 rounded-sm shadow border-l-2 border-valar-amber">
                Lifestyle property near Auckland
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. EXPERIENCE SNAPSHOT ──────────────────────────────── */}
      <section data-cmp="AboutPage.ExperienceSnapshot" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Experience Snapshot</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Experience You Can Trust.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          >
            {[
              { icon: Clock, label: "20+ Years in Finance" },
              { icon: HomeIcon, label: "Mortgage Advice" },
              { icon: DollarSign, label: "Business Valuation" },
              { icon: Layers, label: "Corporate Finance" },
              { icon: TrendingUp, label: "Investment Analysis" },
              { icon: BarChart2, label: "Financial Modelling" },
              { icon: HomeIcon, label: "Property Investment" },
              { icon: Compass, label: "Strategic Planning" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.ExperienceSnapshot.Badge" className="bg-white p-5 rounded-lg border border-valar-concrete shadow-sm flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-valar-navy flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-valar-amber" />
                </div>
                <span className="text-valar-navy text-sm font-semibold leading-snug">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="text-valar-indigo text-sm leading-relaxed border-l-2 border-valar-amber pl-4 max-w-2xl"
          >
            My background allows me to look beyond interest rates and loan approval, and help clients understand the bigger financial picture.
          </motion.p>
        </div>
      </section>

      {/* ── 7. HOW VALAR IS DIFFERENT ───────────────────────────── */}
      <section data-cmp="AboutPage.HowValarsIsDifferent" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How Valar Is Different</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              A Different Kind of Mortgage Adviser.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeIn} data-cmp="AboutPage.HowValarIsDifferent.ComparePanel" className="bg-valar-indigo/50 border border-white/10 p-8 rounded-lg">
              <h3 className="font-bold text-valar-steel mb-6 uppercase tracking-wider text-sm">Typical Mortgage Advice</h3>
              <ul className="space-y-4">
                {[
                  "Focuses on loan approval",
                  "Transaction-based",
                  "Often ends after settlement",
                  "Limited long-term planning",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-valar-steel text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-steel/50 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeIn} data-cmp="AboutPage.HowValarIsDifferent.ComparePanel" className="bg-valar-indigo border border-valar-amber/30 p-8 rounded-lg">
              <h3 className="font-bold text-valar-amber mb-6 uppercase tracking-wider text-sm">The Valar Approach</h3>
              <ul className="space-y-4">
                {[
                  "Mortgage advice + financial planning",
                  "Long-term property strategy",
                  "Wealth-building perspective",
                  "Practical education",
                  "Ongoing support",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. QUALIFICATIONS ───────────────────────────────────── */}
      <section data-cmp="AboutPage.Qualifications" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Qualifications</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Qualifications &amp; Professional Development.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              "NZ Certificate in Financial Services Level 5 – Residential Property Lending",
              "Mortgage Adviser",
              "Investment Advisory Studies",
              "Master's Degree in Finance and Accounting",
              "Business Valuation & Corporate Finance Experience",
              "CFA Program Candidate",
              "Ongoing Professional Development",
            ].map((qual, i) => (
              <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.Qualifications.Item" className="flex items-start gap-3 bg-valar-fog border border-valar-concrete p-5 rounded-lg">
                <Award className="w-4 h-4 text-valar-amber flex-shrink-0 mt-0.5" />
                <span className="text-valar-navy text-sm font-medium leading-snug">{qual}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 9. PROCESS ──────────────────────────────────────────── */}
      <section data-cmp="AboutPage.Process" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How We Work</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              Our Process.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="relative"
          >
            {/* Vertical connector line */}
            <div className="hidden md:block absolute left-[28px] top-8 bottom-8 w-px bg-valar-concrete" />
            <div className="space-y-6">
              {[
                { num: "01", title: "Discovery Call", desc: "We discuss your goals, situation, and next financial step." },
                { num: "02", title: "Financial Review", desc: "We review your income, expenses, lending position, and opportunities." },
                { num: "03", title: "Strategy", desc: "We create a personalised plan based on your goals and financial position." },
                { num: "04", title: "Implementation", desc: "We work with lenders and guide you through the process." },
                { num: "05", title: "Ongoing Support", desc: "We stay connected as your life, property goals, and financial needs evolve." },
              ].map((step, i) => (
                <motion.div key={i} variants={fadeIn} data-cmp="AboutPage.Process.Step" className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-valar-navy text-valar-amber font-bold text-sm flex items-center justify-center flex-shrink-0 border-2 border-valar-amber relative z-10">
                    {step.num}
                  </div>
                  <div className="bg-white border border-valar-concrete rounded-lg p-6 flex-1 shadow-sm">
                    <h3 className="font-bold text-valar-navy mb-1">{step.title}</h3>
                    <p className="text-valar-indigo text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 10. PERSONAL NOTE ───────────────────────────────────── */}
      <section data-cmp="AboutPage.PersonalNote" className="py-24 bg-valar-indigo text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={stagger}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Beyond Finance</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6">
                Beyond Finance.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-lilac leading-relaxed mb-4">
                Outside of work, I enjoy life with my husband on our lifestyle property near Auckland and the ocean. I love investments, numbers, AI, technology, strategy, and building systems that help people make better decisions.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-lilac leading-relaxed">
                Valar brings these interests together: finance, property, technology, and a genuine desire to help people build a better life.
              </motion.p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-2 gap-3">
              {[
                { icon: HomeIcon, label: "Lifestyle property" },
                { icon: TrendingUp, label: "Investments" },
                { icon: Cpu, label: "AI & technology" },
                { icon: Layers, label: "Financial strategy" },
                { icon: Zap, label: "New Zealand living" },
                { icon: Target, label: "Long-term freedom" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-valar-navy/30 border border-white/10 p-4 rounded-sm flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-valar-amber flex-shrink-0" />
                  <span className="text-valar-lilac text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. LICENSING ───────────────────────────────────────── */}
      <section data-cmp="AboutPage.Licensing" className="py-16 bg-valar-navy border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Licensing &amp; Disclosure</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-xl font-bold text-white mb-5">
              Licensing &amp; Disclosure.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-steel text-sm leading-relaxed mb-4 max-w-2xl">
              Lena Bykova trades as Valar Financial Advisors. Mortgage advice is provided through FundSmart Mortgages and Finance, a licensed Financial Advice Provider.
            </motion.p>
            <motion.div variants={stagger} className="flex flex-wrap gap-4 mb-6">
              {[
                { label: "Disclosure Statement", href: "/disclosure" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Complaints Process", href: "/about/complaints" },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Link href={link.href} className="inline-flex items-center gap-1.5 text-valar-lilac hover:text-valar-amber text-sm transition-colors">
                    <FileText className="w-3.5 h-3.5" /> {link.label} <ExternalLink className="w-3 h-3 opacity-50" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeIn} className="bg-valar-indigo/40 border border-white/10 rounded-sm p-4 max-w-2xl">
              <p className="text-valar-steel text-xs leading-relaxed">
                <span className="text-valar-amber font-semibold">Note:</span> This section must be reviewed and approved by FundSmart before launch.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 12. FINAL CTA ───────────────────────────────────────── */}
      <section data-cmp="AboutPage.FinalCta" className="py-24 bg-valar-navy text-white text-center border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Take the First Step</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Make Your Next Financial Step With Clarity?
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

    </div>
  );
}
