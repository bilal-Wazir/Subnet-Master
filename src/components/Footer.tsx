import React from 'react';
import { Network, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-900 text-lg tracking-tight">SubnetMaster</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              IPv4, IPv6 Subnetting &amp; Supernetting Made Simple. Engineered for network professionals, CCNA/CCNP students, and sysadmins.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side Calculations. Zero Data Stored.</span>
            </div>
          </div>

          {/* Col 2: Calculation Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Calculators
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="/ipv4-subnet-calculator"
                  onClick={(e) => handleNav('/ipv4-subnet-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  IPv4 Subnet Calculator
                </a>
              </li>
              <li>
                <a
                  href="/ipv6-subnet-calculator"
                  onClick={(e) => handleNav('/ipv6-subnet-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  IPv6 Subnet Calculator
                </a>
              </li>
              <li>
                <a
                  href="/vlsm-calculator"
                  onClick={(e) => handleNav('/vlsm-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  VLSM Calculator
                </a>
              </li>
              <li>
                <a
                  href="/supernet-calculator"
                  onClick={(e) => handleNav('/supernet-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Supernet &amp; CIDR Aggregator
                </a>
              </li>
              <li>
                <a
                  href="/eui64-calculator"
                  onClick={(e) => handleNav('/eui64-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  EUI-64 MAC Converter
                </a>
              </li>
              <li>
                <a
                  href="/wildcard-mask-calculator"
                  onClick={(e) => handleNav('/wildcard-mask-calculator', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Wildcard Mask Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Educational Guides */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Guides &amp; Formulas
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="/subnetting-guide"
                  onClick={(e) => handleNav('/subnetting-guide', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  IPv4 Subnetting Explained
                </a>
              </li>
              <li>
                <a
                  href="/ipv6-subnetting-guide"
                  onClick={(e) => handleNav('/ipv6-subnetting-guide', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  IPv6 Subnetting &amp; Prefix Guide
                </a>
              </li>
              <li>
                <a
                  href="/vlsm-guide"
                  onClick={(e) => handleNav('/vlsm-guide', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  VLSM Design Tutorial
                </a>
              </li>
              <li>
                <a
                  href="/supernetting-guide"
                  onClick={(e) => handleNav('/supernetting-guide', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Route Summarization &amp; CIDR
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleNav('/faq', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNav('/about', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  About SubnetMaster
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNav('/contact', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact &amp; Feedback
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleNav('/privacy', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleNav('/terms', e)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SubnetMaster. Accurate RFC-compliant IP addressing tools.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for networking engineers and students.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
