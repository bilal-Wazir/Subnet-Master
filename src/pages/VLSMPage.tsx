import React from 'react';
import { VLSMCalculator } from '../components/VLSMCalculator';
import { AdSlot } from '../components/AdSlot';
import { Network, BookOpen } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const VLSMPage: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" />
          <span>Variable Length Subnet Masking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          VLSM Calculator &amp; Address Space Optimizer
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter host requirements per department to generate an optimal VLSM design with automated descending sort, boundary alignment, and free-space tracking.
        </p>
      </div>

      <VLSMCalculator />

      <AdSlot />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Why VLSM Requires Descending Sort
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In binary subnetting, a block of size N must start at an address that is an exact multiple of N. If you allocate a small block (e.g. 4 addresses) before a large block (e.g. 64 addresses), the next address will not be a multiple of 64, forcing an awkward unassigned gap. By sorting from largest requirement to smallest, blocks align naturally without fragmentation.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/vlsm-guide')}
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read the full VLSM Design Tutorial</span>
        </button>
      </div>
    </div>
  );
};
