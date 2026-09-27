import React, { useState, useMemo } from 'react';
import {
  prefixToMaskNumber,
  prefixToMaskString,
  maskStringToPrefix,
  numberToIp,
  toBinaryDotted,
  isValidIPv4,
  calculateIPv4Details,
} from '../utils/ipv4';
import { ResultCard } from './ResultCard';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import { Binary, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const WildcardCalculator: React.FC = () => {
  const [prefix, setPrefix] = useState<number>(26);
  const [ip, setIp] = useState<string>('192.168.10.0');

  const subnetMask = prefixToMaskString(prefix);
  const maskNum = prefixToMaskNumber(prefix);
  const wildcardNum = (~maskNum) >>> 0;
  const wildcardMask = numberToIp(wildcardNum);

  const binaryMask = toBinaryDotted(maskNum);
  const binaryWildcard = toBinaryDotted(wildcardNum);

  const ciscoAclExample = `access-list 10 permit ${ip} ${wildcardMask}`;
  const ospfNetworkExample = `network ${ip} ${wildcardMask} area 0`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Binary className="w-5 h-5 text-blue-600" />
              <span>Wildcard Mask &amp; ACL Filter Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculate wildcard masks (inverse masks) used in Cisco Access Control Lists (ACLs), OSPF network statements, and route maps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Reference IP Address
            </label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.10.0"
              className="w-full px-3.5 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Prefix Length (/CIDR)
              </label>
              <span className="text-xs font-mono text-blue-600 font-semibold">
                /{prefix}
              </span>
            </div>
            <select
              value={prefix}
              onChange={(e) => setPrefix(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono bg-white"
            >
              {Array.from({ length: 33 }, (_, i) => (
                <option key={i} value={i}>
                  /{i} (Mask: {prefixToMaskString(i)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard
          label="Wildcard Mask (Inverse)"
          value={wildcardMask}
          tooltip="Calculated by subtracting each octet of the subnet mask from 255. 0 bits indicate 'must match', 1 bits indicate 'don't care'."
          highlight
        />
        <ResultCard
          label="Subnet Mask"
          value={subnetMask}
          tooltip="Standard dotted-decimal network mask."
        />
        <ResultCard
          label="Host Capacity"
          value={prefix === 31 ? '2 hosts' : prefix === 32 ? '1 host' : `${(Math.pow(2, 32 - prefix) - 2).toLocaleString()} usable hosts`}
          tooltip="Total usable endpoints filtered by this wildcard range."
        />
      </div>

      {/* Binary Inversion Visualization */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-sm border border-slate-800 space-y-3 font-mono text-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans mb-2">
          Binary Mask Inversion Logic
        </h3>

        <div>
          <div className="text-slate-400 text-2xs mb-0.5">
            Subnet Mask ({subnetMask} - /{prefix}):
          </div>
          <div className="p-2 bg-slate-800 rounded tracking-wider text-blue-400 select-all">
            {binaryMask}
          </div>
        </div>

        <div>
          <div className="text-slate-400 text-2xs mb-0.5">
            Wildcard Mask ({wildcardMask}):
          </div>
          <div className="p-2 bg-slate-800 rounded tracking-wider text-amber-400 select-all">
            {binaryWildcard}
          </div>
        </div>

        <p className="text-2xs text-slate-400 font-sans mt-2 pt-2 border-t border-slate-800">
          Rule: <strong>Subnet Mask + Wildcard Mask = 255.255.255.255</strong> in each corresponding octet.
        </p>
      </div>

      {/* Ready-to-paste CLI Commands */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Cisco CLI Configuration Examples
        </h3>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-2xs text-slate-400 font-sans block mb-0.5">Standard ACL Rule:</span>
              <span className="text-slate-800">{ciscoAclExample}</span>
            </div>
            <CopyButton text={ciscoAclExample} title="Copy ACL rule" />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-2xs text-slate-400 font-sans block mb-0.5">OSPF Network Statement:</span>
              <span className="text-slate-800">{ospfNetworkExample}</span>
            </div>
            <CopyButton text={ospfNetworkExample} title="Copy OSPF statement" />
          </div>
        </div>
      </div>
    </div>
  );
};
