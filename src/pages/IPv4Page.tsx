import React from 'react';
import { IPv4Calculator } from '../components/IPv4Calculator';
import { AdSlot } from '../components/AdSlot';
import { Network, BookOpen } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const IPv4Page: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" />
          <span>IPv4 Subnetting Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          IPv4 Subnet Calculator &amp; CIDR Inspector
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Compute network boundaries, broadcast addresses, usable host ranges, wildcard masks, and binary bit masks for prefixes from /0 to /32.
        </p>
      </div>

      <IPv4Calculator />

      <AdSlot />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          How IPv4 Subnetting Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          IPv4 addresses contain 32 bits, divided by a subnet mask into a network portion and a host portion. When you subnet a network (e.g. dividing a /24 into multiple /26 subnets), you borrow bits from the host portion. Each borrowed bit doubles the number of subnets available while halving the host capacity per subnet.
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold text-blue-600">
          <button
            type="button"
            onClick={() => onNavigate('/subnetting-guide')}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read full IPv4 Subnetting Guide</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/vlsm-calculator')}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Need variable subnet sizes? Try VLSM Calculator →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
