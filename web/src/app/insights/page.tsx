"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

const INSIGHTS_DATA = [
  { id: 1, tag: "Property Market Updates", title: "Reserve Bank OCR Decision: What it means for fixed rates in Q4", excerpt: "Analyzing the latest monetary policy statement and its immediate impact on bank lending margins." },
  { id: 2, tag: "First-Home Buyers", title: "Structuring your deposit: KiwiSaver, Grants and Family Guarantees", excerpt: "A comprehensive guide to legally combining different deposit sources to satisfy LVR requirements." },
  { id: 3, tag: "Real Client Scenarios", title: "Case Study: Refinancing to release equity for a second property", excerpt: "How we restructured a client's primary mortgage to safely acquire an investment property without increasing monthly cashflow burden." },
  { id: 4, tag: "Learning Hub", title: "The difference between offset accounts and revolving credit", excerpt: "Understanding which flexible facility works best for your specific income patterns." },
  { id: 5, tag: "Property Market Updates", title: "Auckland vs Regional Yields: A 2025 Perspective", excerpt: "Why capital growth metrics are shifting and how investors are adapting their geographic focus." },
  { id: 6, tag: "Real Client Scenarios", title: "Navigating construction loans in a high-inflation environment", excerpt: "Mitigating cost-blowout risks through fixed-price contracts and progressive drawdown strategies." },
  { id: 7, tag: "Learning Hub", title: "Why your pre-approval might not mean what you think it means", excerpt: "The critical differences between automated bank approvals and fully verified lending limits." },
  { id: 8, tag: "First-Home Buyers", title: "The hidden costs of home ownership banks evaluate", excerpt: "Unallocated expenses that impact your servicing test rate behind the scenes." },
  { id: 9, tag: "Property Market Updates", title: "Debt-to-Income (DTI) restrictions: Preparation strategies", excerpt: "How new regulatory frameworks will change borrowing capacity for high-income households." }
];

export default function InsightsPage() {
  notFound(); // hidden — remove this line to re-enable
  return (
    <div data-cmp="InsightsPage" className="w-full flex flex-col bg-valar-fog min-h-screen">
      {/* Hero */}
      <section data-cmp="InsightsPage.Hero" className="bg-valar-navy text-white pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="h-[1px] w-12 bg-valar-amber mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Insights &amp; Perspectives</h1>
          <p className="text-xl font-light text-valar-lilac max-w-2xl border-l-2 border-valar-amber pl-4">
            Analysis, market updates, and strategic guidance from our advisory team.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section data-cmp="InsightsPage.Articles" className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 mb-8">
            <TabsTrigger data-cmp="InsightsPage.Articles.TabTrigger" value="all" className="data-[state=active]:bg-valar-navy data-[state=active]:text-white bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">All</TabsTrigger>
            <TabsTrigger data-cmp="InsightsPage.Articles.TabTrigger" value="market" className="data-[state=active]:bg-valar-navy data-[state=active]:text-white bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">Property Market Updates</TabsTrigger>
            <TabsTrigger data-cmp="InsightsPage.Articles.TabTrigger" value="scenarios" className="data-[state=active]:bg-valar-navy data-[state=active]:text-white bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">Real Client Scenarios</TabsTrigger>
            <TabsTrigger data-cmp="InsightsPage.Articles.TabTrigger" value="learning" className="data-[state=active]:bg-valar-navy data-[state=active]:text-white bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">Learning Hub</TabsTrigger>
            <TabsTrigger data-cmp="InsightsPage.Articles.TabTrigger" value="first-home" className="data-[state=active]:bg-valar-navy data-[state=active]:text-white bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">First-Home Buyers</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INSIGHTS_DATA.map((item) => (
            <article data-cmp="InsightsPage.Articles.ArticleCard" key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="p-8 flex flex-col h-full">
                <span className="text-xs font-bold uppercase tracking-wider text-valar-amber mb-4 block">{item.tag}</span>
                <h3 className="text-xl font-bold text-valar-navy mb-4 leading-snug group-hover:text-valar-indigo transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">
                  {item.excerpt}
                </p>
                <Link href={`/insights/${item.id}`} className="inline-flex items-center text-valar-navy font-semibold text-sm group-hover:text-valar-amber transition-colors mt-auto">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
