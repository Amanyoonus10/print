import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { QuoteModal } from './components/ui/QuoteModal';
import { ContentProvider } from './context/ContentContext';
import { EditorToolbar } from './components/editor/EditorToolbar';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ClientsPage } from './pages/ClientsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const location = useLocation();

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

        {/* Main Content Viewport with Route Transition */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/about" element={<AboutPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/services" element={<ServicesPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/services/:slug" element={<ServiceDetailPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/work" element={<WorkPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/work/:slug" element={<ProjectDetailPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/clients" element={<ClientsPage onOpenQuoteModal={handleOpenQuote} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Global Editorial Footer */}
        <Footer onOpenQuoteModal={handleOpenQuote} />

        {/* Interactive Project Estimator / Quote Modal */}
        <QuoteModal isOpen={quoteModalOpen} onClose={handleCloseQuote} />

        {/* Global Section Content Management Toolbar */}
        <EditorToolbar />
      </div>
    </ContentProvider>
  );
}

export default App;

