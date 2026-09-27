import React, { useState } from 'react';
import { ToolTabs, MainTab, SubTabIPv4, SubTabIPv6 } from '../components/ToolTabs';
import { IPv4Calculator } from '../components/IPv4Calculator';
import { IPv6Calculator } from '../components/IPv6Calculator';
import { SupernetCalculator } from '../components/SupernetCalculator';
import { VLSMCalculator } from '../components/VLSMCalculator';
import { WildcardCalculator } from '../components/WildcardCalculator';
import { EUI64Calculator } from '../components/EUI64Calculator';
import { EducationalGuides } from '../components/EducationalGuides';
import { FAQ } from '../components/FAQ';
import { AdSlot } from '../components/AdSlot';
import { Network, Globe, Layers, ArrowRight, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface HomeProps {
  initialTab?: MainTab;
  initialSubTabIPv4?: SubTabIPv4;
  initialSubTabIPv6?: SubTabIPv6;
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  initialTab = 'ipv4',
  initialSubTabIPv4 = 'calculator',
  initialSubTabIPv6 = 'calculator',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>(initialTab);
  const [activeSubTabIPv4, setActiveSubTabIPv4] = useState<SubTabIPv4>(initialSubTabIPv4);
  const [activeSubTabIPv6, setActiveSubTabIPv6] = useState<SubTabIPv6>(initialSubTabIPv6);

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    if (tab === 'ipv4') onNavigate('/ipv4-subnet-calculator');
    else if (tab === 'ipv6') onNavigate('/ipv6-subnet-calculator');
    else if (tab === 'supernet') onNavigate('/supernet-calculator');
  };

  const handleSubTabIPv4Change = (sub: SubTabIPv4) => {
    setActiveSubTabIPv4(sub);
    if (sub === 'vlsm') onNavigate('/vlsm-calculator');
    else if (sub === 'wildcard') onNavigate('/wildcard-mask-calculator');
    else onNavigate('/ipv4-subnet-calculator');
  };

  const handleSubTabIPv6Change = (sub: SubTabIPv6) => {
    setActiveSubTabIPv6(sub);
    if (sub === 'eui64') onNavigate('/eui64-calculator');
    else onNavigate('/ipv6-subnet-calculator');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-10 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Complete IP Subnetting Calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Calculate IPv4 and IPv6 subnets, VLSM networks, and CIDR supernets quickly and accurately.
        </p>

        {/* Primary Hero Mode Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleTabChange('ipv4')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'ipv4'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>IPv4 Subnetting</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('ipv6')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'ipv6'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>IPv6 Subnetting</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('supernet')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'supernet'
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Supernetting</span>
          </button>
        </div>
      </section>

      {/* Main Interactive Tool Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <ToolTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeSubTabIPv4={activeSubTabIPv4}
          onSubTabIPv4Change={handleSubTabIPv4Change}
          activeSubTabIPv6={activeSubTabIPv6}
          onSubTabIPv6Change={handleSubTabIPv6Change}
        />

        <div className="mt-6">
          {activeTab === 'ipv4' && (
            <>
              {activeSubTabIPv4 === 'calculator' && <IPv4Calculator />}
              {activeSubTabIPv4 === 'vlsm' && <VLSMCalculator />}
              {activeSubTabIPv4 === 'wildcard' && <WildcardCalculator />}
            </>
          )}

          {activeTab === 'ipv6' && (
            <>
              {activeSubTabIPv6 === 'calculator' && <IPv6Calculator />}
              {activeSubTabIPv6 === 'eui64' && <EUI64Calculator />}
            </>
          )}

          {activeTab === 'supernet' && <SupernetCalculator />}
        </div>
      </section>

      {/* AdSense-friendly Reserved Slot */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdSlot />
      </div>

      {/* Three Feature Cards Below Hero / Tool */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: IPv4 */}
          <div
            onClick={() => handleTabChange('ipv4')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>IPv4 Subnetting &amp; VLSM</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subnet masks, usable hosts, VLSM allocation, wildcard masks, point-to-point /31 exceptions, and bit-level binary analysis.
            </p>
          </div>

          {/* Card 2: IPv6 */}
          <div
            onClick={() => handleTabChange('ipv6')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>IPv6 Subnetting &amp; EUI-64</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prefix calculations (/0 to /128), RFC 5952 address compression, subnet range generators, and Modified EUI-64 SLAAC interface IDs.
            </p>
          </div>

          {/* Card 3: Supernetting */}
          <div
            onClick={() => handleTabChange('supernet')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>Supernetting &amp; CIDR</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CIDR route aggregation, exact vs non-exact boundary verification, gap detection, and common bit analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Guides Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <EducationalGuides />
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <FAQ />
      </section>
    </div>
  );
};
