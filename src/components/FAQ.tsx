import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'What is a subnet mask?',
    answer:
      'A subnet mask is a 32-bit dotted-decimal number (such as 255.255.255.0) that tells routers and host devices which portion of an IP address represents the network identity and which portion identifies the specific client endpoint. The consecutive binary 1s indicate network bits, and consecutive binary 0s indicate host bits.',
  },
  {
    question: 'What does /24 mean?',
    answer:
      '/24 is CIDR (Classless Inter-Domain Routing) shorthand notation indicating that the first 24 bits of the 32-bit IPv4 address belong to the network prefix. The remaining 8 bits are left for host addressing, which gives 2^8 = 256 total IP addresses, or 254 usable hosts after subtracting the network address (.0) and broadcast address (.255). Its equivalent subnet mask is 255.255.255.0.',
  },
  {
    question: 'How many hosts are in a /26?',
    answer:
      'A /26 prefix leaves 6 bits for host addressing (32 - 26 = 6). Total addresses = 2^6 = 64. In traditional subnets, 2 addresses are reserved (1 for network identity, 1 for broadcast), providing 62 usable client host addresses. Its subnet mask is 255.255.255.192.',
  },
  {
    question: 'How do I calculate a subnet?',
    answer:
      'To calculate a subnet: 1) Identify the parent network prefix and your desired subnets or host count. 2) Determine required host bits (b) such that 2^b - 2 >= required hosts. 3) Calculate new prefix = 32 - b. 4) Determine block size = 2^b. 5) Subnet boundaries increment by this block size, starting at the network address. Or simply use SubnetMaster for instant, error-free calculations!',
  },
  {
    question: 'What is VLSM?',
    answer:
      'VLSM stands for Variable Length Subnet Masking. It is a networking technique where an engineer applies different subnet mask sizes to individual subnets within the same major network based on each department or link\'s specific host requirements, preventing unnecessary IP address wastage.',
  },
  {
    question: 'What is CIDR?',
    answer:
      'CIDR (Classless Inter-Domain Routing), introduced in 1993 by RFC 1519, replaced the rigid Class A, B, and C address allocation system with arbitrary bit-length network prefixes (e.g. /19, /26, /29). CIDR dramatically slowed IPv4 address exhaustion and prevented internet routing table explosion.',
  },
  {
    question: 'What is supernetting?',
    answer:
      'Supernetting is the process of combining multiple contiguous smaller networks (e.g., four /24 subnets) into a single larger network block (e.g., /22) by decreasing the prefix length. It is the exact mathematical inverse of subnetting.',
  },
  {
    question: 'What is route summarization?',
    answer:
      'Route summarization (or route aggregation) is the practice where border routers advertise a single condensed routing prefix representing multiple child networks to adjacent routers. This significantly shrinks global routing tables, lowers router memory usage, and limits the propagation of link-state flapping.',
  },
  {
    question: 'How many /64 networks are inside a /48?',
    answer:
      'Exactly 65,536 subnets. The calculation is 2^(64 - 48) = 2^16 = 65,536 distinct /64 networks. This is why a standard /48 ISP site allocation gives an enterprise virtually unlimited internal subnetting flexibility.',
  },
  {
    question: 'What is the difference between IPv4 and IPv6 subnetting?',
    answer:
      'IPv4 addresses are 32 bits and suffer from extreme address scarcity, requiring fine-grained bit-level calculations (/27, /28, /29) and NAT to conserve addresses. IPv6 addresses are 128 bits; subnetting is virtually always performed on clean 4-bit nibble boundaries (typically /48, /56, and /64), and every standard subnet is a /64 containing 18.4 quintillion addresses with no need for broadcast addresses or NAT.',
  },
  {
    question: 'What is a wildcard mask?',
    answer:
      'A wildcard mask is the bitwise inverse of a subnet mask (255.255.255.255 minus the subnet mask). For example, a /26 mask (255.255.255.192) has a wildcard mask of 0.0.0.63. Binary 0s indicate "must match exactly", while binary 1s indicate "don\'t care", commonly used in Cisco ACLs and OSPF network statements.',
  },
  {
    question: 'What does /31 mean?',
    answer:
      'RFC 3021 defines /31 subnets for point-to-point router links. Because point-to-point links only connect two devices, dedicated network and broadcast addresses are unnecessary. A /31 provides exactly 2 IP addresses and both are usable endpoints, saving two addresses on every point-to-point connection.',
  },
  {
    question: 'What does /32 mean?',
    answer:
      'A /32 represents a single IPv4 host address with zero host bits. It is commonly configured on loopback interfaces, VPN client tunnels, or host-specific routing entries.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs max-w-4xl mx-auto">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential concepts in IPv4/IPv6 subnetting, CIDR, VLSM, and route summarization.
          </p>
        </div>
      </div>

      <div className="space-y-3" role="region" aria-label="FAQ Accordion">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const buttonId = `faq-btn-${idx}`;

          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
            >
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleAccordion(idx)}
                className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-100/80 transition-colors cursor-pointer select-none"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
