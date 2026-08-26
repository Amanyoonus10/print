import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#F7F4EE]">
      <span className="font-mono text-base font-bold text-[#7A1F2B] mb-2">
        ERROR 404
      </span>
      <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-[#171717] tracking-tight uppercase">
        PAGE NOT FOUND
      </h1>
      <p className="text-[#555555] max-w-md mt-4 text-sm sm:text-base">
        The requested URL was not found on FACE PRINTING SERVICES website. Please return to the homepage or explore our services.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="px-6 py-3.5 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(122,31,43,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/services"
          className="px-6 py-3.5 rounded-full bg-white hover:bg-[#EDE8DE] text-[#171717] font-mono text-xs uppercase tracking-wider border border-[#EDE8DE]"
        >
          <span>View Services</span>
        </Link>
      </div>
    </div>
  );
};
