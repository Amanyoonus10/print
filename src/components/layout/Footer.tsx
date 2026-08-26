import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { companyData } from '../../data/company';
import { servicesData } from '../../data/services';
import { ArrowUpRight, Phone, Mail, Globe, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal }) => {
  const [dohaTime, setDohaTime] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

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

  const scrollToSection = (targetId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#F7F4EE] text-[#171717] border-t border-[#EDE8DE] pt-20 pb-12 overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B8955A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Massive Editorial Callout */}
        <div className="pb-16 mb-16 border-b border-[#EDE8DE] flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#B8955A] uppercase tracking-[0.25em] font-bold block mb-3">
              Ready to Stand Out in Qatar?
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171717] tracking-tight uppercase leading-[1.02]">
              LET’S CRAFT SOMETHING <br />
              <span className="text-gradient-primary">EXCEPTIONAL.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="px-8 py-4 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(122,31,43,0.3)] cursor-pointer group"
            >
              <span>Request Quote</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href={companyData.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-white hover:bg-[#EDE8DE] text-[#171717] font-mono text-xs uppercase tracking-wider border border-[#EDE8DE] transition-all font-semibold shadow-xs"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* 4-Column Editorial Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#EDE8DE]">
          {/* Col 1: Identity & Doha Time */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <BrandLogo size="md" showSubtitle={true} />
            
            <p className="text-sm text-[#555555] leading-relaxed max-w-sm">
              {companyData.description.heroStatement}
            </p>

            {/* Live Doha Time Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE8DE] flex items-center gap-3 w-max shadow-xs">
              <Clock className="w-4 h-4 text-[#B8955A] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#B8955A] uppercase tracking-wider font-bold">Doha Time (AST - GMT+3)</span>
                <span className="text-xs font-mono font-bold text-[#171717]">{dohaTime || 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: All 8 Service Pillars */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#7A1F2B] uppercase tracking-widest font-bold">
              Production Pillars
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#555555]">
              {servicesData.map((service) => (
                <li key={service.slug}>
                  <button
                    onClick={() => {
                      navigate(`/services/${service.slug}`);
                    }}
                    className="hover:text-[#7A1F2B] transition-colors flex items-center gap-2 group text-left cursor-pointer"
                  >
                    <span className="text-[10px] font-mono text-[#B8955A] font-bold">{service.number}</span>
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#7A1F2B] uppercase tracking-widest font-bold">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#555555]">
              <li>
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('introduction')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('work')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('clients')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-[#7A1F2B] transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info & Registration */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs text-[#7A1F2B] uppercase tracking-widest font-bold">
              Doha Credentials
            </h4>
            <div className="flex flex-col gap-3 text-sm text-[#555555]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
                <span>{companyData.contact.location}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8955A] shrink-0" />
                <a href="tel:+97441423938" className="hover:text-[#7A1F2B] font-mono text-xs font-semibold">
                  Office: {companyData.contact.officePhone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#25D366] shrink-0" />
                <a href={companyData.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#128C7E] font-mono text-xs font-semibold text-[#171717]">
                  WhatsApp: {companyData.contact.whatsappFormatted}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8955A] shrink-0" />
                <a href={`mailto:${companyData.contact.email}`} className="hover:text-[#7A1F2B] font-mono text-xs">
                  {companyData.contact.email}
                </a>
              </div>

              <div className="pt-2 border-t border-[#EDE8DE]">
                <p className="font-mono text-xs text-[#171717]">
                  <span className="text-[#7A1F2B] font-bold">CR:</span> {companyData.contact.cr}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Trademark */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#777777]">
          <p>© {new Date().getFullYear()} FACE PRINTING SERVICES. All rights reserved.</p>
          <p>Doha, State of Qatar</p>
        </div>
      </div>
    </footer>
  );
};
