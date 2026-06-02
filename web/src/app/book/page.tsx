"use client";

import { CalendarDays } from "lucide-react";

export default function BookPage() {
  return (
    <div className="w-full flex flex-col bg-[#F6F7F9] min-h-screen">
      <section className="bg-[#061634] text-white pt-24 pb-32 px-4 md:px-6 relative">
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <CalendarDays className="w-12 h-12 text-[#E8A23A] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Book a Strategy Call</h1>
          <p className="text-xl font-light text-[#C8CBE3] leading-relaxed">
            Take the first step toward financial clarity. We offer a structured initial consultation to understand your position and map out potential pathways.
          </p>
        </div>
      </section>

      <section className="-mt-20 pb-24 px-4 md:px-6 relative z-20">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-100">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#061634] border-b pb-2">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input id="fullName" className="bg-[#F6F7F9] border border-gray-200 w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input id="email" type="email" className="bg-[#F6F7F9] border border-gray-200 w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input id="phone" type="tel" className="bg-[#F6F7F9] border border-gray-200 w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="preferredTime" className="text-sm font-semibold text-gray-700">Preferred Time to Call</label>
                    <select id="preferredTime" defaultValue="" required className="bg-[#F6F7F9] border border-gray-200 w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20">
                      <option value="" disabled>Select time preference</option>
                      <option value="morning">Morning (9am - 12pm)</option>
                      <option value="afternoon">Afternoon (1pm - 5pm)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#061634] border-b pb-2">Your Goals</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="primaryService" className="text-sm font-semibold text-gray-700">Primary Service Interest</label>
                    <select id="primaryService" defaultValue="" required className="bg-[#F6F7F9] border border-gray-200 w-full h-10 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20">
                      <option value="" disabled>What are you looking for?</option>
                      <option value="mortgage">Mortgage Advice</option>
                      <option value="planning">Financial Planning</option>
                      <option value="wealth">Wealth Management Plan</option>
                      <option value="property">Investment Property Advice</option>
                      <option value="business_loan">Small Business Loans</option>
                      <option value="business_advice">Business Advisory Services</option>
                      <option value="unsure">Not sure yet / General Strategy</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="situation" className="text-sm font-semibold text-gray-700">Current Situation &amp; Goals</label>
                    <textarea
                      id="situation"
                      placeholder="Tell us about your financial goals, current situation, and any specific questions you have..."
                      className="bg-[#F6F7F9] border border-gray-200 min-h-[150px] w-full p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#061634]/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-[#E8A23A] hover:bg-[#d4922e] text-[#061634] font-bold text-lg py-5 rounded-sm transition-colors shadow-sm">
                  Submit Inquiry
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  We&apos;ll be in touch within 1 business day to confirm your appointment.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
