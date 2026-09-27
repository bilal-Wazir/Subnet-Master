import React from 'react';
import { FAQ } from '../components/FAQ';
import { AdSlot } from '../components/AdSlot';
import { HelpCircle } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Subnetting &amp; Networking FAQ
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Answers to frequently asked questions about IPv4/IPv6 subnetting, CIDR notation, subnet masks, wildcard masks, and route summarization.
        </p>
      </div>

      <FAQ />

      <AdSlot />
    </div>
  );
};
