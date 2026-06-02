"use client";

import { Linkedin, Instagram, Youtube, MapPin, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#061634] text-white pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="h-[1px] w-12 bg-[#E8A23A] mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl font-light text-[#C8CBE3] max-w-2xl border-l-2 border-[#E8A23A] pl-4">
            Reach out for general inquiries, media requests, or to begin a conversation about your financial future.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Form Side */}
            <div>
              <div className="bg-[#F6F7F9] p-8 md:p-10 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-[#061634] mb-6">Send a Message</h2>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-semibold text-[#061634]">First Name</label>
                      <input id="firstName" className="bg-white w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-semibold text-[#061634]">Last Name</label>
                      <input id="lastName" className="bg-white w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-[#061634]">Email Address</label>
                    <input id="email" type="email" className="bg-white w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-[#061634]">Phone Number</label>
                    <input id="phone" type="tel" className="bg-white w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-[#061634]">Subject</label>
                    <select id="subject" defaultValue="" className="bg-white w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20">
                      <option value="" disabled>Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="media">Media / Speaking</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="career">Careers</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-[#061634]">Message</label>
                    <textarea id="message" className="bg-white min-h-[120px] w-full p-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" />
                  </div>

                  <button type="submit" className="w-full bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] font-bold py-4 rounded-sm transition-colors mt-4">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Info Side */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#061634] mb-8 uppercase tracking-widest text-sm">Direct Contact</h3>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-[#E8A23A] mr-4 shrink-0" />
                    <div>
                      <p className="font-semibold text-[#061634] mb-1">Email</p>
                      <a href="mailto:hello@valar.co.nz" className="text-gray-600 hover:text-[#061634] transition-colors">hello@valar.co.nz</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-[#E8A23A] mr-4 shrink-0" />
                    <div>
                      <p className="font-semibold text-[#061634] mb-1">Office</p>
                      <p className="text-gray-600">Auckland, New Zealand<br />Meetings by appointment only.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <h3 className="font-bold text-[#061634] mb-6 uppercase tracking-widest text-sm">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 rounded bg-[#F6F7F9] border border-gray-100 flex items-center justify-center text-[#061634] hover:bg-[#061634] hover:text-[#E8A23A] transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded bg-[#F6F7F9] border border-gray-100 flex items-center justify-center text-[#061634] hover:bg-[#061634] hover:text-[#E8A23A] transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded bg-[#F6F7F9] border border-gray-100 flex items-center justify-center text-[#061634] hover:bg-[#061634] hover:text-[#E8A23A] transition-all">
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#2E4882] text-white p-8 rounded-xl mt-12">
                <h3 className="font-bold text-xl mb-4">Looking for financial advice?</h3>
                <p className="text-[#C8CBE3] text-sm mb-6 leading-relaxed">
                  If you are looking to discuss mortgages, wealth building, or business loans, please use our dedicated booking platform to schedule a strategy session.
                </p>
                <Link href="/book" className="inline-block bg-white text-[#061634] hover:bg-[#E8A23A] px-6 py-3 rounded-sm font-bold text-sm transition-colors">
                  Book Strategy Call
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
