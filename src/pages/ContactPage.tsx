import React, { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { companyData } from '../data/company';
import { Phone, Mail, Globe, MapPin, Send, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Branding & Spatial',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const handleWhatsApp = () => {
    const text = `Hello FACE PRINTING SERVICES,%0A%0A*Name:* ${formData.name || 'N/A'}%0A*Company:* ${formData.company || 'N/A'}%0A*Service:* ${formData.service}%0A*Message:* ${formData.message || 'General Inquiry'}`;
    window.open(`https://wa.me/97433635098?text=${text}`, '_blank');
  };

  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 border-b border-gray-200">
        <SectionHeading
          number="15"
          tag="GET IN TOUCH"
          title="CONTACT & INQUIRIES."
          subtitle="Direct technical consultation, fast turnaround estimates, and dedicated production support in Doha, Qatar."
        />
      </section>

      {/* Main Grid: Left Credentials + Right Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Official Verified Credentials */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-gray-200 flex flex-col gap-6 shadow-xs">
              <h3 className="font-display font-extrabold text-2xl text-gray-900 uppercase">
                FACE PRINTING SERVICES
              </h3>

              <div className="flex flex-col gap-5 text-sm text-gray-700">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/10 border border-[#00BCD4]/25 flex items-center justify-center text-[#008BA3] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block">Location</span>
                    <span className="font-medium text-gray-900">{companyData.contact.location}</span>
                  </div>
                </div>

                {/* Office Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/10 border border-[#00BCD4]/25 flex items-center justify-center text-[#008BA3] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block">Office Telephone</span>
                    <a href="tel:+97441423938" className="font-mono font-bold text-gray-900 hover:text-[#008BA3] transition-colors">
                      {companyData.contact.officePhone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E] shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block">WhatsApp Direct</span>
                    <a href={companyData.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-gray-900 hover:text-[#128C7E] transition-colors">
                      {companyData.contact.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/10 border border-[#00BCD4]/25 flex items-center justify-center text-[#008BA3] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block">Official Email</span>
                    <a href={`mailto:${companyData.contact.email}`} className="font-mono text-gray-900 hover:text-[#008BA3] transition-colors">
                      {companyData.contact.email}
                    </a>
                  </div>
                </div>

                {/* Web */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/10 border border-[#00BCD4]/25 flex items-center justify-center text-[#008BA3] shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block">Website</span>
                    <span className="font-mono text-gray-900">{companyData.contact.website}</span>
                  </div>
                </div>
              </div>

              {/* CR Badge */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 mt-2">
                <ShieldCheck className="w-5 h-5 text-[#00BCD4] shrink-0" />
                <div>
                  <p className="font-mono text-xs text-gray-900 font-bold">
                    CR: {companyData.contact.cr}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    State of Qatar Certified Corporate Printer
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-lg">
              <h3 className="font-display font-extrabold text-2xl text-gray-900 uppercase mb-2">
                SEND A MESSAGE OR REQUEST SPECS
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-8">
                Our pre-press and estimation team will review your specs and respond promptly.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+974 7788 9257"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@domain.qa"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                      Primary Service Discipline
                    </label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                    >
                      <option value="01 — BRANDING">01 — BRANDING (Roll-ups, Walls, Canopies)</option>
                      <option value="02 — LIGHT BOX">02 — LIGHT BOX (Fabric SEG, Backlit Displays)</option>
                      <option value="03 — EVENTS">03 — EVENTS (Staging, Hoardings, Media Walls)</option>
                      <option value="04 — OFFSET PRINTING">04 — OFFSET PRINTING (Brochures, Stationery)</option>
                      <option value="05 — GIFT ITEMS">05 — GIFT ITEMS (VIP Boxes, Thermos, Notebooks)</option>
                      <option value="06 — ACRYLIC WORKS">06 — ACRYLIC WORKS (Awards, Signage, Plating)</option>
                      <option value="07 — UNIFORMS & SPORTS WEAR">07 — UNIFORMS & SPORTS WEAR (Boiler Suits, Polos)</option>
                      <option value="08 — VEHICLE WRAPPING">08 — VEHICLE WRAPPING (Buses, Fleet, Vans)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                      Message & Specifications *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your requirements, timelines, quantities..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,188,212,0.35)] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to FACE Team</span>
                  </button>
                </form>
              ) : (
                <div className="py-12 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#00BCD4]/15 border border-[#00BCD4] flex items-center justify-center text-[#008BA3] shadow-md">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-extrabold text-2xl text-gray-900">
                    MESSAGE DELIVERED!
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md">
                    Thank you, <span className="text-gray-900 font-bold">{formData.name}</span>. We have logged your request and our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-gray-100 text-gray-800 font-mono text-xs uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
