import React from 'react';
import { SupernetCalculator } from '../components/SupernetCalculator';
import { AdSlot } from '../components/AdSlot';
import { Layers, BookOpen } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const SupernetPage: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>CIDR Route Aggregation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Supernet Calculator &amp; Route Summarizer
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Aggregate multiple IPv4 networks into the smallest containing CIDR prefix. Accurately identifies exact matches versus incomplete supernets with extra address space.
        </p>
      </div>

      <SupernetCalculator />

      <AdSlot />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Exact vs Non-Exact CIDR Aggregation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For a group of subnets to form an exact supernet, the count of contiguous networks must be a power of 2, and the first network must align with the supernet boundary. If you aggregate three /24 networks (e.g. 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24), the smallest containing CIDR block is 192.168.0.0/22, which inherently encloses 192.168.3.0/24. SubnetMaster explicitly highlights this distinction to prevent routing blackholes.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/supernetting-guide')}
          className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read the Supernetting &amp; Route Summarization Guide</span>
        </button>
      </div>
    </div>
  );
};
