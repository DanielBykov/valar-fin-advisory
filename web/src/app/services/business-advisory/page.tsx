"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  BarChart2,
  TrendingUp,
  DollarSign,
  Layers,
  Cpu,
  LineChart,
  Briefcase,
  Store,
  Lightbulb,
  Users,
  Building2,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function BusinessAdvisoryPage() {
  return (
    <div className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section className="bg-[#061634] text-white pt-28 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-[#E8A23A]" />
              <span className="text-[#8F93B5] font-bold tracking-widest text-xs uppercase">Business Advisory</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
              Business Advisory<span className="text-[#E8A23A]">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#8F93B5] font-light mb-8">
              Better Business Decisions Through Financial Insight
            </motion.p>
            <motion.div variants={fadeIn} className="text-base text-[#C8CBE3] max-w-2xl leading-relaxed mb-10 border-l-2 border-[#E8A23A] pl-4">
              Helping business owners understand cashflow, profitability, growth opportunities, and business performance through financial analysis, forecasting, business intelligence, and AI-powered tools.
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

      {/* WHY BUSINESS ADVISORY */}
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
                <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Why Business Advisory?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634] mb-6 leading-tight">
                Many business owners are experts in their trade — but struggle with the numbers<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#2E4882] leading-relaxed">
                Business Advisory helps answer the important financial questions through analysis and strategic planning.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.p variants={fadeIn} className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase mb-5">Questions we help answer</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Where is my business making money?",
                  "Where am I losing money?",
                  "What products or clients are most profitable?",
                  "Can I afford to hire another employee?",
                  "Can I invest in new equipment?",
                  "Is my cashflow healthy?",
                  "Can my business support additional borrowing?",
                  "How can I make better decisions using data?",
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
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Your accountant focuses on compliance<span className="text-[#E8A23A]">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-[#C8CBE3] leading-relaxed mb-4">
                Your accountant focuses on tax compliance, annual financial statements, and meeting reporting obligations.
              </motion.p>
              <motion.p variants={fadeIn} className="text-[#C8CBE3] leading-relaxed mb-4">
                Our role is different. We focus on helping business owners understand what the numbers mean and how they can use them to make better decisions.
              </motion.p>
              <motion.p variants={fadeIn} className="text-white font-medium">
                We help transform financial information into practical business insights.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, label: "Cashflow visibility" },
                { icon: BarChart2, label: "Performance analysis" },
                { icon: LineChart, label: "Financial forecasting" },
                { icon: TrendingUp, label: "Growth planning" },
                { icon: Layers, label: "Business intelligence" },
                { icon: Cpu, label: "AI & technology tools" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#2E4882] border border-white/10 rounded-sm p-4 flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#E8A23A] flex-shrink-0" />
                  <span className="text-sm text-[#C8CBE3] font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE CAN HELP WITH */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">What We Can Help With</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              Six areas of business advisory support<span className="text-[#E8A23A]">.</span>
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
                  title: "Cashflow Forecasting",
                  desc: "Understanding where cash is coming from, where it is going, and how future decisions may affect business performance.",
                  items: ["Cashflow forecasting", "Funding requirements", "Scenario planning", "Working capital analysis"],
                },
                {
                  icon: BarChart2,
                  title: "Financial Dashboards & Business Intelligence",
                  desc: "Helping business owners access important information quickly and clearly.",
                  items: ["KPI dashboards", "Management reporting", "Business intelligence systems", "Operational reporting", "Performance tracking"],
                },
                {
                  icon: LineChart,
                  title: "Business Performance Analysis",
                  desc: "Understanding what drives profitability and growth.",
                  items: ["Revenue analysis", "Cost analysis", "Margin analysis", "Profitability by service, project, or customer", "Identifying improvement opportunities"],
                },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-[#E8A23A]" />
                    </div>
                    <h3 className="font-bold text-[#061634] text-sm leading-tight">{card.title}</h3>
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

            {/* Row 2 — 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Investment & Growth Analysis",
                  desc: "Helping evaluate future opportunities before committing capital.",
                  items: ["Investment analysis", "Return on investment (ROI)", "Project feasibility", "Equipment purchases", "Expansion opportunities", "Growth scenarios"],
                },
                {
                  icon: Layers,
                  title: "Lending & Funding Support",
                  desc: "Helping businesses understand funding options and borrowing capacity.",
                  items: ["Business lending analysis", "Loan structure review", "Funding requirements", "Lender support and application preparation"],
                },
                {
                  icon: Cpu,
                  title: "AI & Technology Solutions",
                  desc: "Helping businesses use modern tools to improve visibility, reporting, and decision-making.",
                  items: ["AI-assisted reporting", "Automated dashboards", "Financial data integration", "Workflow improvements", "Business intelligence tools"],
                },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <card.icon className="w-4 h-4 text-[#E8A23A]" />
                    </div>
                    <h3 className="font-bold text-[#061634] text-sm leading-tight">{card.title}</h3>
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
              Practical outputs tailored to your business<span className="text-[#E8A23A]">.</span>
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
              { num: "01", title: "Business Health Review", desc: "A structured review of business performance and financial position." },
              { num: "02", title: "Cashflow Forecast", desc: "A forecast showing future cashflow under different scenarios." },
              { num: "03", title: "Financial Dashboard", desc: "A customised dashboard to monitor key business metrics." },
              { num: "04", title: "Investment Analysis", desc: "Evaluation of future projects and investment opportunities." },
              { num: "05", title: "Strategic Recommendations", desc: "Practical actions designed to improve performance and support growth." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className={`bg-white p-8 rounded-lg shadow-sm border border-[#C9CED6] ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <div className="text-4xl font-bold text-[#C9CED6] mb-4 leading-none">{item.num}</div>
                <h3 className="text-base font-bold text-[#061634] mb-3">{item.title}</h3>
                <p className="text-[#2E4882] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Who Is This For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Built for businesses that want better information<span className="text-[#E8A23A]">.</span>
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
              { icon: Building2, title: "Trades & Construction", desc: "Businesses managing projects, staff, vehicles, and equipment." },
              { icon: Briefcase, title: "Professional Service Firms", desc: "Consultants, agencies, and service-based businesses." },
              { icon: Store, title: "Retail Businesses", desc: "Businesses seeking better visibility over profitability and cashflow." },
              { icon: Lightbulb, title: "Start-Ups", desc: "Founders seeking financial structure, reporting, and growth planning." },
              { icon: TrendingUp, title: "Growing Businesses", desc: "Business owners wanting better information to support decision-making." },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeIn} className={`bg-[#061634]/40 border border-white/10 rounded-sm p-6 flex items-start gap-4 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="w-9 h-9 rounded-full bg-[#E8A23A]/20 flex items-center justify-center flex-shrink-0">
                  <card.icon className="w-4 h-4 text-[#E8A23A]" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-[#C8CBE3] text-sm leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#061634]">
              From discovery to implementation<span className="text-[#E8A23A]">.</span>
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
              { num: "01", title: "Discovery Session", body: "We discuss your business, goals, challenges, and priorities." },
              { num: "02", title: "Information Review", body: "We review available financial information, systems, and reporting processes." },
              { num: "03", title: "Analysis & Recommendations", body: "We identify opportunities, risks, and practical improvements." },
              { num: "04", title: "Implementation Support", body: "Where appropriate, we help build dashboards, forecasting tools, reporting systems, and financial frameworks." },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="flex gap-6 bg-[#F6F7F9] p-8 rounded-lg border border-[#C9CED6]">
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
              <span className="text-[#E8A23A] font-bold tracking-widest text-xs uppercase">Ready to Better Understand Your Business?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Good decisions start with good information<span className="text-[#E8A23A]">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#C8CBE3] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you need clearer cashflow visibility, better reporting, investment analysis, or business intelligence tools, we can help you build a stronger financial foundation for growth.
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
