import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only force scroll to top for new subpages (e.g. /services/branding, /work/...)
    // Allow homepage to restore previous scroll position smoothly
    if (pathname !== '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]);

  return null;
};
