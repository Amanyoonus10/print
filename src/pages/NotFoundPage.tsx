import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#FFFFFF]">
      <span className="font-mono text-base font-bold text-[#008BA3] mb-2">
        ERROR 404
      </span>
      <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-[#0A0B0D] tracking-tight uppercase">
        PAGE NOT FOUND
      </h1>
      <p className="text-gray-600 max-w-md mt-4 text-sm sm:text-base">
        The requested URL was not found on FACE PRINTING SERVICES website. Please return to the homepage or explore our services.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="px-6 py-3.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/services"
          className="px-6 py-3.5 rounded-full bg-gray-100 text-gray-800 font-mono text-xs uppercase tracking-wider border border-gray-200"
        >
          <span>View Services</span>
        </Link>
      </div>
    </div>
  );
};
