/**
 * SubnetMaster Main Application Entry
 * Complete IPv4 & IPv6 Subnetting and Supernetting Tool
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { IPv4Page } from './pages/IPv4Page';
import { IPv6Page } from './pages/IPv6Page';
import { VLSMPage } from './pages/VLSMPage';
import { SupernetPage } from './pages/SupernetPage';
import { WildcardPage } from './pages/WildcardPage';
import { EUI64Page } from './pages/EUI64Page';
import { GuidesPage } from './pages/GuidesPage';
import { FAQPage } from './pages/FAQPage';
import { LegalPages } from './pages/LegalPages';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  // Dynamic SEO Page Title & Meta Description update
  useEffect(() => {
    let title = 'SubnetMaster — IPv4 & IPv6 Subnet Calculator';
    let desc =
      'Calculate IPv4 and IPv6 subnets, VLSM networks, CIDR ranges, wildcard masks and supernets with SubnetMaster.';

    if (currentPath === '/ipv4-subnet-calculator') {
      title = 'IPv4 Subnet Calculator — CIDR, Masks & Subnet Tables | SubnetMaster';
      desc =
        'Free IPv4 subnet calculator with prefix-based and host requirement modes, complete subnet tables, wildcard masks, and binary bit views.';
    } else if (currentPath === '/ipv6-subnet-calculator') {
      title = 'IPv6 Subnet Calculator — Prefixes /0 to /128 & RFC 5952 | SubnetMaster';
      desc =
        'Full IPv6 subnet calculator supporting /0 through /128, address expansion, RFC 5952 compression, interface IDs, and huge subnet ranges.';
    } else if (currentPath === '/vlsm-calculator') {
      title = 'VLSM Calculator — Variable Length Subnet Masking | SubnetMaster';
      desc =
        'Calculate efficient VLSM address allocations sorted automatically by required host size with boundary alignment and free space tracking.';
    } else if (currentPath === '/supernet-calculator') {
      title = 'Supernet Calculator — CIDR Route Aggregator | SubnetMaster';
      desc =
        'Summarize multiple IPv4 networks into optimal CIDR blocks with exact versus non-exact boundary analysis and binary prefix inspection.';
    } else if (currentPath === '/wildcard-mask-calculator') {
      title = 'Wildcard Mask Calculator — Cisco ACL & OSPF Filters | SubnetMaster';
      desc =
        'Calculate inverse wildcard masks and generate Cisco IOS access-list rules and OSPF network statements with binary inversion breakdown.';
    } else if (currentPath === '/eui64-calculator') {
      title = 'Modified EUI-64 & SLAAC Calculator | SubnetMaster';
      desc =
        'Convert 48-bit MAC addresses to 64-bit Modified EUI-64 interface identifiers and generate full IPv6 SLAAC autoconfiguration addresses.';
    } else if (currentPath.includes('guide')) {
      title = 'Subnetting & CIDR Educational Guide & Formulas | SubnetMaster';
      desc =
        'Master IPv4/IPv6 subnetting, CIDR notation, subnet masks, VLSM design, route summarization, and mathematical formulas.';
    } else if (currentPath === '/faq') {
      title = 'Subnetting & IP Addressing FAQ | SubnetMaster';
      desc =
        'Answers to common subnetting questions: subnet masks, CIDR prefixes, /26 vs /24 host calculations, /31 RFC 3021 exceptions, and more.';
    } else if (currentPath === '/about') {
      title = 'About SubnetMaster — High Performance IP Addressing';
      desc = 'Learn about SubnetMaster, our RFC compliance, and 100% private client-side networking engine.';
    } else if (currentPath === '/contact') {
      title = 'Contact SubnetMaster';
      desc = 'Contact our engineering team for questions, feature requests, or RFC feedback.';
    } else if (currentPath === '/privacy') {
      title = 'Privacy Policy | SubnetMaster';
      desc = 'SubnetMaster privacy policy: 100% client-side calculation with zero personal or network data stored.';
    } else if (currentPath === '/terms') {
      title = 'Terms of Service | SubnetMaster';
      desc = 'SubnetMaster terms of service and acceptable use guidelines.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [currentPath]);

  // Route Rendering
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/ipv4-subnet-calculator':
        return <IPv4Page onNavigate={navigateTo} />;
      case '/ipv6-subnet-calculator':
        return <IPv6Page onNavigate={navigateTo} />;
      case '/vlsm-calculator':
        return <VLSMPage onNavigate={navigateTo} />;
      case '/supernet-calculator':
        return <SupernetPage onNavigate={navigateTo} />;
      case '/wildcard-mask-calculator':
        return <WildcardPage onNavigate={navigateTo} />;
      case '/eui64-calculator':
        return <EUI64Page onNavigate={navigateTo} />;
      case '/subnetting-guide':
      case '/ipv6-subnetting-guide':
      case '/vlsm-guide':
      case '/supernetting-guide':
        return <GuidesPage onNavigate={navigateTo} />;
      case '/faq':
        return <FAQPage onNavigate={navigateTo} />;
      case '/about':
        return <LegalPages page="about" onNavigate={navigateTo} />;
      case '/contact':
        return <LegalPages page="contact" onNavigate={navigateTo} />;
      case '/privacy':
        return <LegalPages page="privacy" onNavigate={navigateTo} />;
      case '/terms':
        return <LegalPages page="terms" onNavigate={navigateTo} />;
      case '/':
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      <main className="flex-1 pb-12">{renderCurrentPage()}</main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
