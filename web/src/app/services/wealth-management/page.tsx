"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  TrendingUp,
  Clock,
  Brain,
  DollarSign,
  ShieldCheck,
  Home as HomeIcon,
  BarChart2,
  Briefcase,
  Users,
  Target
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function WealthManagementPage() {
  return (
    <div data-cmp="WealthManagementPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section className="bg-valar-navy text-white pt-28 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-5 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Strategic Advisory</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
              Wealth Management Plan<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-valar-steel font-light mb-8">
              A Roadmap for Building Long-Term Wealth
            </motion.p>
            <motion.div variants={fadeIn} className="text-base text-valar-lilac max-w-3xl leading-relaxed mb-10 border-l-2 border-valar-amber pl-4 space-y-3">
              <p>Most people focus on the next financial decision — a mortgage, an investment, a savings goal.</p>
              <p className="font-medium text-white">Few people step back and ask the bigger question: what could my financial future look like in 10, 15, or 20 years?</p>
              <p>The Wealth Management Plan is designed to answer that question.</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS A WEALTH MANAGEMENT PLAN */}
      <section className="py-24 bg-valar-fog">
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
                <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">What Is a Wealth Management Plan?</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy mb-6 leading-tight">
                A financial map for the next 10–20 years<span className="text-valar-amber">.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-6">
                Just as a map helps guide a journey, a Wealth Management Plan helps guide financial decisions over time. It provides a framework you can return to regularly and use to measure your progress toward your goals.
              </motion.p>
              <motion.p variants={fadeIn} className="text-valar-indigo font-medium mb-4">A personalised Wealth Management Plan helps you understand:</motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {[
                  "Where you are today",
                  "Where you want to be in the future",
                  "What resources you have available",
                  "What may be possible over the next 10–20 years",
                  "How different financial decisions may affect your future outcomes",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeIn} className="flex items-start gap-3 text-valar-navy text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-1.5" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-4">
              <motion.div variants={fadeIn}>
                <p className="text-valar-amber font-bold tracking-widest text-xs uppercase mb-5">Wealth Is More Than Investments</p>
                <p className="text-valar-indigo text-sm leading-relaxed mb-6">
                  Many people believe wealth is built by choosing the right investment. In reality, long-term wealth is often influenced by four key factors working together.
                </p>
              </motion.div>
              {[
                { icon: DollarSign, title: "Finances", desc: "How much capital you are able to generate and invest." },
                { icon: Brain, title: "Behaviour", desc: "Your financial habits and decision-making patterns." },
                { icon: Clock, title: "Time", desc: "The length of time your capital has to grow." },
                { icon: ShieldCheck, title: "Discipline", desc: "Your ability to stay consistent with your strategy." },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-white p-5 rounded-lg shadow-sm border border-valar-concrete flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-valar-fog flex items-center justify-center flex-shrink-0">
                    <card.icon className="w-4 h-4 text-valar-amber" />
                  </div>
                  <div>
                    <h3 className="font-bold text-valar-navy text-sm mb-1">{card.title}</h3>
                    <p className="text-valar-indigo text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE ANALYSE */}
      <section className="py-24 bg-valar-navy text-white">
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
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              A complete picture of your financial architecture<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: DollarSign,
                title: "Cashflow & Savings",
                items: ["Income", "Expenses", "Surplus cashflow", "Savings capacity"]
              },
              {
                icon: HomeIcon,
                title: "Property",
                items: ["Owner-occupied property", "Investment property", "Equity growth opportunities"]
              },
              {
                icon: BarChart2,
                title: "Investments",
                items: ["Managed funds", "ETFs", "Shares", "KiwiSaver", "Alternative investments"]
              },
              {
                icon: Target,
                title: "Long-Term Goals",
                items: ["Lifestyle goals", "Financial independence", "Family priorities", "Retirement planning", "Future projects"]
              },
            ].map((area, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-valar-indigo p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-5">
                  <area.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="text-lg font-bold">{area.title}</h3>
                </div>
                <ul className="space-y-2">
                  {area.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-valar-lilac">
                      <div className="w-1 h-1 rounded-full bg-valar-amber flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section className="py-24 bg-valar-fog">
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
              A personalised plan you can act on<span className="text-valar-amber">.</span>
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
              { num: "01", title: "Current Position", desc: "A snapshot of where you are today — your assets, liabilities, cashflow, and overall financial position." },
              { num: "02", title: "Future Scenarios", desc: "Potential outcomes over a 10–20 year timeframe based on your goals and current trajectory." },
              { num: "03", title: "Asset Allocation Framework", desc: "General guidance on how different asset classes may fit into your long-term strategy." },
              { num: "04", title: "Wealth Roadmap", desc: "A practical pathway showing key milestones, priorities, and decision points toward your goals." },
              { num: "05", title: "Financial Freedom Strategy", desc: "A structured approach designed to help align your financial decisions with your long-term vision." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className={`bg-white p-8 rounded-lg shadow-sm border border-valar-concrete ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <div className="text-4xl font-bold text-valar-concrete mb-4 leading-none">{item.num}</div>
                <h3 className="text-lg font-bold text-valar-navy mb-3">{item.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{item.desc}</p>
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
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">How the Process Works</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-valar-navy">
              From discovery to a clear plan<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              {
                num: "01",
                title: "Discovery",
                body: "You complete a questionnaire and provide information about your finances, goals, priorities, and future vision."
              },
              {
                num: "02",
                title: "Strategy Session",
                body: "We meet for approximately 60–90 minutes to discuss your goals, financial behaviour, opportunities, concerns, and possible future pathways."
              },
              {
                num: "03",
                title: "Plan Development",
                body: "We analyse the information and prepare your personalised Wealth Management Plan."
              },
              {
                num: "04",
                title: "Presentation Session",
                body: "We meet again to review the completed plan together, walk through the scenarios, and answer any questions."
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="flex gap-6 bg-valar-fog p-8 rounded-lg border border-valar-concrete">
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

          {/* Ongoing reviews note */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-8 bg-valar-navy text-white p-8 rounded-sm border-l-4 border-valar-amber"
          >
            <h3 className="font-bold text-lg mb-2">Ongoing Reviews</h3>
            <p className="text-valar-lilac text-sm leading-relaxed">
              The Wealth Management Plan is designed as a one-off strategic project. However, many clients choose to review their plan periodically as their circumstances, goals, and opportunities evolve. Review sessions can be conducted annually or as needed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-24 bg-valar-indigo text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Who Is This For?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              This service may be valuable for<span className="text-valar-amber">.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Briefcase, label: "Professionals" },
              { icon: TrendingUp, label: "Business owners" },
              { icon: HomeIcon, label: "Property investors" },
              { icon: Users, label: "Growing families" },
              { icon: Target, label: "Clients preparing for major life decisions" },
              { icon: BarChart2, label: "Anyone seeking long-term financial clarity" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-valar-navy/40 border border-white/10 rounded-sm p-5 flex items-center gap-4">
                <item.icon className="w-5 h-5 text-valar-amber flex-shrink-0" />
                <span className="text-sm font-medium text-valar-lilac">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-valar-navy text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Build Your Financial Roadmap?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
              Your future is shaped by the decisions you make today<span className="text-valar-amber">.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-valar-lilac text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              The Wealth Management Plan helps you understand what may be possible and create a strategy to move toward it with confidence.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
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

    </div>
  );
}
