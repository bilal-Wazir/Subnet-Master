import React, { useState, useMemo } from 'react';
import {
  calculateIPv6Details,
  calculateIPv6Subnets,
  isValidIPv6,
  IPv6Details,
  IPv6SubnettingResult,
} from '../utils/ipv6';
import { ResultCard } from './ResultCard';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  ListFilter,
  Layers,
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

export const IPv6Calculator: React.FC = () => {
  const [ipInput, setIpInput] = useState('2001:db8:abcd::');
  const [parentPrefix, setParentPrefix] = useState<number>(48);
  const [newPrefix, setNewPrefix] = useState<number>(64);
  const [displayCount, setDisplayCount] = useState<number>(25);
  const [copiedList, setCopiedList] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleIpChange = (val: string) => {
    if (val.includes('/')) {
      const parts = val.split('/');
      setIpInput(parts[0].trim());
      const p = parseInt(parts[1].trim(), 10);
      if (!isNaN(p) && p >= 0 && p <= 128) {
        setParentPrefix(p);
        if (newPrefix < p) setNewPrefix(p);
      }
    } else {
      setIpInput(val);
    }
  };

  const isIpValid = isValidIPv6(ipInput.trim());

  // Details
  const details = useMemo<IPv6Details | null>(() => {
    if (!isIpValid) return null;
    try {
      return calculateIPv6Details(ipInput.trim(), parentPrefix);
    } catch {
      return null;
    }
  }, [ipInput, isIpValid, parentPrefix]);

  // Subnetting Result
  const subnetResult = useMemo<IPv6SubnettingResult | null>(() => {
    if (!isIpValid || newPrefix < parentPrefix) return null;
    try {
      return calculateIPv6Subnets(ipInput.trim(), parentPrefix, newPrefix, displayCount);
    } catch {
      return null;
    }
  }, [ipInput, isIpValid, parentPrefix, newPrefix, displayCount]);

  const handleCopySubnetList = async () => {
    if (!subnetResult) return;
    const text = subnetResult.generatedSubnets.join('\n');
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 1600);
    }
  };

  const handleCopyAnalysis = async () => {
    if (!details || !subnetResult) return;
    const text = [
      `IPv6 Address Analysis & Subnetting:`,
      `Original: ${details.raw}/${parentPrefix}`,
      `Compressed: ${details.compressed}/${parentPrefix}`,
      `Expanded: ${details.expanded}`,
      `Network Prefix: ${details.networkPrefix}/${parentPrefix}`,
      `Interface ID: ${details.interfaceId}`,
      `Address Type: ${details.addressType}`,
      `--- Subnet Division (/${parentPrefix} → /${newPrefix}) ---`,
      `Subnet Bits: ${subnetResult.subnetBits}`,
      `Number of Subnets: ${subnetResult.numberOfSubnetsFormatted}`,
      `Addresses per Subnet: ${subnetResult.addressesPerSubnetFormatted}`,
      `First Subnet: ${subnetResult.firstSubnet}`,
      `Last Subnet: ${subnetResult.lastSubnet}`,
    ].join('\n');

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1600);
    }
  };

  const handlePreset = (ip: string, p1: number, p2: number) => {
    setIpInput(ip);
    setParentPrefix(p1);
    setNewPrefix(p2);
  };

  return (
    <div className="space-y-6">
      {/* Input configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <span>IPv6 Subnet Calculator &amp; Address Analyzer</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyze IPv6 addresses, RFC 5952 compression, interface IDs, and calculate huge prefix allocations (/0 to /128).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handlePreset('2001:db8:abcd::', 48, 64)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              /48 → /64 (ISP to Site)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('2001:db8::', 32, 48)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              /32 → /48 (RIR Allocation)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('fe80::1', 64, 64)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              fe80::1 (Link-Local)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('2001:db8:abcd:1234::1', 64, 64)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Full Address Analysis
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              IPv6 Address or CIDR
            </label>
            <div className="relative">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="2001:db8:abcd::/48 or 2001:db8::1"
                className={`w-full px-3.5 py-2 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  !isIpValid
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-500'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {isIpValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            {!isIpValid && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a valid IPv6 address (e.g. 2001:db8:abcd:: or ::1).
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Parent Prefix Length
            </label>
            <select
              value={parentPrefix}
              onChange={(e) => {
                const p = parseInt(e.target.value, 10);
                setParentPrefix(p);
                if (newPrefix < p) setNewPrefix(p);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-mono bg-white"
            >
              {[0, 16, 24, 28, 32, 40, 48, 52, 56, 60, 64, 80, 96, 112, 120, 124, 126, 127, 128].map(
                (p) => (
                  <option key={p} value={p}>
                    /{p} {p === 48 ? '(Typical Site)' : p === 64 ? '(Standard Subnet)' : ''}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Subnet Prefix Length
            </label>
            <select
              value={newPrefix}
              onChange={(e) => setNewPrefix(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-mono bg-white"
            >
              {[16, 32, 48, 52, 56, 60, 64, 72, 80, 96, 112, 124, 126, 127, 128]
                .filter((p) => p >= parentPrefix)
                .map((p) => (
                  <option key={p} value={p}>
                    /{p} {p === 64 ? '(Standard SLAAC /64)' : ''}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quick Calculation Summary */}
        {subnetResult && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block text-2xs uppercase tracking-wider font-semibold">
                Subnet Bits
              </span>
              <span className="font-bold text-sm text-indigo-900 font-mono">
                {subnetResult.subnetBits} bits
              </span>
            </div>

            <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block text-2xs uppercase tracking-wider font-semibold">
                Number of /{newPrefix} Subnets
              </span>
              <span className="font-bold text-sm text-indigo-900 font-mono">
                {subnetResult.numberOfSubnetsFormatted}
              </span>
            </div>

            <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block text-2xs uppercase tracking-wider font-semibold">
                Addresses per Subnet
              </span>
              <span className="font-bold text-sm text-indigo-900 font-mono">
                {subnetResult.addressesPerSubnetFormatted}
              </span>
            </div>

            <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block text-2xs uppercase tracking-wider font-semibold">
                Address Type
              </span>
              <span className="font-semibold text-xs text-indigo-900 truncate block">
                {details?.addressType || 'IPv6'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Address Analysis Panel */}
      {details && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>IPv6 Address Structure Analysis</span>
              <Tooltip content="RFC 5952 standard compression rules: omit leading zeros, replace longest sequence of consecutive zero blocks with ::, lowercase hex." />
            </h3>

            <button
              type="button"
              onClick={handleCopyAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <span>{copiedSummary ? 'Copied Analysis!' : 'Copy Full Analysis'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Compressed Format (RFC 5952):</span>
                  <CopyButton text={details.compressed} title="Copy Compressed" />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs sm:text-sm font-semibold text-slate-900 select-all">
                  {details.compressed}/{parentPrefix}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Full Expanded (8 Hex Groups):</span>
                  <CopyButton text={details.expanded} title="Copy Expanded" />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 select-all overflow-x-auto">
                  {details.expanded}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Network Prefix:</span>
                  <CopyButton text={`${details.networkPrefix}/${parentPrefix}`} title="Copy Network Prefix" />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs sm:text-sm font-semibold text-indigo-700 select-all">
                  {details.networkPrefix}/{parentPrefix}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Interface ID (Lower 64-bit bits):</span>
                  <CopyButton text={details.interfaceId} title="Copy Interface ID" />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 select-all">
                  {details.interfaceId}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">Address Category:</span>
            <span className="font-semibold text-slate-800">{details.addressType}</span>
          </div>
        </div>
      )}

      {/* Subnet Calculation Range Generator */}
      {subnetResult && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Generated IPv6 /{newPrefix} Subnet Range
              </h3>
              <p className="text-2xs text-slate-500">
                Total Subnets: {subnetResult.numberOfSubnetsFormatted} (First: {subnetResult.firstSubnet} · Last: {subnetResult.lastSubnet})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                <span>Show:</span>
                <select
                  value={displayCount}
                  onChange={(e) => setDisplayCount(parseInt(e.target.value, 10))}
                  className="px-2 py-1 border border-slate-200 rounded text-xs bg-white font-medium focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCopySubnetList}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedList ? 'List Copied!' : 'Copy List'}</span>
              </button>
            </div>
          </div>

          {/* Boundaries summary */}
          <div className="p-3 bg-indigo-50/40 border-b border-indigo-100/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-500 font-sans text-2xs uppercase">First Subnet:</span>
              <span className="font-semibold text-slate-900">{subnetResult.firstSubnet}</span>
              <CopyButton text={subnetResult.firstSubnet} title="Copy first subnet" />
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-500 font-sans text-2xs uppercase">Last Subnet:</span>
              <span className="font-semibold text-slate-900">{subnetResult.lastSubnet}</span>
              <CopyButton text={subnetResult.lastSubnet} title="Copy last subnet" />
            </div>
          </div>

          {/* Subnet List */}
          <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs divide-y divide-slate-100">
            {subnetResult.generatedSubnets.map((sub, i) => (
              <div
                key={i}
                className="py-2 px-2 flex items-center justify-between hover:bg-slate-50 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-slate-400 font-sans text-2xs text-right font-medium">
                    #{i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{sub}</span>
                </div>
                <CopyButton text={sub} title="Copy subnet" />
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-sans">
            Displaying {subnetResult.generatedSubnets.length} of {subnetResult.numberOfSubnetsFormatted} subnets.
          </div>
        </div>
      )}
    </div>
  );
};
