import React from 'react';
import { IPv6Calculator } from '../components/IPv6Calculator';
import { AdSlot } from '../components/AdSlot';
import { Globe, BookOpen } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const IPv6Page: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
          <Globe className="w-4 h-4" />
          <span>IPv6 Subnetting Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          IPv6 Subnet Calculator &amp; Address Analyzer
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Compute IPv6 subnet allocations from /0 to /128, RFC 5952 zero-compression, expanded notation, interface IDs, and large subnet ranges.
        </p>
      </div>

      <IPv6Calculator />

      <AdSlot />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Understanding IPv6 Subnetting
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Unlike IPv4 with variable host bit exhaustion, IPv6 reserves a standardized 64-bit boundary for local networks. A single site /48 allocation gives you 65,536 standard /64 subnets, and each /64 subnet contains 2^64 addresses.
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold text-indigo-600">
          <button
            type="button"
            onClick={() => onNavigate('/ipv6-subnetting-guide')}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read full IPv6 Subnetting Guide</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/eui64-calculator')}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Need MAC to IPv6 conversion? Try EUI-64 Calculator →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
