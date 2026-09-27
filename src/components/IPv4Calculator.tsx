import React, { useState, useMemo } from 'react';
import {
  calculateIPv4Details,
  isValidIPv4,
  prefixToMaskString,
} from '../utils/ipv4';
import {
  calculateIPv4Subnets,
  calculatePrefixForRequiredHosts,
  IPv4SubnettingResult,
} from '../utils/subnetting';
import { ResultCard } from './ResultCard';
import { SubnetTable } from './SubnetTable';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';
import {
  Binary,
  Layers,
  Info,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Hash,
  Sliders,
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

export const IPv4Calculator: React.FC = () => {
  // Input states
  const [ipInput, setIpInput] = useState('192.168.10.0');
  const [parentPrefix, setParentPrefix] = useState<number>(24);
  const [subnettingMode, setSubnettingMode] = useState<'prefix' | 'hosts'>('prefix');
  const [desiredPrefix, setDesiredPrefix] = useState<number>(26);
  const [requiredHosts, setRequiredHosts] = useState<number>(50);
  const [showBinary, setShowBinary] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Parse combined CIDR if user typed e.g. "192.168.1.1/24" in the IP input
  const handleIpChange = (val: string) => {
    if (val.includes('/')) {
      const parts = val.split('/');
      setIpInput(parts[0].trim());
      const p = parseInt(parts[1].trim(), 10);
      if (!isNaN(p) && p >= 0 && p <= 32) {
        setParentPrefix(p);
        if (desiredPrefix < p) {
          setDesiredPrefix(p);
        }
      }
    } else {
      setIpInput(val);
    }
  };

  // Validation
  const isIpValid = isValidIPv4(ipInput.trim());

  // Mode B: Host calculation
  const hostCalc = useMemo(() => {
    if (requiredHosts <= 0 || isNaN(requiredHosts)) return null;
    try {
      return calculatePrefixForRequiredHosts(requiredHosts);
    } catch {
      return null;
    }
  }, [requiredHosts]);

  // Actual prefix to use for subnetting
  const activeSubnetPrefix = useMemo(() => {
    if (subnettingMode === 'prefix') {
      return Math.max(parentPrefix, Math.min(32, desiredPrefix));
    } else {
      return hostCalc ? hostCalc.prefix : parentPrefix;
    }
  }, [subnettingMode, desiredPrefix, parentPrefix, hostCalc]);

  // Details for the primary inspected network
  const singleDetails = useMemo(() => {
    if (!isIpValid) return null;
    try {
      return calculateIPv4Details(ipInput.trim(), activeSubnetPrefix);
    } catch (e: any) {
      return null;
    }
  }, [ipInput, isIpValid, activeSubnetPrefix]);

  // Subnetting list calculation
  const subnetResult = useMemo<IPv4SubnettingResult | null>(() => {
    if (!isIpValid) return null;
    if (activeSubnetPrefix < parentPrefix) return null;
    try {
      return calculateIPv4Subnets(
        ipInput.trim(),
        parentPrefix,
        activeSubnetPrefix,
        subnettingMode,
        requiredHosts,
        256
      );
    } catch (e: any) {
      return null;
    }
  }, [ipInput, isIpValid, parentPrefix, activeSubnetPrefix, subnettingMode, requiredHosts]);

  const handleCopyCompleteResult = async () => {
    if (!singleDetails) return;
    const summary = [
      `Network Address: ${singleDetails.networkAddress}`,
      `CIDR: ${singleDetails.cidr}`,
      `Subnet Mask: ${singleDetails.subnetMask}`,
      `Wildcard Mask: ${singleDetails.wildcardMask}`,
      `First Usable: ${singleDetails.firstUsable}`,
      `Last Usable: ${singleDetails.lastUsable}`,
      `Broadcast: ${singleDetails.broadcastAddress}`,
      `Total Addresses: ${singleDetails.totalAddresses.toLocaleString()}`,
      `Usable Hosts: ${singleDetails.usableHosts.toLocaleString()}`,
      `Host Bits: ${singleDetails.hostBits}`,
      `Address Class: ${singleDetails.ipClass} (${singleDetails.addressType})`,
      `Binary Mask: ${singleDetails.binaryMask}`,
    ].join('\n');

    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1600);
    }
  };

  const handlePreset = (ip: string, pPrefix: number, sPrefix: number, mode: 'prefix' | 'hosts' = 'prefix', hosts = 50) => {
    setIpInput(ip);
    setParentPrefix(pPrefix);
    setDesiredPrefix(sPrefix);
    setSubnettingMode(mode);
    setRequiredHosts(hosts);
  };

  return (
    <div className="space-y-6">
      {/* Input and Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              IPv4 Subnet Calculator &amp; Network Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter an IPv4 address with CIDR notation or separate prefix length (/0 to /32).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handlePreset('192.168.10.0', 24, 26, 'prefix')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              192.168.10.0/24 → /26
            </button>
            <button
              type="button"
              onClick={() => handlePreset('10.0.0.0', 8, 16, 'prefix')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              10.0.0.0/8 → /16
            </button>
            <button
              type="button"
              onClick={() => handlePreset('172.16.0.0', 16, 24, 'hosts', 50)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              50 Hosts / Subnet
            </button>
            <button
              type="button"
              onClick={() => handlePreset('192.168.1.0', 30, 31, 'prefix')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              /31 P2P Link
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* IP Input */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              IP Address or CIDR
            </label>
            <div className="relative">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="192.168.10.0 or 192.168.10.0/24"
                className={`w-full px-3.5 py-2 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  !isIpValid
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
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
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                Please enter a valid IPv4 address (e.g. 192.168.1.0).
              </p>
            )}
          </div>

          {/* Parent Prefix */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Parent Prefix
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {prefixToMaskString(parentPrefix)}
              </span>
            </div>
            <select
              value={parentPrefix}
              onChange={(e) => {
                const p = parseInt(e.target.value, 10);
                setParentPrefix(p);
                if (desiredPrefix < p) setDesiredPrefix(p);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono bg-white"
            >
              {Array.from({ length: 33 }, (_, i) => (
                <option key={i} value={i}>
                  /{i} ({prefixToMaskString(i)})
                </option>
              ))}
            </select>
          </div>

          {/* Subnetting Mode Selector */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Subnetting Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSubnettingMode('prefix')}
                className={`py-1.5 px-2 rounded-md transition-all cursor-pointer ${
                  subnettingMode === 'prefix'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prefix-Based
              </button>
              <button
                type="button"
                onClick={() => setSubnettingMode('hosts')}
                className={`py-1.5 px-2 rounded-md transition-all cursor-pointer ${
                  subnettingMode === 'hosts'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Host Requirement
              </button>
            </div>
          </div>
        </div>

        {/* Subnetting Mode Details */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subnettingMode === 'prefix' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Desired Subnet Prefix</span>
                  <Tooltip content="Choose the prefix length to subdivide into. Must be equal to or greater than the parent prefix." />
                </label>
                <span className="text-xs text-blue-600 font-mono font-medium">
                  /{desiredPrefix} ({prefixToMaskString(desiredPrefix)})
                </span>
              </div>
              <input
                type="range"
                min={parentPrefix}
                max={32}
                value={desiredPrefix}
                onChange={(e) => setDesiredPrefix(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-2xs text-slate-400 mt-1 font-mono">
                <span>Parent: /{parentPrefix}</span>
                <span>Subnet: /{desiredPrefix}</span>
                <span>Host: /32</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Required Usable Hosts per Subnet</span>
                  <Tooltip content="Enter the minimum number of client endpoints required. SubnetMaster computes the smallest valid power-of-2 subnet." />
                </label>
                {hostCalc && (
                  <span className="text-xs text-blue-600 font-mono font-medium">
                    Calculated: /{hostCalc.prefix} ({hostCalc.usableHosts} usable)
                  </span>
                )}
              </div>
              <input
                type="number"
                min={1}
                max={16777214}
                value={requiredHosts}
                onChange={(e) => setRequiredHosts(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-1.5 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
              />
              {hostCalc && (
                <div className="mt-1.5 flex items-center gap-2 text-2xs text-slate-600">
                  <span>Needed: <strong>{requiredHosts}</strong></span>
                  <span>·</span>
                  <span>Provides: <strong>{hostCalc.usableHosts}</strong> usable</span>
                  <span>·</span>
                  <span>Prefix: <strong className="font-mono">/{hostCalc.prefix}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Quick Subnet Count Stat */}
          {subnetResult && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block">
                  Subnet Division Result
                </span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {subnetResult.numberOfSubnets.toLocaleString()} Subnet{subnetResult.numberOfSubnets > 1 ? 's' : ''}
                </span>
                <span className="text-xs text-slate-600 block mt-0.5">
                  /{activeSubnetPrefix} ({subnetResult.usableHostsPerSubnet.toLocaleString()} usable hosts each)
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xs uppercase tracking-wider text-slate-500 font-semibold block">
                  Subnet Bits
                </span>
                <span className="text-base font-bold text-blue-600 font-mono">
                  2^{subnetResult.subnetBits}
                </span>
                <span className="text-2xs text-slate-500 block">
                  {subnetResult.subnetBits} borrowed bits
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Special Cases Notice if /31 or /32 */}
      {singleDetails?.isSpecialCase && singleDetails.specialCaseNote && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold block text-sm mb-0.5">
              Special IPv4 Case: {singleDetails.cidr}
            </span>
            {singleDetails.specialCaseNote}
          </div>
        </div>
      )}

      {/* Main Results Grid */}
      {singleDetails && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Subnet Calculation Results</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                {singleDetails.networkAddress}{singleDetails.cidr}
              </span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBinary(!showBinary)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  showBinary
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>{showBinary ? 'Hide Binary' : 'Show Binary'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCompleteResult}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <span>{copiedSummary ? 'Copied Summary!' : 'Copy Complete Result'}</span>
              </button>
            </div>
          </div>

          {/* Results Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <ResultCard
              label="Network Address"
              value={singleDetails.networkAddress}
              tooltip="The first address in the subnet block, representing the network identity."
              highlight
            />
            <ResultCard
              label="CIDR Prefix"
              value={singleDetails.cidr}
              tooltip="Classless Inter-Domain Routing prefix notation indicating the number of network bits."
            />
            <ResultCard
              label="Subnet Mask"
              value={singleDetails.subnetMask}
              tooltip="32-bit dotted-decimal number that separates the network portion from the host portion."
            />
            <ResultCard
              label="Wildcard Mask"
              value={singleDetails.wildcardMask}
              tooltip="The inverse of the subnet mask. Commonly used in Cisco ACLs and OSPF/EIGRP routing protocols."
            />
            <ResultCard
              label="Broadcast Address"
              value={singleDetails.broadcastAddress}
              tooltip="The last address in the subnet block, used to send traffic to all hosts simultaneously."
            />
            <ResultCard
              label="First Usable Host"
              value={singleDetails.firstUsable}
              tooltip="The first address assignable to a client device or router interface."
            />
            <ResultCard
              label="Last Usable Host"
              value={singleDetails.lastUsable}
              tooltip="The last address assignable to a client device or router interface."
            />
            <ResultCard
              label="Usable Hosts"
              value={singleDetails.usableHosts.toLocaleString()}
              tooltip="Total assignable client IP addresses. Traditionally calculated as 2^host_bits - 2."
              highlight
            />
            <ResultCard
              label="Total Addresses"
              value={singleDetails.totalAddresses.toLocaleString()}
              tooltip="Total IPv4 address space allocated to this subnet block (2^host_bits)."
            />
            <ResultCard
              label="Host Bits"
              value={`${singleDetails.hostBits} bits`}
              tooltip="Number of bits reserved for host addressing (32 minus prefix length)."
            />
            <ResultCard
              label="Network Class"
              value={singleDetails.ipClass}
              tooltip="Legacy classful category based on the first octet range."
              monospace={false}
            />
            <ResultCard
              label="Address Scope"
              value={singleDetails.addressType}
              tooltip="RFC designation (e.g. Private RFC 1918, Loopback, Carrier-Grade NAT, Public Internet)."
              monospace={false}
            />
          </div>

          {/* Binary Calculation View */}
          {showBinary && (
            <div className="mt-4 bg-slate-900 text-slate-100 rounded-xl p-4 shadow-sm border border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Binary Calculation Analysis (Bit-by-Bit Logic)
                  </span>
                </div>
                <CopyButton
                  text={`IP: ${singleDetails.binaryIp}\nMask: ${singleDetails.binaryMask}\nNet: ${singleDetails.binaryNetwork}`}
                  label="Copy Binary"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                />
              </div>

              <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                <div>
                  <div className="text-slate-400 text-2xs mb-0.5">IP Address ({singleDetails.ip}):</div>
                  <div className="p-2 bg-slate-800/80 rounded tracking-wider text-slate-200 select-all overflow-x-auto">
                    {singleDetails.binaryIp}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-2xs mb-0.5">
                    Subnet Mask ({singleDetails.subnetMask} - /{singleDetails.prefix}):
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded tracking-wider text-blue-400 select-all overflow-x-auto">
                    {singleDetails.binaryMask}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-2xs mb-0.5">
                    Logical Bitwise AND (IP &amp; Mask = Network {singleDetails.networkAddress}):
                  </div>
                  <div className="p-2 bg-blue-950/80 border border-blue-800 rounded tracking-wider text-emerald-400 select-all overflow-x-auto">
                    {singleDetails.binaryNetwork}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-2xs mb-0.5">
                    Wildcard Mask (Inverse of Subnet Mask {singleDetails.wildcardMask}):
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded tracking-wider text-amber-400 select-all overflow-x-auto">
                    {singleDetails.binaryWildcard}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-2xs text-slate-400 flex items-center justify-between">
                <span>
                  Prefix <strong className="text-blue-400">/{singleDetails.prefix}</strong> = First{' '}
                  {singleDetails.prefix} bits are Network portion; remaining {singleDetails.hostBits} bits are Host portion.
                </span>
              </div>
            </div>
          )}

          {/* Subnet Table */}
          {subnetResult && subnetResult.subnets.length > 0 && (
            <SubnetTable
              subnets={subnetResult.subnets}
              totalSubnets={subnetResult.numberOfSubnets}
              isTruncated={subnetResult.totalRowsTruncated}
              maxDisplayCount={subnetResult.maxDisplayCount}
              cidr={subnetResult.parentDetails.cidr}
            />
          )}
        </div>
      )}
    </div>
  );
};
