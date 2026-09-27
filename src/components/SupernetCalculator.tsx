import React, { useState, useMemo } from 'react';
import { calculateSupernet, SupernetResult } from '../utils/supernetting';
import { ResultCard } from './ResultCard';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Binary,
  ArrowRight,
  Info,
  Download,
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

export const SupernetCalculator: React.FC = () => {
  const [inputText, setInputText] = useState(
    '192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24'
  );
  const [showBinary, setShowBinary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const { result, error } = useMemo<{ result: SupernetResult | null; error?: string }>(() => {
    try {
      const lines = inputText.split('\n');
      const res = calculateSupernet(lines);
      return { result: res };
    } catch (e: any) {
      return { result: null, error: e.message || 'Invalid supernet input' };
    }
  }, [inputText]);

  const handleApplyPreset = (lines: string[]) => {
    setInputText(lines.join('\n'));
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const text = [
      `Supernetting / CIDR Aggregation Result:`,
      `Aggregated CIDR: ${result.aggregatedCidr}`,
      `Subnet Mask: ${result.subnetMask}`,
      `Wildcard Mask: ${result.wildcardMask}`,
      `Address Range: ${result.firstAddress} – ${result.lastAddress}`,
      `Total Addresses: ${result.totalAddresses.toLocaleString()}`,
      `Exact Representation: ${result.isExact ? 'YES' : 'NO'}`,
      `Extra Addresses: ${result.extraAddresses.toLocaleString()}`,
      `Status: ${result.explanation}`,
    ].join('\n');

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>IP Supernetting &amp; CIDR Route Aggregator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Combine multiple contiguous or related IPv4 subnets into a single summarized routing prefix. Checks exact boundary containment.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset([
                  '192.168.0.0/24',
                  '192.168.1.0/24',
                  '192.168.2.0/24',
                  '192.168.3.0/24',
                ])
              }
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Exact 4× /24 → /22
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset([
                  '192.168.0.0/24',
                  '192.168.1.0/24',
                  '192.168.2.0/24',
                ])
              }
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Non-Exact 3× /24 (Gap)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset([
                  '10.1.0.0/16',
                  '10.2.0.0/16',
                  '10.3.0.0/16',
                ])
              }
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Class A 3× /16
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Enter Networks to Summarize (One Per Line)</span>
            <span className="text-slate-400 font-normal">e.g. 192.168.0.0/24</span>
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="192.168.0.0/24&#10;192.168.1.0/24&#10;192.168.2.0/24&#10;192.168.3.0/24"
            className="w-full p-3 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 bg-white"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 leading-relaxed font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Exactness Callout Banner */}
          <div
            className={`rounded-xl p-4 border flex items-start gap-3 ${
              result.isExact
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            {result.isExact ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-sm block mb-0.5">
                {result.isExact
                  ? 'Exact CIDR Representation'
                  : 'Incomplete / Non-Exact Supernet'}
              </span>
              <p>{result.explanation}</p>
              {!result.isExact && result.extraBlocks.length > 0 && (
                <div className="mt-2 text-2xs font-mono">
                  Additional unused subnets enclosed within aggregate:{' '}
                  <strong>{result.extraBlocks.join(', ')}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Aggregated Supernet Details
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBinary(!showBinary)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  showBinary
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>{showBinary ? 'Hide Binary Analysis' : 'Show Binary Analysis'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <ResultCard
              label="Aggregated CIDR"
              value={result.aggregatedCidr}
              tooltip="The smallest single CIDR supernet block covering all input subnets."
              highlight
            />
            <ResultCard
              label="Common Prefix Length"
              value={`/${result.aggregatedPrefix}`}
              tooltip="Number of identical leading high-order bits shared across all input networks."
            />
            <ResultCard
              label="Supernet Mask"
              value={result.subnetMask}
              tooltip="Dotted-decimal subnet mask representing the summarized routing prefix."
            />
            <ResultCard
              label="Wildcard Mask"
              value={result.wildcardMask}
              tooltip="Inverted mask used in route summarization filters and Cisco ACLs."
            />
            <ResultCard
              label="First Address"
              value={result.firstAddress}
              tooltip="Lowest IP address contained within the aggregated supernet block."
            />
            <ResultCard
              label="Last Address"
              value={result.lastAddress}
              tooltip="Highest IP address contained within the aggregated supernet block."
            />
            <ResultCard
              label="Total Enclosed IPs"
              value={result.totalAddresses.toLocaleString()}
              tooltip="Total IPv4 address capacity of the containing / prefix."
              highlight
            />
            <ResultCard
              label="Input Networks Total"
              value={result.inputTotalAddresses.toLocaleString()}
              tooltip="Sum of IP addresses in your provided input subnets."
            />
          </div>

          {/* Binary Analysis View */}
          {showBinary && (
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-sm border border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Binary Analysis &amp; Common Prefix Alignment
                  </span>
                </div>
                <span className="text-xs text-teal-400 font-mono">
                  {result.commonPrefixBits} Common Bits (/{result.aggregatedPrefix})
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 font-sans">
                Notice how the first <strong>{result.commonPrefixBits} bits</strong> (highlighted in teal) are identical across all entered networks. The bit divergence at position {result.commonPrefixBits + 1} determines the supernet boundary.
              </p>

              <div className="space-y-2 font-mono text-xs overflow-x-auto">
                {result.inputNetworks.map((net, i) => (
                  <div key={i} className="p-2 bg-slate-800/70 rounded flex items-center justify-between gap-4">
                    <span className="w-36 text-slate-300 shrink-0">{net.raw}:</span>
                    <span className="tracking-widest">
                      <span className="text-teal-400 font-bold">
                        {net.binaryNetwork.slice(0, result.commonPrefixBits + Math.floor(result.commonPrefixBits / 8))}
                      </span>
                      <span className="text-slate-500">
                        {net.binaryNetwork.slice(result.commonPrefixBits + Math.floor(result.commonPrefixBits / 8))}
                      </span>
                    </span>
                  </div>
                ))}

                <div className="mt-2 pt-2 border-t border-slate-800 p-2 bg-teal-950/60 border border-teal-800 rounded flex items-center justify-between gap-4">
                  <span className="w-36 text-teal-300 font-semibold shrink-0">
                    Aggregated Mask:
                  </span>
                  <span className="tracking-widest text-teal-300 font-bold">
                    {result.binaryAggregatedMask}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Input Networks Inspection Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Input Networks Evaluated ({result.inputNetworks.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Network Input</th>
                    <th className="py-2.5 px-3">Network Address</th>
                    <th className="py-2.5 px-3">Prefix</th>
                    <th className="py-2.5 px-3 text-right">Address Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {result.inputNetworks.map((net, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{net.raw}</td>
                      <td className="py-2 px-3 text-slate-700">{net.networkAddress}</td>
                      <td className="py-2 px-3 text-slate-700">/{net.prefix}</td>
                      <td className="py-2 px-3 text-right text-slate-700 font-sans">
                        {net.totalAddresses.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
