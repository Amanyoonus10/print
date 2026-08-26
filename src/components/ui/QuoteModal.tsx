import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { servicesData } from '../../data/services';
import { companyData } from '../../data/company';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    defaultService ? [defaultService] : ['branding']
  );
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleService = (slug: string) => {
    if (selectedServices.includes(slug)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== slug));
      }
    } else {
      setSelectedServices([...selectedServices, slug]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleWhatsAppDirect = () => {
    const serviceTitles = servicesData
      .filter(s => selectedServices.includes(s.slug))
      .map(s => s.title)
      .join(', ');

    const message = `Hello FACE PRINTING SERVICES, I would like to request an estimate.%0A%0A*Name:* ${name || 'N/A'}%0A*Company:* ${company || 'N/A'}%0A*Services:* ${serviceTitles || 'General Inquiry'}%0A*Notes:* ${details || 'Please contact me.'}`;

    window.open(`https://wa.me/97433635098?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-gray-900"
          >
            {/* Top Cyan Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-[#38E1FF]" />

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00BCD4]" />
                  <span className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-semibold">
                    Instant Project Estimator
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                  REQUEST A PRODUCTION QUOTE
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Doha, Qatar • Fast Turnaround & Technical Precision
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Select Service Pillars */}
                  <div>
                    <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-2.5 font-bold">
                      1. Select Production Disciplines (Multi-Select)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {servicesData.map(service => {
                        const isSelected = selectedServices.includes(service.slug);
                        return (
                          <button
                            type="button"
                            key={service.slug}
                            onClick={() => toggleService(service.slug)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[64px] cursor-pointer ${
                              isSelected
                                ? 'bg-[#00BCD4]/10 border-[#00BCD4] text-[#0A0B0D] shadow-xs'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="font-mono text-[9px] text-[#008BA3] font-bold">
                              {service.number}
                            </span>
                            <span className="font-display font-bold text-xs uppercase leading-tight mt-1 truncate">
                              {service.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Nasser Al-Kuwari"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="e.g. Qatar Foundation / Ministry"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="hello@company.qa"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block font-mono text-xs text-gray-700 uppercase tracking-wider mb-1.5 font-semibold">
                      Project Requirements & Quantity
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder="Specify sizes, quantities, materials, installation locations in Doha..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#00BCD4] transition-colors resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-4 rounded-xl bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,188,212,0.35)] transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Estimate Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#00BCD4]/15 border border-[#00BCD4] flex items-center justify-center text-[#008BA3] shadow-md">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-extrabold text-2xl text-gray-900">
                    INQUIRY RECEIVED!
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md">
                    Thank you, <span className="text-gray-900 font-bold">{name || 'Client'}</span>. Our production team in Doha will review your specifications and get in touch within 2-4 hours.
                  </p>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 w-full max-w-md text-left text-xs font-mono text-gray-600 mt-2 space-y-1">
                    <p><span className="text-gray-900 font-bold">Direct Hotline:</span> {companyData.contact.phone}</p>
                    <p><span className="text-gray-900 font-bold">Email:</span> {companyData.contact.email}</p>
                    <p><span className="text-gray-900 font-bold">CR Number:</span> {companyData.contact.cr}</p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="px-6 py-3 rounded-xl bg-[#25D366] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat on WhatsApp Now
                    </button>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        onClose();
                      }}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-800 font-mono text-xs uppercase tracking-wider"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
