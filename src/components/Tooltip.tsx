import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        className="ml-1 text-slate-400 hover:text-blue-600 cursor-help transition-colors inline-flex items-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="What is this?"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {isOpen && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded-md shadow-lg z-50 pointer-events-none leading-relaxed font-normal normal-case border border-slate-700"
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
      {children}
    </span>
  );
};
