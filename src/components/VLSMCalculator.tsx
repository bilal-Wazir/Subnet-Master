import React, { useState, useMemo } from 'react';
import { calculateVLSM, VlsmRequirement, VlsmResult } from '../utils/vlsm';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Network,
  PieChart,
  ArrowDownUp,
  Download,
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

export const VLSMCalculator: React.FC = () => {
  const [parentCidr, setParentCidr] = useState('192.168.10.0/24');
  const [requirements, setRequirements] = useState<VlsmRequirement[]>([
    { id: '1', name: 'Sales', requiredHosts: 60 },
    { id: '2', name: 'HR', requiredHosts: 30 },
    { id: '3', name: 'IT', requiredHosts: 12 },
    { id: '4', name: 'Management', requiredHosts: 5 },
  ]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Calculation
  const { result, error } = useMemo<{ result: VlsmResult | null; error?: string }>(() => {
    try {
      const res = calculateVLSM(parentCidr, requirements);
      return { result: res };
    } catch (e: any) {
      return { result: null, error: e.message || 'Invalid calculation' };
    }
  }, [parentCidr, requirements]);

  const handleAddRequirement = () => {
    const nextNum = requirements.length + 1;
    setRequirements([
      ...requirements,
      {
        id: String(Date.now()),
        name: `Subnet ${nextNum}`,
        requiredHosts: 25,
      },
    ]);
  };

  const handleRemoveRequirement = (id: string) => {
    if (requirements.length <= 1) return;
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const handleUpdateRequirement = (id: string, field: 'name' | 'requiredHosts', value: any) => {
    setRequirements(
      requirements.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            [field]: field === 'requiredHosts' ? Math.max(1, parseInt(value, 10) || 1) : value,
          };
        }
        return r;
      })
    );
  };

  const handleApplyPreset = (cidr: string, reqs: { name: string; hosts: number }[]) => {
    setParentCidr(cidr);
    setRequirements(
      reqs.map((r, i) => ({
        id: String(i + 1),
        name: r.name,
        requiredHosts: r.hosts,
      }))
    );
  };

  const handleCopyTable = async () => {
    if (!result || !result.fits) return;
    const header = [
      'Subnet Name',
      'Required Hosts',
      'Allocated Hosts',
      'Network / CIDR',
      'Subnet Mask',
      'First Usable',
      'Last Usable',
      'Broadcast',
      'Efficiency',
    ];
    const rows = result.allocations.map((a) => [
      a.name,
      a.requiredHosts,
      a.allocatedHosts,
      a.cidr,
      a.subnetMask,
      a.firstUsable,
      a.lastUsable,
      a.broadcastAddress,
      `${a.efficiency}%`,
    ]);
    const tsv = [header.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    const ok = await copyToClipboard(tsv);
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
              <Network className="w-5 h-5 text-blue-600" />
              <span>Variable Length Subnet Mask (VLSM) Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Allocate subnets with variable mask sizes based on specific departmental host requirements without wasting IP space.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset('192.168.10.0/24', [
                  { name: 'Sales', hosts: 60 },
                  { name: 'HR', hosts: 30 },
                  { name: 'IT', hosts: 12 },
                  { name: 'Management', hosts: 5 },
                ])
              }
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Enterprise /24
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset('10.0.0.0/22', [
                  { name: 'Engineering', hosts: 400 },
                  { name: 'Support', hosts: 200 },
                  { name: 'Finance', hosts: 100 },
                  { name: 'Server Farm', hosts: 50 },
                  { name: 'WAN Links', hosts: 2 },
                ])
              }
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Campus /22
            </button>
          </div>
        </div>

        {/* Parent Network Input */}
        <div className="max-w-md mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Parent Major Network (CIDR)
          </label>
          <input
            type="text"
            value={parentCidr}
            onChange={(e) => setParentCidr(e.target.value)}
            placeholder="192.168.10.0/24"
            className="w-full px-3.5 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Requirements Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Subnet Requirements ({requirements.length})
              </span>
              <Tooltip content="SubnetMaster automatically sorts requirements from largest host count to smallest to guarantee binary alignment and avoid fragmentation." />
            </div>
            <button
              type="button"
              onClick={handleAddRequirement}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subnet Requirement</span>
            </button>
          </div>

          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div
                key={req.id}
                className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <span className="text-xs font-semibold text-slate-400 w-6 text-center">
                  #{index + 1}
                </span>

                <div className="flex-1">
                  <input
                    type="text"
                    value={req.name}
                    onChange={(e) => handleUpdateRequirement(req.id, 'name', e.target.value)}
                    placeholder="Department or Subnet Name"
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800"
                  />
                </div>

                <div className="w-40 sm:w-48">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={16777214}
                      value={req.requiredHosts}
                      onChange={(e) =>
                        handleUpdateRequirement(req.id, 'requiredHosts', e.target.value)
                      }
                      className="w-full px-2.5 py-1 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <span className="text-2xs text-slate-500 whitespace-nowrap">hosts</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(req.id)}
                  disabled={requirements.length <= 1}
                  className={`p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ${
                    requirements.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title="Remove requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error or Overflow Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 leading-relaxed font-medium">
            {error}
          </div>
        </div>
      )}

      {result && !result.fits && result.errorMessage && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 leading-relaxed">
            <span className="font-bold text-sm block mb-1 text-red-950">
              Address Space Overflow
            </span>
            {result.errorMessage}
          </div>
        </div>
      )}

      {/* VLSM Output Table */}
      {result && result.fits && (
        <div className="space-y-6">
          {/* Summary Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Parent Capacity
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {result.parentTotalAddresses.toLocaleString()} IPs
              </span>
              <span className="text-2xs text-slate-500 block mt-0.5 font-mono">
                {result.parentCidr}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Allocated Space
              </span>
              <span className="text-base font-bold text-blue-600 font-mono">
                {result.totalAllocatedAddresses.toLocaleString()} IPs
              </span>
              <span className="text-2xs text-slate-500 block mt-0.5">
                {result.utilizationPercentage}% Utilization
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Remaining Free Space
              </span>
              <span className="text-base font-bold text-emerald-600 font-mono">
                {result.totalUnallocatedAddresses.toLocaleString()} IPs
              </span>
              <span className="text-2xs text-slate-500 block mt-0.5">
                {100 - result.utilizationPercentage}% Unassigned
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Subnets Generated
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {result.allocations.length} Subnets
              </span>
              <span className="text-2xs text-slate-500 block mt-0.5">
                Optimal Bit Alignment
              </span>
            </div>
          </div>

          {/* Allocation Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Calculated VLSM Allocation (Sorted by Size)
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopyTable}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedSummary ? 'Table Copied!' : 'Copy VLSM Table'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Department / Name</th>
                    <th className="py-2.5 px-3 text-right">Required</th>
                    <th className="py-2.5 px-3 text-right">Usable</th>
                    <th className="py-2.5 px-3">Network / CIDR</th>
                    <th className="py-2.5 px-3">Subnet Mask</th>
                    <th className="py-2.5 px-3">Usable Range</th>
                    <th className="py-2.5 px-3">Broadcast</th>
                    <th className="py-2.5 px-3 text-right">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {result.allocations.map((a) => (
                    <tr key={a.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 whitespace-nowrap">
                        {a.name}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-sans">
                        {a.requiredHosts.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-blue-700 font-sans">
                        {a.allocatedHosts.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{a.cidr}</span>
                          <CopyButton text={a.cidr} title="Copy CIDR" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {a.subnetMask}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {a.firstUsable} – {a.lastUsable}
                          </span>
                          <CopyButton
                            text={`${a.firstUsable} - ${a.lastUsable}`}
                            title="Copy Host Range"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{a.broadcastAddress}</span>
                          <CopyButton text={a.broadcastAddress} title="Copy Broadcast" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans text-slate-700">
                        <span
                          className={`font-semibold ${
                            a.efficiency >= 75
                              ? 'text-emerald-700'
                              : a.efficiency >= 50
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {a.efficiency}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remaining Address Space Breakdown */}
          {result.remainingBlocks.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Remaining Available Address Space ({result.totalUnallocatedAddresses.toLocaleString()} IPs)</span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                The remaining contiguous address space can be allocated as the following maximal CIDR blocks without renumbering:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-xs">
                {result.remainingBlocks.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{b.cidr}</span>
                      <span className="text-2xs text-slate-500 font-sans block">
                        {b.firstIp} – {b.lastIp} ({b.totalAddresses} IPs)
                      </span>
                    </div>
                    <CopyButton text={b.cidr} title="Copy block" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
