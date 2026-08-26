import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { QuoteModal } from './components/ui/QuoteModal';
import { ContentProvider } from './context/ContentContext';
import { HomePage } from './pages/HomePage';

export function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const location = useLocation();

  const handleOpenQuote = () => {
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
  };

  // Smoothly scroll to section if a sub-route was visited (e.g. /services -> #services)
  useEffect(() => {
    const path = location.pathname.replace('/', '').toLowerCase();
    if (path) {
      let targetId = path;
      if (path.startsWith('service')) targetId = 'services';
      if (path.startsWith('about')) targetId = 'introduction';
      if (path.startsWith('work')) targetId = 'work';
      if (path.startsWith('client')) targetId = 'clients';
      if (path.startsWith('contact')) targetId = 'contact';

      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <ContentProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0A0B0D] relative">
        <ScrollToTop />
        
        {/* Sticky Global Navigation */}
        <Navbar onOpenQuoteModal={handleOpenQuote} />

        {/* Main Single-Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="*" element={<HomePage onOpenQuoteModal={handleOpenQuote} />} />
          </Routes>
        </main>

        {/* Global Editorial Footer */}
        <Footer onOpenQuoteModal={handleOpenQuote} />

        {/* Interactive Project Estimator / Quote Modal */}
        <QuoteModal isOpen={quoteModalOpen} onClose={handleCloseQuote} />
      </div>
    </ContentProvider>
  );
}

export default App;

