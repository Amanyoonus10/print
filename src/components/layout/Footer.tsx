import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { companyData } from '../../data/company';
import { servicesData } from '../../data/services';
import { ArrowUpRight, Phone, Mail, Globe, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal }) => {
  const [dohaTime, setDohaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Qatar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setDohaTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#FFFFFF] text-gray-900 border-t border-gray-200 pt-20 pb-12 overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00BCD4]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Massive Editorial Callout */}
        <div className="pb-16 mb-16 border-b border-gray-200 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#008BA3] uppercase tracking-[0.25em] font-bold block mb-3">
              Ready to Stand Out in Qatar?
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-gray-900 tracking-tight uppercase leading-[1.02]">
              LET’S CRAFT SOMETHING <br />
              <span className="text-gradient-cyan">EXCEPTIONAL.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer group"
            >
              <span>Request An Estimate</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href="https://wa.me/97477889257"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-xs uppercase tracking-wider border border-gray-200 transition-all flex items-center gap-2 font-medium"
            >
              <span>WhatsApp Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-gray-200">
          {/* Col 1: Brand & Official Registration */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <BrandLogo size="md" showSubtitle={true} />
            
            <p className="text-sm text-gray-600 leading-relaxed pr-6">
              Full-service professional printing and branding company combining advanced technology, skilled designers, and expert craftsmanship in Doha, Qatar.
            </p>

            {/* Live Doha Time Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3 w-max">
              <Clock className="w-4 h-4 text-[#00BCD4] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Doha Time (AST - GMT+3)</span>
                <span className="text-xs font-mono font-bold text-gray-900">{dohaTime || 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: All 8 Service Pillars */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-bold">
              Production Pillars
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              {servicesData.map((service) => (
                <li key={service.slug}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(service.slug) || document.getElementById('services');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors flex items-center gap-2 group text-left cursor-pointer"
                  >
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#008BA3] font-bold">{service.number}</span>
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-bold">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => { const el = document.getElementById('hero-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { const el = document.getElementById('introduction'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => { const el = document.getElementById('services'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => { const el = document.getElementById('work'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => { const el = document.getElementById('clients'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Contact & Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info & Registration */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-bold">
              Doha Credentials
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                <span>{companyData.contact.location}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00BCD4] shrink-0" />
                <a href={`tel:${companyData.contact.phone.replace(/\s+/g, '')}`} className="hover:text-black font-mono text-xs font-semibold">
                  {companyData.contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00BCD4] shrink-0" />
                <a href={`mailto:${companyData.contact.email}`} className="hover:text-black font-mono text-xs">
                  {companyData.contact.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#00BCD4] shrink-0" />
                <span className="font-mono text-xs text-gray-900">{companyData.contact.website}</span>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="font-mono text-xs text-gray-700">
                  <span className="text-[#008BA3] font-bold">CR:</span> {companyData.contact.cr}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Trademark */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© {new Date().getFullYear()} FACE PRINTING SERVICES. All rights reserved.</p>
          <p>Doha, State of Qatar</p>
        </div>
      </div>
    </footer>
  );
};
