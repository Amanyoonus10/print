import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { companyData } from '../../data/company';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'HOME', targetId: 'hero-section' },
    { name: 'STORY', targetId: 'introduction' },
    { name: 'SERVICES', targetId: 'services' },
    { name: 'WORK', targetId: 'work' },
    { name: 'CLIENTS', targetId: 'clients' },
    { name: 'CONTACT', targetId: 'contact' }
  ];

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 py-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.06)]'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <div
              onClick={() => scrollToSection('hero-section')}
              className="shrink-0 cursor-pointer"
            >
              <BrandLogo size="md" showSubtitle={true} />
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/90 border border-gray-200/80 backdrop-blur-md shadow-xs">
              {navLinks.map((link) => (
                <button
                  key={link.targetId}
                  onClick={() => scrollToSection(link.targetId)}
                  className="px-4 py-2 rounded-full font-mono text-xs tracking-[0.18em] transition-all duration-300 text-gray-600 hover:text-black hover:bg-white cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Right: Quick Quote CTA & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenQuoteModal}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer group"
              >
                <span>ESTIMATE PROJECT</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
                className="lg:hidden w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white text-gray-900 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between">
              <div onClick={() => { setMobileMenuOpen(false); scrollToSection('hero-section'); }} className="cursor-pointer">
                <BrandLogo size="md" showSubtitle={true} />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Mobile Menu"
                className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Links with Staggered Visual Reveal */}
            <div className="my-auto py-10 flex flex-col gap-4">
              <span className="font-mono text-xs text-[#00BCD4] uppercase tracking-widest font-semibold mb-2">
                Navigation
              </span>
              {navLinks.map((link, idx) => (
                <button
                  key={link.targetId}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection(link.targetId);
                  }}
                  className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight flex items-center justify-between py-2 border-b border-gray-100 transition-colors text-gray-800 hover:text-[#00BCD4] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-gray-400">0{idx + 1}</span>
                    <span>{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-[#00BCD4]" />
                </button>
              ))}
            </div>

            {/* Footer inside Mobile Drawer */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono text-gray-500">Doha, State of Qatar</span>
                <span className="text-sm font-semibold text-gray-900">{companyData.contact.phone}</span>
                <span className="text-xs font-mono text-[#00BCD4]">{companyData.contact.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider text-center"
                >
                  Request Quote
                </button>
                <a
                  href={`https://wa.me/97477889257`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
