import React, { useState } from 'react';
import { SubnetRow } from '../utils/subnetting';
import { CopyButton } from './CopyButton';
import { Table, Download, Search } from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

interface SubnetTableProps {
  subnets: SubnetRow[];
  totalSubnets: number;
  isTruncated: boolean;
  maxDisplayCount: number;
  cidr: string;
}

export const SubnetTable: React.FC<SubnetTableProps> = ({
  subnets,
  totalSubnets,
  isTruncated,
  maxDisplayCount,
  cidr,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const filtered = subnets.filter(
    (s) =>
      s.network.includes(searchTerm) ||
      s.firstHost.includes(searchTerm) ||
      s.lastHost.includes(searchTerm) ||
      s.broadcast.includes(searchTerm)
  );

  const handleCopyTable = async () => {
    const headers = ['Subnet #', 'Network Address', 'CIDR', 'First Usable', 'Last Usable', 'Broadcast', 'Usable Hosts'];
    const rows = filtered.map((s) => [
      s.index,
      s.network,
      s.cidr,
      s.firstHost,
      s.lastHost,
      s.broadcast,
      s.usableHosts,
    ]);
    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    const ok = await copyToClipboard(tsv);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1600);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs mt-6">
      {/* Header bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Generated Subnet Table ({totalSubnets.toLocaleString()} Total Subnets)
          </h3>
          {isTruncated && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Showing first {maxDisplayCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {subnets.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter subnets..."
                className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyTable}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedAll ? 'Table Copied!' : 'Copy Table'}</span>
          </button>
        </div>
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-16 text-center">#</th>
              <th className="py-2.5 px-3">Network</th>
              <th className="py-2.5 px-3">First Host</th>
              <th className="py-2.5 px-3">Last Host</th>
              <th className="py-2.5 px-3">Broadcast</th>
              <th className="py-2.5 px-3 text-right">Usable Hosts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                  No subnets matched your filter term.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.index} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2.5 px-3 text-center text-slate-400 font-sans font-medium">
                    {s.index}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{s.network}{s.cidr}</span>
                      <CopyButton text={`${s.network}${s.cidr}`} title="Copy Network" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{s.firstHost}</span>
                      <CopyButton text={s.firstHost} title="Copy First Host" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{s.lastHost}</span>
                      <CopyButton text={s.lastHost} title="Copy Last Host" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{s.broadcast}</span>
                      <CopyButton text={s.broadcast} title="Copy Broadcast" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 whitespace-nowrap font-sans font-medium">
                    {s.usableHosts.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isTruncated && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-sans">
          Displaying first {maxDisplayCount} of {totalSubnets.toLocaleString()} subnets to ensure high browser performance. All calculations remain mathematically exact.
        </div>
      )}
    </div>
  );
};
