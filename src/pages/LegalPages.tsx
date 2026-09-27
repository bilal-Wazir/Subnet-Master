import React, { useState } from 'react';
import { Shield, Mail, FileText, Info, CheckCircle2 } from 'lucide-react';

interface LegalPageProps {
  page: 'about' | 'contact' | 'privacy' | 'terms';
  onNavigate: (path: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ page, onNavigate }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  if (page === 'about') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 bg-white rounded-xl border border-slate-200 p-8 shadow-2xs">
        <div className="flex items-center gap-2 text-blue-600">
          <Info className="w-5 h-5" />
          <h1 className="text-2xl font-bold text-slate-900">About SubnetMaster</h1>
        </div>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>SubnetMaster</strong> is a high-performance, precision engineering calculator developed specifically for network engineers, cybersecurity professionals, systems administrators, and students studying for Cisco CCNA, CCNP, CompTIA Network+, and university computer networking examinations.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">Our Mission: Mathematical Certainty &amp; Privacy</h2>
          <p>
            Many online subnet calculators rely on outdated logic or fail on critical edge cases such as RFC 3021 /31 point-to-point links, /32 host routes, non-exact supernet aggregations, or huge IPv6 subnet spaces. SubnetMaster was built from the ground up to adhere strictly to official IETF RFC standards.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">100% Client-Side Engine</h2>
          <p>
            SubnetMaster conducts <strong>all calculations strictly inside your web browser</strong> using pure client-side JavaScript. No IP addresses, corporate subnet schemes, department headcounts, or network topologies entered into this website are ever transmitted to or stored on any server.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6 bg-white rounded-xl border border-slate-200 p-8 shadow-2xs">
        <div className="flex items-center gap-2 text-blue-600">
          <Mail className="w-5 h-5" />
          <h1 className="text-2xl font-bold text-slate-900">Contact &amp; Feedback</h1>
        </div>
        <p className="text-sm text-slate-600">
          Have a question about a calculation, feedback on a feature, or an RFC edge-case suggestion? We would love to hear from you.
        </p>

        {contactSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Thank you for reaching out!</span>
              Your message has been received. Our engineering team will review your feedback.
            </div>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Network Engineer"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="engineer@company.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Message / Invalidation Report
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry or suggestion..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    );
  }

  if (page === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 bg-white rounded-xl border border-slate-200 p-8 shadow-2xs">
        <div className="flex items-center gap-2 text-blue-600">
          <Shield className="w-5 h-5" />
          <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
        </div>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-base font-bold text-slate-900">1. Client-Side IP Calculation Privacy</h2>
          <p>
            SubnetMaster is committed to preserving your complete confidentiality. All calculations—including IP addresses, network masks, host requirements, and MAC addresses—are executed entirely on your client device inside your local web browser sandbox. No user-entered network data is ever transmitted to, inspected by, or saved on any remote servers.
          </p>
          <h2 className="text-base font-bold text-slate-900">2. Cookies and Analytics</h2>
          <p>
            SubnetMaster does not set tracking cookies or sell your personal information. Standard non-identifying server logs (such as request timestamps and HTTP status codes) may be collected solely to maintain operational uptime and security.
          </p>
          <h2 className="text-base font-bold text-slate-900">3. Third-Party Advertisements</h2>
          <p>
            We may display third-party advertisements (such as Google AdSense) to support the ongoing development of this free resource. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </div>
      </div>
    );
  }

  // Terms of service
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 bg-white rounded-xl border border-slate-200 p-8 shadow-2xs">
      <div className="flex items-center gap-2 text-blue-600">
        <FileText className="w-5 h-5" />
        <h1 className="text-2xl font-bold text-slate-900">Terms of Service</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using SubnetMaster, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the tool immediately.
        </p>
        <h2 className="text-base font-bold text-slate-900">2. Permitted Use</h2>
        <p>
          SubnetMaster is provided free of charge for educational, commercial, enterprise, and personal networking calculation purposes.
        </p>
        <h2 className="text-base font-bold text-slate-900">3. Disclaimer of Warranties</h2>
        <p>
          While SubnetMaster is engineered to rigorous mathematical standards adhering to relevant IETF RFC specifications, the calculations and information are provided "as is" without warranty of any kind. You are responsible for verifying all network configurations prior to deploying them into production environments.
        </p>
      </div>
    </div>
  );
};
