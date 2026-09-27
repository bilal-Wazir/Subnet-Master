import React from 'react';
import { Layers, Globe, Network, SlidersHorizontal, Cpu, Binary } from 'lucide-react';

export type MainTab = 'ipv4' | 'ipv6' | 'supernet';
export type SubTabIPv4 = 'calculator' | 'vlsm' | 'wildcard';
export type SubTabIPv6 = 'calculator' | 'eui64';

interface ToolTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  activeSubTabIPv4?: SubTabIPv4;
  onSubTabIPv4Change?: (subTab: SubTabIPv4) => void;
  activeSubTabIPv6?: SubTabIPv6;
  onSubTabIPv6Change?: (subTab: SubTabIPv6) => void;
}

export const ToolTabs: React.FC<ToolTabsProps> = ({
  activeTab,
  onTabChange,
  activeSubTabIPv4 = 'calculator',
  onSubTabIPv4Change,
  activeSubTabIPv6 = 'calculator',
  onSubTabIPv6Change,
}) => {
  return (
    <div className="w-full">
      {/* Primary Top Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 rounded-xl max-w-2xl mx-auto shadow-2xs">
        <button
          type="button"
          onClick={() => onTabChange('ipv4')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ipv4'
              ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-950/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Network className="w-4 h-4 text-blue-600 shrink-0" />
          <span>IPv4 Subnetting</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('ipv6')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ipv6'
              ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-950/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>IPv6 Subnetting</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('supernet')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'supernet'
              ? 'bg-white text-teal-700 shadow-xs ring-1 ring-slate-950/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Supernetting</span>
        </button>
      </div>

      {/* Secondary Context Tabs */}
      {activeTab === 'ipv4' && onSubTabIPv4Change && (
        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSubTabIPv4Change('calculator')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTabIPv4 === 'calculator'
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Subnet Calculator (Prefix / Hosts)</span>
          </button>
          <button
            type="button"
            onClick={() => onSubTabIPv4Change('vlsm')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTabIPv4 === 'vlsm'
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>VLSM Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => onSubTabIPv4Change('wildcard')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTabIPv4 === 'wildcard'
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Wildcard Mask</span>
          </button>
        </div>
      )}

      {activeTab === 'ipv6' && onSubTabIPv6Change && (
        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSubTabIPv6Change('calculator')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTabIPv6 === 'calculator'
                ? 'bg-indigo-100 text-indigo-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>IPv6 Subnet &amp; Address Analyzer</span>
          </button>
          <button
            type="button"
            onClick={() => onSubTabIPv6Change('eui64')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTabIPv6 === 'eui64'
                ? 'bg-indigo-100 text-indigo-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Modified EUI-64 &amp; SLAAC</span>
          </button>
        </div>
      )}
    </div>
  );
};
