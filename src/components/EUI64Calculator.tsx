import React, { useState, useMemo } from 'react';
import { macToEui64, Eui64Result } from '../utils/eui64';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import { Cpu, CheckCircle2, AlertCircle, ArrowRight, Layers } from 'lucide-react';

export const EUI64Calculator: React.FC = () => {
  const [macInput, setMacInput] = useState('00:1A:2B:3C:4D:5E');
  const [prefixInput, setPrefixInput] = useState('2001:db8:1:1::/64');

  const { result, error } = useMemo<{ result: Eui64Result | null; error?: string }>(() => {
    try {
      const res = macToEui64(macInput, prefixInput);
      return { result: res };
    } catch (e: any) {
      return { result: null, error: e.message || 'Invalid MAC or Prefix input' };
    }
  }, [macInput, prefixInput]);

  const handlePreset = (mac: string, prefix: string) => {
    setMacInput(mac);
    setPrefixInput(prefix);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Modified EUI-64 &amp; SLAAC Interface Identifier Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Convert 48-bit IEEE MAC addresses into 64-bit Modified EUI-64 interface identifiers and generate full IPv6 Stateless Address Autoconfiguration (SLAAC) host addresses.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handlePreset('00:1A:2B:3C:4D:5E', '2001:db8:1:1::/64')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Standard RFC 4291
            </button>
            <button
              type="button"
              onClick={() => handlePreset('b8:27:eb:12:34:56', '2001:db8:cafe:1::/64')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Raspberry Pi MAC
            </button>
            <button
              type="button"
              onClick={() => handlePreset('0050.56a1.2b3c', '2001:db8:ffff:100::/64')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Cisco Dotted MAC
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              48-bit MAC Address
            </label>
            <input
              type="text"
              value={macInput}
              onChange={(e) => setMacInput(e.target.value)}
              placeholder="00:1A:2B:3C:4D:5E or 001a.2b3c.4d5e"
              className="w-full px-3.5 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
            />
            <p className="text-2xs text-slate-500 mt-1">
              Supports colon (:), hyphen (-), dot (.), or plain hexadecimal formats.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>IPv6 /64 Prefix (Optional)</span>
                <Tooltip content="Enter a /64 prefix to combine with the EUI-64 identifier to generate the full SLAAC IPv6 host address." />
              </label>
              <span className="text-2xs text-slate-400">For SLAAC Autoconfig</span>
            </div>
            <input
              type="text"
              value={prefixInput}
              onChange={(e) => setPrefixInput(e.target.value)}
              placeholder="2001:db8:1:1::/64"
              className="w-full px-3.5 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
            />
            <p className="text-2xs text-slate-500 mt-1">
              Leave blank if you only require the 64-bit Interface Identifier.
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 leading-relaxed font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modified EUI-64 */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold uppercase tracking-wider text-slate-600">
                  Modified EUI-64 Interface ID
                </span>
                <CopyButton text={result.eui64} title="Copy EUI-64" />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg font-mono text-base font-bold text-slate-900 select-all border border-slate-200">
                {result.eui64}
              </div>
              <div className="mt-2 text-2xs text-slate-500 flex items-center justify-between">
                <span>Normalized MAC: {result.macNormalized}</span>
                <span>Bit 7 Inverted ({result.originalByte0} → {result.invertedByte0})</span>
              </div>
            </div>

            {/* Full IPv6 Address */}
            <div className="p-4 bg-white rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-indigo-700 mb-1.5">
                <span className="font-semibold uppercase tracking-wider">
                  Full IPv6 SLAAC Host Address
                </span>
                {result.fullIpv6Address && (
                  <CopyButton text={result.fullIpv6Address} title="Copy full IPv6" />
                )}
              </div>
              <div className="p-3 bg-white rounded-lg font-mono text-base font-bold text-indigo-900 select-all border border-indigo-200">
                {result.fullIpv6Address || 'Enter /64 prefix above to generate'}
              </div>
              <div className="mt-2 text-2xs text-slate-500">
                Stateless Address Autoconfiguration (SLAAC) compliant RFC 4862.
              </div>
            </div>
          </div>

          {/* Step-by-Step Educational Logic Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Step-by-Step EUI-64 Conversion Algorithm (RFC 4291)</span>
            </h3>

            <div className="space-y-2.5 font-mono text-xs text-slate-700">
              {result.stepExplanation.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  {step}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-sans leading-relaxed">
              <strong>Why invert bit 7 (Universal/Local bit)?</strong> In IEEE 802 MAC addresses, bit 7 of the first byte is 0 for globally unique OUI assignments and 1 for locally administered addresses. In IPv6 EUI-64 format, this bit was inverted so that globally unique addresses would have a 1 in this bit position, making manually configured local identifiers with 0s more intuitive.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
