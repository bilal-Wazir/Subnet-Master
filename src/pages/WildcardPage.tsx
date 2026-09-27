import React from 'react';
import { WildcardCalculator } from '../components/WildcardCalculator';
import { AdSlot } from '../components/AdSlot';
import { Binary } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const WildcardPage: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          <Binary className="w-4 h-4" />
          <span>Access List &amp; Routing Filters</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Wildcard Mask Calculator
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Calculate inverse subnet masks for Cisco IOS ACLs, OSPF area statements, and BGP filter lists with bit-level validation.
        </p>
      </div>

      <WildcardCalculator />

      <AdSlot />
    </div>
  );
};
