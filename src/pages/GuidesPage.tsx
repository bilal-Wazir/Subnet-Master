import React from 'react';
import { EducationalGuides } from '../components/EducationalGuides';
import { AdSlot } from '../components/AdSlot';
import { BookOpen } from 'lucide-react';

interface GuidesPageProps {
  topic?: 'all' | 'ipv4' | 'ipv6' | 'vlsm' | 'supernet';
  onNavigate: (path: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ topic = 'all', onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Educational Reference &amp; Formulas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Comprehensive Subnetting, VLSM &amp; Supernetting Guide
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          In-depth explanations of CIDR, binary bit manipulation, host calculations, IPv6 prefix boundaries, and route aggregation for CCNA, CCNP, and network engineers.
        </p>
      </div>

      <EducationalGuides />

      <AdSlot />
    </div>
  );
};
