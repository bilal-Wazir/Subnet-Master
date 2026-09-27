import React from 'react';
import { BookOpen, HelpCircle, Network, Layers, Globe, CheckCircle2 } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface EducationalGuidesProps {
  initialTopic?: 'all' | 'ipv4' | 'ipv6' | 'vlsm' | 'supernet' | 'formulas';
}

export const EducationalGuides: React.FC<EducationalGuidesProps> = ({ initialTopic = 'all' }) => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Overview Intro */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">What is Subnetting?</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>Subnetting</strong> is the architectural practice of dividing a large physical or logical IP network into two or more smaller, distinct network segments called <em>subnets</em>. By subnetting, network engineers isolate broadcast traffic, enhance network security by enforcing perimeter boundaries, and efficiently conserve address space without wasting huge allocations.
        </p>
      </section>

      {/* Subnetting Formulas Cheat Sheet */}
      <section id="formulas" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Core Subnetting Mathematical Formulas</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Number of Subnets
            </span>
            <div className="font-mono text-base font-bold text-blue-700">
              2<sup>borrowed_bits</sup>
            </div>
            <p className="text-2xs text-slate-500 mt-1">
              Where borrowed_bits = (New Prefix − Original Prefix).
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Total Addresses per Subnet
            </span>
            <div className="font-mono text-base font-bold text-blue-700">
              2<sup>host_bits</sup>
            </div>
            <p className="text-2xs text-slate-500 mt-1">
              Where host_bits = (32 − Prefix Length).
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Usable Hosts (Traditional)
            </span>
            <div className="font-mono text-base font-bold text-blue-700">
              2<sup>host_bits</sup> − 2
            </div>
            <p className="text-2xs text-slate-500 mt-1">
              Subtracts 1 for Network Address and 1 for Broadcast Address.
            </p>
          </div>
        </div>

        {/* /31 and /32 Special Cases explanation */}
        <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
          <strong className="block text-sm font-semibold mb-1 text-blue-950">
            Crucial Exceptions: /31 and /32 Subnets
          </strong>
          <ul className="list-disc list-inside space-y-1.5 mt-1">
            <li>
              <strong>RFC 3021 /31 Subnets:</strong> Point-to-point links (such as router-to-router WAN connections) do not require a separate broadcast or network address. Therefore, a /31 subnet provides exactly <strong>2 usable host addresses</strong> (2 total, 2 usable), conserving billions of IPv4 addresses globally.
            </li>
            <li>
              <strong>/32 Host Routes:</strong> A /32 prefix has 0 host bits and represents a <strong>single specific device IP</strong> (often loopback interfaces or individual VPN clients). Total addresses = 1, usable hosts = 1.
            </li>
          </ul>
        </div>
      </section>

      {/* IPv4 Subnetting Explained */}
      <section id="ipv4-explained" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          <span>IPv4 Subnetting Explained</span>
        </h2>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            An IPv4 address consists of 32 binary bits divided into four 8-bit bytes (octets), written in dotted-decimal notation like <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900">192.168.1.1</code>. Every address is divided into two logical sections:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Network Bits:</strong> The leading high-order bits that specify which network the host belongs to (analogous to a postal ZIP code).
            </li>
            <li>
              <strong>Host Bits:</strong> The trailing low-order bits that uniquely designate the individual device or interface within that specific network.
            </li>
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-xs text-slate-900 block mb-1">
                Subnet Mask
              </span>
              <p className="text-xs text-slate-500">
                A 32-bit mask of contiguous binary 1s followed by contiguous 0s. The 1s mask out the network portion, while the 0s designate the host portion.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-xs text-slate-900 block mb-1">
                CIDR (Classless Inter-Domain Routing)
              </span>
              <p className="text-xs text-slate-500">
                A shorthand slash notation counting the continuous 1s in the mask. For instance, <code className="font-mono">255.255.255.0</code> has 24 ones, written as <code className="font-mono">/24</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-xs text-slate-900 block mb-1">
                Network Address
              </span>
              <p className="text-xs text-slate-500">
                The very first address in the block with all host bits set to 0. Used by routing tables to represent the entire subnet.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-xs text-slate-900 block mb-1">
                Broadcast Address
              </span>
              <p className="text-xs text-slate-500">
                The very last address in the block with all host bits set to 1. Packets addressed here are flooded to all subnet participants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IPv6 Subnetting Explained */}
      <section id="ipv6-explained" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span>IPv6 Subnetting Architecture</span>
        </h2>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            IPv6 replaces the 32-bit address space with 128 bits, written in hexadecimal notation grouped into 8 blocks of 16 bits. Subnetting IPv6 differs radically from IPv4:
          </p>
          <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-2 text-xs text-indigo-950">
            <div className="font-bold text-sm text-indigo-900">Standard IPv6 Allocation Hierarchy:</div>
            <div><strong>/32:</strong> Typical allocation from Regional Internet Registries (RIRs) to ISPs.</div>
            <div><strong>/48:</strong> Standard customer site allocation assigned by ISPs to an enterprise or campus. Provides <strong>65,536 distinct /64 subnets</strong>!</div>
            <div><strong>/56:</strong> Common allocation for small-to-medium offices or residential subscribers. Provides <strong>256 distinct /64 subnets</strong>.</div>
            <div><strong>/64:</strong> The universal standard subnet prefix for all end-user LANs and VLANs, strictly required for Stateless Address Autoconfiguration (SLAAC).</div>
          </div>
          <p className="text-xs text-slate-500">
            In an IPv6 /64 network, the upper 64 bits represent the <em>Global Routing Prefix + Subnet ID</em>, while the lower 64 bits represent the <em>Interface Identifier (IID)</em>. Each /64 subnet contains an astronomical 18.4 quintillion (<code className="font-mono">2^64</code>) addresses.
          </p>
        </div>
      </section>

      {/* VLSM Explained */}
      <section id="vlsm-explained" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          <span>What is VLSM (Variable Length Subnet Masking)?</span>
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Traditional Fixed-Length Subnet Masking (FLSM) forces all subnets in a major network to share the exact same mask size. This causes massive address wastage when one department needs 60 hosts while a point-to-point link only needs 2 hosts.
          </p>
          <p>
            <strong>VLSM</strong> allows an engineer to apply different prefix lengths to each individual subnet based on its actual host requirements.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <span className="font-semibold text-slate-900 block">The Golden Rule of VLSM:</span>
            <p className="text-slate-600">
              Always sort your subnet requirements in <strong>descending order of required hosts</strong> (largest to smallest) before allocating. This guarantees binary power-of-2 alignment and prevents unroutable address fragmentation.
            </p>
          </div>
        </div>
      </section>

      {/* Supernetting Explained */}
      <section id="supernetting-explained" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>What is Supernetting &amp; Route Summarization?</span>
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Supernetting</strong> (also known as CIDR aggregation or route summarization) is the reverse of subnetting. It combines multiple smaller, contiguous network prefixes into a single, broader routing table entry.
          </p>
          <p>
            By advertising one summarized route (e.g. <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900">192.168.0.0/22</code>) instead of four separate <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900">/24</code> routes, core routers reduce CPU load, lower RAM usage, and suppress routing flap oscillations across the internet backbone.
          </p>
        </div>
      </section>
    </div>
  );
};
