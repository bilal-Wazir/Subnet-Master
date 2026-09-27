import React from 'react';
import { EUI64Calculator } from '../components/EUI64Calculator';
import { AdSlot } from '../components/AdSlot';
import { Cpu } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const EUI64Page: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>IPv6 SLAAC Autoconfiguration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Modified EUI-64 &amp; SLAAC Address Generator
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Transform 48-bit Ethernet MAC addresses into 64-bit IEEE Modified EUI-64 interface identifiers and full IPv6 link-local or global SLAAC addresses.
        </p>
      </div>

      <EUI64Calculator />

      <AdSlot />
    </div>
  );
};
