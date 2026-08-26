import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { QuoteModal } from './components/ui/QuoteModal';
import { ContentProvider } from './context/ContentContext';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const handleOpenQuote = () => {
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
  };

  return (
    <ContentProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0A0B0D] relative">
        <ScrollToTop />
        
        {/* Sticky Global Navigation */}
        <Navbar onOpenQuoteModal={handleOpenQuote} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/services" element={<ServicesPage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/services/:slug" element={<ServiceDetailPage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/work" element={<WorkPage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/work/:slug" element={<ProjectDetailPage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/about" element={<AboutPage onOpenQuoteModal={handleOpenQuote} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
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

