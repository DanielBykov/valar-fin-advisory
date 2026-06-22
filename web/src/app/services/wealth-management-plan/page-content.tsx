"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
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

export default function WealthManagementContent() {
  return (
    <div data-cmp="WealthManagementPage" className="w-full flex flex-col font-sans">

      {/* HERO */}
      <section data-cmp="WealthManagementPage.Hero" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/wealth-management-hero.png"
            alt="Sailboat on the New Zealand coast at sunset"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/80 via-valar-navy/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-36 pb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Wealth Building</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Wealth Management Plan<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-valar-amber pl-4 font-light">
              A clear roadmap to help you build long-term wealth.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS A WEALTH MANAGEMENT PLAN */}
      <section data-cmp="WealthManagementPage.WhatIsThePlan" className="py-24 bg-valar-fog">
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
                A financial map for the next 10–20 years.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo leading-relaxed mb-6">
                A framework to guide your financial decisions over time — one you can return to and measure your progress against.
              </motion.p>
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
                  Long-term wealth is shaped by four key factors working together.
                </p>
              </motion.div>
              {[
                { icon: DollarSign, title: "Finances", desc: "How much capital you are able to generate and invest." },
                { icon: Brain, title: "Behaviour", desc: "Your financial habits and decision-making patterns." },
                { icon: Clock, title: "Time", desc: "The length of time your capital has to grow." },
                { icon: ShieldCheck, title: "Discipline", desc: "Your ability to stay consistent with your strategy." },
              ].map((card, i) => (
                <motion.div data-cmp="WealthManagementPage.WhatIsThePlan.WealthFactorCard" key={i} variants={fadeIn} className="bg-white p-5 rounded-lg shadow-sm border border-valar-concrete flex items-start gap-4">
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
      <section data-cmp="WealthManagementPage.WhatWeAnalyse" className="py-24 bg-valar-navy text-white">
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
              A complete picture of your financial architecture.
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
                title: "Cash Flow",
                items: ["Income", "Expenses", "Surplus cashflow", "Savings capacity", "Debt repayments"]
              },
              {
                icon: HomeIcon,
                title: "Property",
                items: ["Owner's property", "Investment property", "RE Development", "Mortgage structure", "Rental income"]
              },
              {
                icon: BarChart2,
                title: "Investments",
                items: ["Managed funds", "ETFs", "Shares", "KiwiSaver", "Alternative investments"]
              },
              {
                icon: Target,
                title: "Goals",
                items: ["Lifestyle goals", "Financial independence", "Family priorities", "Retirement planning", "Future projects"]
              },
            ].map((area, i) => (
              <motion.div data-cmp="WealthManagementPage.WhatWeAnalyse.AnalysisArea" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-sm border-t-2 border-valar-amber">
                <div className="flex items-center gap-3 mb-5">
                  <area.icon className="w-5 h-5 text-valar-amber" />
                  <h3 className="text-lg font-bold text-valar-navy">{area.title}</h3>
                </div>
                <ul className="space-y-2">
                  {area.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-valar-navy">
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
      <section data-cmp="WealthManagementPage.WhatYouReceive" className="py-24 bg-valar-fog">
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
              A personalised plan you can act on.
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
              { num: "01", title: "Current Position", desc: "A clear picture of your assets, liabilities, cashflow, and savings — your starting point." },
              { num: "02", title: "Future Scenarios", desc: "Achievable financial goals and lifestyle vision for the next 10–20 years." },
              { num: "03", title: "Pathway & Roadmap", desc: "Potential pathways across different asset classes and cashflow projections, with key milestones and decision points." },
            ].map((item, i) => (
              <motion.div data-cmp="WealthManagementPage.WhatYouReceive.DeliverableCard" key={i} variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-valar-concrete">
                <div className="text-4xl font-bold text-valar-concrete mb-4 leading-none">{item.num}</div>
                <h3 className="text-lg font-bold text-valar-navy mb-3">{item.title}</h3>
                <p className="text-valar-indigo text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS */}
      <section data-cmp="WealthManagementPage.HowItWorks" className="py-24 bg-white">
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
              From discovery to a clear plan.
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
                body: "You share information about your finances, goals, priorities, and future vision."
              },
              {
                num: "02",
                title: "Strategy Meeting",
                body: "We meet to discuss your goals, financial behaviour, opportunities, and possible pathways forward."
              },
              {
                num: "03",
                title: "Plan Development",
                body: "We analyse your situation and prepare your personalised Wealth Management Plan."
              },
              {
                num: "04",
                title: "Plan Review",
                body: "We walk through the completed plan together, review scenarios, and answer your questions."
              },
            ].map((step, i) => (
              <motion.div data-cmp="WealthManagementPage.HowItWorks.Step" key={i} variants={fadeIn} className="flex gap-6 bg-valar-fog p-8 rounded-lg border border-valar-concrete">
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
            data-cmp="WealthManagementPage.HowItWorks.OngoingNote"
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
      <section data-cmp="WealthManagementPage.WhoIsThisFor" className="py-24 bg-valar-indigo text-white">
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
              Who Can Benefit From a Wealth Management Plan<span className="text-valar-amber">.</span>
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
              { icon: Target, label: "Major life decisions" },
              { icon: BarChart2, label: "Anyone seeking long-term clarity" },
            ].map((item, i) => (
              <motion.div data-cmp="WealthManagementPage.WhoIsThisFor.AudienceItem" key={i} variants={fadeIn} className="bg-valar-navy/40 border border-white/10 rounded-sm p-5 flex items-center gap-4">
                <item.icon className="w-5 h-5 text-valar-amber flex-shrink-0" />
                <span className="text-sm font-medium text-valar-lilac">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="WealthManagementPage.FinalCta" className="pt-12 pb-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeIn}>
              <span className="text-valar-amber font-bold tracking-widest text-xs uppercase">Ready to Build Your Financial Roadmap?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-valar-navy mt-4 mb-6">
                Start with a clear conversation<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-valar-indigo text-lg leading-relaxed mb-8">
                Whether you are building wealth, planning for the future, or simply want to understand your options — let&apos;s talk.
              </p>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold transition-colors">
                <Calendar className="w-5 h-5" /> Book a Consultation
              </Link>
            </motion.div>
            <motion.div variants={fadeIn} className="relative h-80 md:h-96 rounded-sm overflow-hidden">
              <img src="/images/lena-client.jpg" alt="Lena Bykova discussing with a client" className="object-cover object-center w-full h-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
