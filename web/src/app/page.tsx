"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  RefreshCw,
  TrendingUp,
  Briefcase,
  ArrowRight,
  BookOpen,
  Calculator,
  BarChart2,
  Calendar,
  FileText,
  AlertTriangle,
  Users,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const TESTIMONIALS = [
  { initials: "J&S", name: "Jane & Scott",    type: "First Home Buyers",         location: "Auckland",     quote: "Half a year ago we even can't imagine that today we will be the owners of our first home.",          body: "Lena encouraged us to analyze our opportunities, and we understand that we can do this. Really appreciate the support during all the process." },
  { initials: "M",   name: "Marina",          type: "Refinance Client",           location: "Auckland",     quote: "I worked through a difficult situation in my life, and I thought that I will lose my house.",        body: "Lena helped me to refinance it with another bank and build up some security for me and my son. I have a variable income and the border in my home, but most importantly, I'm the owner." },
  { initials: "A&M", name: "Alex & Max",      type: "First Home Buyers",         location: "Christchurch", quote: "It was a long run, but finally we settled, and Lena helped us.",                                    body: "Really appreciate the support during all the process, from the beginning of the application and settlement, and now we are more confident in our future." },
  { initials: "O",   name: "Olga",            type: "Investment Property Client", location: "Wellington",   quote: "Lena looked at the whole picture, not just the mortgage.",                                        body: "Her guidance helped us make decisions that aligned with our long-term plans, not just what worked today. We feel much more in control of our future." },
  { initials: "E&D", name: "Emily & David",   type: "Refinance Client",           location: "Auckland",     quote: "The process felt so much less stressful with Lena guiding us.",                                   body: "Everything was explained clearly, and we always knew what was happening next. It made a huge difference." },
];

const MINI_REVIEWS = [
  "Clear communication through every step.",
  "Highly professional and approachable.",
  "Explained everything in a way we understood.",
  "Made the whole process so much easier.",
  "Great structure and advice.",
  "Always available when we needed.",
];

export default function Home() {
  const testimonialTrackRef = useRef<HTMLDivElement>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialMax = TESTIMONIALS.length - 3;

  const scrollTestimonials = (dir: number) => {
    const newIndex = Math.max(0, Math.min(testimonialMax, testimonialIndex + dir));
    setTestimonialIndex(newIndex);
    const track = testimonialTrackRef.current;
    if (track) track.scrollTo({ left: newIndex * (track.offsetWidth + 24) / 3, behavior: "smooth" });
  };
  return (
    <div data-cmp="HomePage" className="w-full flex flex-col font-sans">
      {/* HERO */}
      <section data-cmp="HomePage.Hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-nz.png"
            alt="New Zealand landscape"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/55 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent z-10" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-40 pb-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-xl lg:max-w-2xl">
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-medium tracking-tight mb-6 leading-[1.15] text-white">
              <span className="block">Strategic Mortgage Advice</span>
              <span className="block">Built Around Your Future<span className="text-valar-amber">.</span></span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg lg:text-xl text-white/80 mb-10 max-w-md leading-relaxed font-light border-l-2 border-valar-amber pl-4">
              Beyond approvals and interest rates.<br />
              <span className="whitespace-nowrap">Bringing clarity to your lending and financial decisions.</span>
            </motion.p>
            <motion.div data-cmp="HomePage.Hero.Cta" variants={fadeIn} className="flex flex-col md:flex-row gap-4">
              <Link href="/book" className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" /> Book Strategy Call <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/book" className="bg-transparent border border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> Download First-Home Buyer Guide
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section data-cmp="HomePage.WhoWeHelp" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-4">How can we help?</motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-valar-indigo max-w-2xl mx-auto">Find the pathway that best fits your current goals.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HomeIcon, title: "Buying a Home", desc: "Support for first-home buyers and future homeowners.", link: "/services" },
              { icon: RefreshCw, title: "Refinancing & Restructuring", desc: "Review your current lending structure and future flexibility.", link: "/services" },
              { icon: TrendingUp, title: "Investing in Property", desc: "Property decisions structured around long-term opportunities.", link: "/services" },
              { icon: Briefcase, title: "Business & Self-Employed", desc: "Lending support for business owners. Complex financial structures.", link: "/services" },
            ].map((path, i) => (
              <motion.div data-cmp="HomePage.WhoWeHelp.PathCard" key={i} variants={fadeIn}>
                <Link href={path.link} className="block bg-white p-8 rounded-lg shadow-sm border-l-4 border-transparent hover:border-valar-amber hover:shadow-md transition-all group h-full">
                  <div className="w-10 h-10 bg-valar-concrete rounded-full flex items-center justify-center text-valar-navy mb-6 group-hover:bg-valar-amber transition-colors">
                    <path.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-valar-navy mb-3">{path.title}</h3>
                  <p className="text-valar-indigo text-lg leading-relaxed">{path.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MORE THAN A MORTGAGE */}
      <section data-cmp="HomePage.MoreThanAMortgage" className="py-24 bg-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">More Than A Mortgage</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="block">Property decisions support</span><span className="block">the future you&apos;re building.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-valar-lilac leading-relaxed">
              Most advisers help you secure a property. We help you understand how that decision fits into the bigger picture — your cashflow, future plans and long-term financial goals.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Financial Clarity", desc: "Know where you stand and what matters the most." },
              { title: "Strategic Structure", desc: "Create flexibility for future plans and opportunities." },
              { title: "Long-Term Planning", desc: "Align property decisions with your wealth goals." },
            ].map((card, i) => (
              <motion.div data-cmp="HomePage.MoreThanAMortgage.ValueCard" key={i} variants={fadeIn} className="bg-valar-indigo p-8 rounded-sm border-t-2 border-valar-amber hover:shadow-[0_0_20px_rgba(232,162,58,0.15)] transition-shadow">
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-valar-lilac text-lg leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section data-cmp="HomePage.HowWeWork" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Our Framework</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6 leading-tight">
              Structured financial approach.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-valar-indigo leading-relaxed whitespace-nowrap">
              We support clients from the first property conversation through to settlement and beyond.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Vertical connecting line — desktop only */}
            <div className="hidden md:block absolute top-12 bottom-12 w-px bg-valar-concrete/50 left-28" />

            <div className="divide-y divide-valar-concrete/30">
              {[
                { num: "01", icon: Users,      title: "Bigger Picture View",    desc: "We look at your position, priorities and what the property decision needs to support — without turning the conversation into unnecessary lifestyle coaching." },
                { num: "02", icon: BarChart2,  title: "Financial Strategy & Structure",      desc: "We analyse affordability, cashflow, lending options, flexibility and risks to build a structure that works now and can adapt later." },
                { num: "03", icon: FileCheck,  title: "Application & Settlement",  desc: "Once the strategy is clear, we manage the application, lender communication, approval process and settlement steps." },
                { num: "04", icon: RefreshCw,  title: "Ongoing Guidance",                    desc: "As rates, opportunities and life circumstances change, we help review and adjust the strategy over time." },
              ].map((step, i) => (
                <motion.div data-cmp="HomePage.HowWeWork.Step" key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}>
                  {/* Desktop */}
                  <div className="hidden md:flex items-center py-10">
                    <span className="w-24 flex-shrink-0 text-5xl font-bold text-valar-navy tabular-nums">{step.num}</span>
                    <div className="w-8 flex-shrink-0 flex justify-center relative z-10">
                      <div className="w-4 h-4 rounded-full border-2 border-valar-amber bg-valar-fog" />
                    </div>
                    <div className="w-6 flex-shrink-0" />
                    <div className="w-[4.5rem] h-[4.5rem] flex-shrink-0 rounded-full bg-valar-concrete/30 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-valar-indigo" />
                    </div>
                    <div className="self-stretch border-l border-valar-concrete/50 mx-6" />
                    <div className="w-[20rem] flex-shrink-0">
                      <h3 className="text-xl font-bold text-valar-navy whitespace-nowrap">{step.title}</h3>
                    </div>
                    <p className="max-w-[650px] text-base text-valar-indigo leading-relaxed pl-10">{step.desc}</p>
                  </div>
                  {/* Mobile */}
                  <div className="flex md:hidden items-start gap-5 py-8">
                    <span className="text-4xl font-bold text-valar-navy w-14 flex-shrink-0 tabular-nums">{step.num}</span>
                    <div>
                      <h3 className="text-xl font-bold text-valar-navy mb-2 leading-snug">{step.title}</h3>
                      <p className="text-lg text-valar-indigo leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section data-cmp="HomePage.Testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Client Experiences</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6">
              What our clients say
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-valar-indigo max-w-2xl mx-auto">
              Real stories from people we have helped make confident, well-structured decisions for their future.
            </motion.p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            {/* Track with side arrows */}
            <div className="relative px-14">
              {/* Left arrow */}
              <button onClick={() => scrollTestimonials(-1)} disabled={testimonialIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-valar-concrete bg-white shadow-sm flex items-center justify-center hover:border-valar-amber disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-5 h-5 text-valar-navy" />
              </button>
              {/* Right arrow */}
              <button onClick={() => scrollTestimonials(1)} disabled={testimonialIndex >= testimonialMax} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-valar-concrete bg-white shadow-sm flex items-center justify-center hover:border-valar-amber disabled:opacity-30 transition-colors">
                <ChevronRight className="w-5 h-5 text-valar-navy" />
              </button>

            {/* Track */}
            <div className="overflow-hidden">
              <div ref={testimonialTrackRef} className="flex gap-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {TESTIMONIALS.map((t, i) => (
                  <div data-cmp="HomePage.Testimonials.Card" key={i} className="flex-shrink-0 w-[calc(33.333%-16px)] bg-white rounded-xl border border-valar-concrete/60 p-6 shadow-sm flex flex-col">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-valar-fog border border-valar-concrete/50 flex items-center justify-center mb-5 flex-shrink-0">
                      <span className="text-base font-bold text-valar-indigo">{t.initials}</span>
                    </div>
                    {/* Quote mark */}
                    <div className="text-3xl text-valar-amber leading-none mb-3 font-serif opacity-70">&ldquo;&ldquo;</div>
                    {/* Bold italic quote */}
                    <p className="font-bold italic text-valar-navy mb-3 leading-snug">&ldquo;{t.quote}&rdquo;</p>
                    {/* Body */}
                    <p className="text-sm text-valar-indigo leading-relaxed flex-1 mb-6">{t.body}</p>
                    {/* Footer */}
                    <div className="border-t border-valar-concrete/50 pt-4">
                      <p className="font-bold text-valar-navy">{t.name}</p>
                      <p className="text-valar-amber text-sm font-medium">{t.type}</p>
                      <p className="text-sm text-valar-indigo flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />{t.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: testimonialMax + 1 }).map((_, i) => (
                <button key={i} onClick={() => { setTestimonialIndex(i); const track = testimonialTrackRef.current; if (track) track.scrollTo({ left: i * (track.offsetWidth + 24) / 3, behavior: "smooth" }); }} className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? "bg-valar-amber" : "bg-valar-concrete"}`} />
              ))}
            </div>
          </div>

          {/* Mini reviews */}
          <div className="mt-16 pt-10 border-t border-valar-concrete/50 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 md:w-44">
              <p className="font-bold text-valar-navy text-lg leading-snug">More feedback from our clients</p>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {MINI_REVIEWS.map((r, i) => (
                <div key={i}>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-valar-amber text-valar-amber" />)}
                  </div>
                  <p className="text-xs text-valar-indigo leading-relaxed">&ldquo;{r}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEHIND VALAR */}
      <section data-cmp="HomePage.BehindValar" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="w-full md:w-1/2">
              <Image
                src="/images/lena-portrait.png"
                alt="Lena Bykova - Valar Financial Advisors"
                width={600}
                height={800}
                className="w-full max-w-md mx-auto md:max-w-none rounded-lg shadow-xl object-cover aspect-[3/4]"
              />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full md:w-1/2">
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Behind Valar</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-8">
                Founded by Lena Bykova.
              </motion.h2>

              <motion.div variants={fadeIn} className="space-y-6 text-valar-indigo text-xl leading-relaxed mb-8">
                <p>I created Valar to help people better understand how property, investments and smart financial decisions shape long-term wealth, freedom and future opportunities.</p>
                <p>After working across finance, audit, financial analytics, business valuation and investments for more than 20 years, I saw how often major financial decisions were made without a bigger long-term vision or strategy behind them.</p>
                <p>Valar was built around a different approach — helping clients structure property and financial decisions with greater clarity, flexibility and long-term perspective.</p>
                <p className="text-valar-indigo text-xl">Alongside mortgage advice, Valar integrates modern analytical tools, wealth-planning frameworks and financial psychology to help clients make more informed and confident financial decisions over time.</p>
              </motion.div>

              <motion.div data-cmp="HomePage.BehindValar.Credentials" variants={fadeIn} className="bg-white p-6 rounded-sm border border-valar-lilac mb-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-base text-valar-navy font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-valar-amber"></div> Certified Mortgage & Investment Adviser</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-valar-amber"></div> 20+ years in finance, analytics & investments</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-valar-amber"></div> Business valuation & strategic analysis background</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-valar-amber"></div> Modern AI & analytical tools</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-valar-amber"></div> Based in New Zealand</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Link href="/about" className="inline-flex items-center font-bold text-valar-navy hover:text-valar-amber transition-colors group">
                  Learn more about Lena & Valar <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH AN ADVISER */}
      <section data-cmp="HomePage.WhyAdviser" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mx-auto text-center mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Why Work With A Mortgage Adviser?</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6">Guidance beyond the application itself.</motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-valar-indigo leading-relaxed">
              Mortgage advice is not only about comparing interest rates. A good adviser helps structure lending decisions, navigate the approval process and provide guidance around long-term financial flexibility and future opportunities.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Strategic Guidance", desc: "Advice around structure, flexibility and long-term financial decisions — not only loan approval." },
              { title: "Bank & Lender Access", desc: "We work directly with lenders, helping clients compare options and navigate the application process more efficiently." },
              { title: "No Direct Cost for Most Clients", desc: "Mortgage advisers are generally paid by the lender, meaning advice is usually provided at no direct cost to clients." },
            ].map((card, i) => (
              <motion.div data-cmp="HomePage.WhyAdviser.Card" key={i} variants={fadeIn} className="bg-valar-fog p-8 rounded-lg border border-valar-concrete">
                <h3 className="text-2xl font-bold text-valar-navy mb-3">{card.title}</h3>
                <p className="text-valar-indigo text-lg leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center text-valar-indigo font-medium max-w-2xl mx-auto">
            Clients often tell us that having structured guidance throughout the process made complex financial decisions feel far clearer and less overwhelming.
          </motion.p>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section data-cmp="HomePage.WhatWeOffer" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">What We Offer</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6 max-w-4xl mx-auto">
              Financial guidance structured around property, lending and long-term decisions.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div data-cmp="HomePage.WhatWeOffer.Column" variants={fadeIn} className="space-y-8">
              <h3 className="text-2xl font-bold text-valar-navy border-b-2 border-valar-amber pb-4 inline-block pr-8 uppercase tracking-wider">Borrowing</h3>
              <div className="space-y-6">
                <div><h4 className="font-bold text-valar-navy mb-2">Mortgage Advice</h4><p className="text-lg text-valar-indigo leading-relaxed">Support with buying, refinancing and structuring lending more strategically.</p></div>
                <div><h4 className="font-bold text-valar-navy mb-2">Refinance & Restructuring</h4><p className="text-lg text-valar-indigo leading-relaxed">Review your current lending structure, flexibility and future opportunities.</p></div>
              </div>
            </motion.div>
            <motion.div data-cmp="HomePage.WhatWeOffer.Column" variants={fadeIn} className="space-y-8">
              <h3 className="text-2xl font-bold text-valar-navy border-b-2 border-valar-amber pb-4 inline-block pr-8 uppercase tracking-wider">Wealth Building</h3>
              <div className="space-y-6">
                <div><h4 className="font-bold text-valar-navy mb-2">Financial Planning</h4><p className="text-lg text-valar-indigo leading-relaxed">Build clearer financial direction around lifestyle, property and long-term goals.</p></div>
                <div><h4 className="font-bold text-valar-navy mb-2">Investment Property Advice</h4><p className="text-lg text-valar-indigo leading-relaxed">Guidance around investment property decisions, equity and future opportunities.</p></div>
              </div>
            </motion.div>
            <motion.div data-cmp="HomePage.WhatWeOffer.Column" variants={fadeIn} className="space-y-8">
              <h3 className="text-2xl font-bold text-valar-navy border-b-2 border-valar-amber pb-4 inline-block pr-8 uppercase tracking-wider">Business</h3>
              <div className="space-y-6">
                <div><h4 className="font-bold text-valar-navy mb-2">Business Lending</h4><p className="text-lg text-valar-indigo leading-relaxed">Funding solutions and structure for small businesses and commercial property.</p></div>
                <div><h4 className="font-bold text-valar-navy mb-2">Advisory Services</h4><p className="text-lg text-valar-indigo leading-relaxed">Strategic planning, forecasting and financial structure for established businesses.</p></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mt-16">
            <Link href="/services" className="inline-flex items-center justify-center font-bold text-valar-navy hover:text-valar-amber transition-colors group">
              View All Services <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FIRST-HOME BUYER GUIDE */}
      <section data-cmp="HomePage.FirstHomeGuide" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full md:w-[55%]">
              <motion.div variants={fadeIn} className="mb-4">
                <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">First-Home Buyer Guide</span>
              </motion.div>
              <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6">
                Buying your first home can feel overwhelming. Understanding the process shouldn&apos;t be.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-valar-indigo text-xl leading-relaxed mb-6">
                Our First-Home Buyer Guide was created to help clients better understand:
              </motion.p>

              <motion.ul variants={fadeIn} className="space-y-3 text-valar-navy font-medium mb-8">
                {["the buying process", "budgeting and deposits", "pre-approval", "hidden costs", "lending structure", "what to prepare before making an offer"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-valar-amber"></div>
                    {item}
                  </li>
                ))}
              </motion.ul>

              <motion.p variants={fadeIn} className="text-valar-indigo text-xl leading-relaxed mb-10 italic">
                Designed to make the process clearer, calmer and easier to navigate.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/book" className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" /> Download the Guide
                </Link>
                <Link href="/book" className="bg-transparent border border-valar-navy hover:bg-valar-navy hover:text-white text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" /> Book a Strategy Call
                </Link>
              </motion.div>

              <motion.p variants={fadeIn} className="text-xs text-valar-indigo leading-relaxed max-w-lg">
                Created by Valar Financial Advisors using practical mortgage experience, financial strategy and real client scenarios.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="w-full md:w-[45%]">
              <Image
                src="/images/first-home.png"
                alt="First-Home Buyer Guide"
                width={800}
                height={600}
                className="w-full rounded-lg shadow-xl object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* INSIGHTS — hidden */}
      {false && (
      <section data-cmp="HomePage.Insights" className="py-24 bg-valar-fog">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Insights & Learning</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-valar-navy mb-6">
              Financial insights, market thinking and practical guidance.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: BarChart2, title: "Market Updates", desc: "Property, lending and macroeconomic insights shaping financial decisions in New Zealand." },
              { icon: BookOpen, title: "Learning Hub", desc: "Guides and educational content designed to make complex financial decisions easier to understand." },
              { icon: Calculator, title: "Tools & Calculators", desc: "Practical calculators, planning tools and financial resources." },
            ].map((card, i) => (
              <motion.div data-cmp="HomePage.Insights.Card" key={i} variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-valar-concrete flex flex-col h-full hover:border-valar-amber transition-colors">
                <div className="w-12 h-12 bg-valar-fog rounded-full flex items-center justify-center text-valar-amber mb-6">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-valar-navy mb-4">{card.title}</h3>
                <p className="text-valar-indigo text-lg leading-relaxed mb-6 flex-1">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
            <Link href="/insights" className="inline-flex items-center justify-center font-bold text-valar-navy hover:text-valar-amber transition-colors group">
              Explore Insights & Resources <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
      )}

      {/* BEFORE BUYING PROPERTY - TABS */}
      <section data-cmp="HomePage.BeforeBuying" className="py-24 bg-gradient-to-b from-valar-indigo to-valar-navy text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mx-auto text-center mb-16">
            <motion.div variants={fadeIn} className="mb-4">
              <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">Before Buying Property</span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The strategic questions worth answering before committing to property decisions.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto mb-16">
            <Tabs defaultValue="clarity" className="w-full">
              <TabsList className="bg-valar-navy/40 border border-white/10 w-full flex rounded-lg p-1 mb-10 h-auto">
                <TabsTrigger value="clarity" className="flex-1 py-3 px-4 text-sm md:text-base text-valar-lilac data-[state=active]:text-valar-amber data-[state=active]:border-b-2 data-[state=active]:border-valar-amber data-[state=active]:font-bold transition-all bg-transparent rounded-none">CLARITY</TabsTrigger>
                <TabsTrigger value="structure" className="flex-1 py-3 px-4 text-sm md:text-base text-valar-lilac data-[state=active]:text-valar-amber data-[state=active]:border-b-2 data-[state=active]:border-valar-amber data-[state=active]:font-bold transition-all bg-transparent rounded-none">STRUCTURE</TabsTrigger>
                <TabsTrigger value="impact" className="flex-1 py-3 px-4 text-sm md:text-base text-valar-lilac data-[state=active]:text-valar-amber data-[state=active]:border-b-2 data-[state=active]:border-valar-amber data-[state=active]:font-bold transition-all bg-transparent rounded-none">IMPACT</TabsTrigger>
              </TabsList>

              <TabsContent data-cmp="HomePage.BeforeBuying.TabPanel" value="clarity" className="space-y-8">
                <p className="text-lg md:text-xl text-valar-lilac leading-relaxed mb-8 max-w-3xl">
                  True clarity means understanding your position completely before you approach the market. It&apos;s about knowing your boundaries — not simply what a bank calculator suggests.
                </p>
                <div className="space-y-6">
                  {[
                    "Do you understand your realistic borrowing capacity beyond generic bank calculators?",
                    "Have you accounted for hidden ownership costs, future rate changes and lifestyle impact within your monthly cashflow?",
                    "Are your deposit sources — savings, KiwiSaver, equity or family support — structured efficiently?",
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-6">
                      <span className="text-4xl md:text-5xl font-bold text-valar-amber leading-none opacity-80">0{i + 1}</span>
                      <p className="text-white text-lg md:text-xl leading-relaxed pt-1">{q}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent data-cmp="HomePage.BeforeBuying.TabPanel" value="structure" className="space-y-8">
                <p className="text-lg md:text-xl text-valar-lilac leading-relaxed mb-8 max-w-3xl">
                  The right mortgage structure can improve flexibility, reduce long-term costs and create better future opportunities.
                </p>
                <div className="space-y-6">
                  {[
                    "Should your lending be split across different fixed terms to reduce interest-rate risk?",
                    "Would offset or revolving-credit facilities support your income patterns and cashflow better?",
                    "Is your lending structure designed to support future investment or equity opportunities?",
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-6">
                      <span className="text-4xl md:text-5xl font-bold text-valar-amber leading-none opacity-80">0{i + 1}</span>
                      <p className="text-white text-lg md:text-xl leading-relaxed pt-1">{q}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent data-cmp="HomePage.BeforeBuying.TabPanel" value="impact" className="space-y-8">
                <p className="text-lg md:text-xl text-valar-lilac leading-relaxed mb-8 max-w-3xl">
                  Property decisions affect far more than monthly repayments. They shape future flexibility, investment potential and long-term financial freedom.
                </p>
                <div className="space-y-6">
                  {[
                    "How could this mortgage affect your ability to invest or build wealth over the next 10 years?",
                    "Would your financial structure remain sustainable if household income or circumstances changed?",
                    "Does this property decision align with your long-term lifestyle and retirement goals?",
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-6">
                      <span className="text-4xl md:text-5xl font-bold text-valar-amber leading-none opacity-80">0{i + 1}</span>
                      <p className="text-white text-lg md:text-xl leading-relaxed pt-1">{q}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
            <Link href="/insights" className="inline-flex items-center justify-center font-bold text-valar-amber hover:text-white transition-colors group">
              Explore the Learning Hub <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-cmp="HomePage.FinalCta" className="py-24 bg-valar-navy border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-valar-indigo/30 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              START WITH CLARITY
            </motion.h2>
            <motion.div variants={fadeIn} className="space-y-4 mb-10">
              <p className="text-lg md:text-xl text-valar-lilac leading-relaxed">
                Whether you&apos;re buying, restructuring or planning ahead, the first step is understanding the bigger financial picture.
              </p>
              <p className="text-lg md:text-xl text-valar-lilac leading-relaxed">
                Valar helps clients approach property and financial decisions with greater clarity, structure and long-term perspective.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/book" className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center w-full sm:w-auto">
                Book Strategy Call
              </Link>
              <Link href="/insights" className="bg-transparent border border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold text-center transition-colors flex items-center justify-center w-full sm:w-auto">
                Explore Insights & Learning
              </Link>
            </motion.div>

            <motion.p variants={fadeIn} className="text-xs text-valar-steel max-w-sm mx-auto">
              No pressure, no obligation — simply a clearer conversation around your next financial decision.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
