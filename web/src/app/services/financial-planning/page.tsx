"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Target,
  TrendingUp,
  BarChart2,
  Users,
  Home as HomeIcon,
  Briefcase,
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
  { q: "Is financial planning separate from mortgage advice?", a: "For mortgage advisory clients, foundational financial planning is included in the first session. If you need to go further — a detailed, specific plan with a clear roadmap — that is a separate service." },
  { q: "Do I need a large income or investments?", a: "No. Financial planning can be valuable regardless of your income level. The purpose is to help you make better decisions with the resources you have today." },
  { q: "How many coaching sessions do I need?", a: "Some clients benefit from a single strategy session, while others prefer ongoing support and accountability through regular reviews. We tailor the approach to your situation and goals." },
  { q: "Can financial planning help me prepare to buy a home?", a: "Yes — many clients start planning before buying a property to clarify borrowing capacity, deposit goals, and future affordability." },
  { q: "How much does financial planning cost?", a: "For mortgage advisory clients, financial planning is included in the foundation session. For other clients, coaching is $250 NZD per hour. If you book multiple sessions in advance, a discount applies." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-valar-concrete last:border-none">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-6 flex items-start justify-between gap-4 group">
        <span className="font-semibold text-valar-navy text-lg leading-snug group-hover:text-valar-amber transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-valar-amber flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-6 text-valar-indigo leading-relaxed text-[15px] max-w-3xl">{a}</p>}
    </div>
  );
}

export default function FinancialPlanningPage() {
  return (
    <div data-cmp="FinancialPlanningPage" className="w-full flex flex-col font-sans">
      {/* HERO */}
      <section data-cmp="FinancialPlanningPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/financial-planning-hero.png"
            alt="Couple planning their financial future on the New Zealand coast"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/80 via-valar-navy/25 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Foundations</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Financial Planning Around Your Goals<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              Clear financial direction for where you are today and where you want to be.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY FINANCIAL PLANNING MATTERS */}
      <section data-cmp="FinancialPlanningPage.WhyFinancialPlanning" className="pt-24 pb-12 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.div variants={staggerContainer}>
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Why Financial Planning Matters</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                A clear picture of how everything connects<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-8">
                Most people make financial decisions one at a time. We help you see how everything connects.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {["Where your money goes", "How decisions affect future opportunities", "What goals are realistically achievable", "How to balance property, savings, and investments", "How to build long-term financial confidence"].map((item, i) => (
                  <motion.li key={i} variants={fadeIn} className="flex items-start gap-3 text-valar-navy text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-6">
              {[
                { icon: Target, title: "Clarity", desc: "Your real financial position — not just numbers, but what they mean for your options." },
                { icon: BarChart2, title: "Structure", desc: "Visibility over cashflow, commitments, and the path toward your goals." },
                { icon: TrendingUp, title: "Direction", desc: "Confident decisions aligned with your goals — property, wealth, or financial freedom." },
              ].map((card, i) => (
                <motion.div data-cmp="FinancialPlanningPage.WhyFinancialPlanning.Card" key={i} variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm border border-valar-concrete flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-valar-fog flex items-center justify-center flex-shrink-0">
                    <card.icon className="w-5 h-5 text-valar-amber" />
                  </div>
                  <div>
                    <h3 className="font-bold text-valar-navy mb-1">{card.title}</h3>
                    <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FINANCIAL COACHING */}
      {/* FINANCIAL COACHING */}
      {/* FINANCIAL COACHING */}
      <section data-cmp="FinancialPlanningPage.FinancialCoaching" className="relative h-[600px]">
        <div className="absolute inset-0 z-0">
          <Image src="/images/financial-coaching.png" alt="Financial coaching session" fill unoptimized className="object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-valar-navy/45" />
        </div>
        {/* Heading — top */}
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10 pt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Financial Coaching</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-white leading-tight">
              A structured process for long-term financial clarity<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>
        </div>
        {/* Card — pinned to bottom */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-4 md:px-12 pb-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-valar-fog/80 backdrop-blur-sm p-8 rounded-sm border-t-2 border-valar-amber">
              <p className="text-valar-navy leading-relaxed">
                We review your full financial picture and build a practical framework around your goals. Sessions can be one-off or ongoing — tailored to where you are and what you need.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section data-cmp="FinancialPlanningPage.OtherServices" className="pt-16 pb-12 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-10">
            <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Financial Planning Services</span>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Cashflow & Budget Planning", desc: "Understand where your money goes and structure it better.", items: ["Income and expense analysis", "Budgeting strategies", "Identifying financial pressure points", "Improving financial visibility", "Cashflow planning"] },
              { title: "Mortgage & Lending Strategy", desc: "How lending fits into your broader financial picture.", items: ["Affordability analysis", "Repayment planning", "Debt management", "Refinancing considerations", "Future borrowing flexibility"] },
              { title: "Goal-Based Financial Planning", desc: "Financial decisions aligned with where you want to be.", items: ["Home ownership", "Investment property planning", "Family and business goals", "Retirement preparation", "Financial independence"] },
            ].map((svc, i) => (
              <motion.div data-cmp="FinancialPlanningPage.OtherServices.ServiceCard" key={i} variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-valar-concrete">
                <h3 className="text-lg font-bold text-valar-navy mb-3">{svc.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed mb-5">{svc.desc}</p>
                <ul className="space-y-2">
                  {svc.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-valar-navy">
                      <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="FinancialPlanningPage.HowItWorks" className="pt-12 pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              From first conversation to ongoing clarity<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Discovery Session", body: "We discuss your goals, situation, and priorities to understand what you want to achieve." },
              { num: "02", title: "Financial Review", body: "We review your income, expenses, assets, and liabilities to establish a clear baseline." },
              { num: "03", title: "Strategy Development", body: "We identify opportunities and create practical, actionable recommendations tailored to your goals." },
              { num: "04", title: "Implementation & Support", body: "Regular reviews and coaching sessions to keep you on track." },
            ].map((step, i) => (
              <motion.div data-cmp="FinancialPlanningPage.HowItWorks.Step" key={i} variants={fadeIn} className="flex gap-6 bg-valar-fog p-8 rounded-lg border border-valar-concrete">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-valar-navy text-white flex items-center justify-center font-bold text-sm">{step.num}</div>
                <div>
                  <h3 className="text-lg font-bold text-valar-navy mb-2">{step.title}</h3>
                  <p className="text-valar-indigo leading-relaxed text-sm">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section data-cmp="FinancialPlanningPage.WhoItIsFor" className="py-24 bg-valar-indigo text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-12">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Who Is Financial Planning For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Who Can Benefit From Financial Planning<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: HomeIcon, label: "First home buyers" },
              { icon: TrendingUp, label: "Young professionals" },
              { icon: Users, label: "Growing families" },
              { icon: Briefcase, label: "Self-employed clients" },
              { icon: BarChart2, label: "Property investors" },
              { icon: Target, label: "Anyone seeking financial clarity" },
            ].map((item, i) => (
              <motion.div data-cmp="FinancialPlanningPage.WhoItIsFor.AudienceItem" key={i} variants={fadeIn} className="bg-valar-navy/40 border border-white/10 rounded-sm p-5 flex items-center gap-4">
                <item.icon className="w-5 h-5 text-valar-amber flex-shrink-0" />
                <span className="text-sm font-medium text-valar-lilac">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section data-cmp="FinancialPlanningPage.Faq" className="pt-24 pb-12 bg-white">
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
      <section data-cmp="FinancialPlanningPage.FinalCta" className="pt-12 pb-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left — text + CTA */}
            <motion.div variants={fadeIn}>
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Build a Clear Financial Plan?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-valar-navy mt-4 mb-6">
                Start with a clear conversation<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-valar-indigo text-lg leading-relaxed mb-8">
                Whether you are preparing to buy a home, improve your cashflow, or simply gain greater clarity around your finances — let&apos;s talk.
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
