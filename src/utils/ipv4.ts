/**
 * IPv4 Mathematical Calculation Engine for SubnetMaster
 */

export interface IPv4Details {
  ip: string;
  prefix: number;
  cidr: string;
  networkAddress: string;
  subnetMask: string;
  wildcardMask: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalAddresses: number;
  usableHosts: number;
  hostBits: number;
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryWildcard: string;
  ipClass: string;
  addressType: string;
  isSpecialCase: boolean;
  specialCaseNote?: string;
}

export function parseIPv4(ipStr: string): number[] | null {
  const trimmed = ipStr.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 4) return null;

  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    // Disallow leading zeros unless the octet is strictly "0" (e.g. 01 is invalid)
    if (part.length > 1 && part.startsWith('0')) return null;
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return null;
    octets.push(num);
  }
  return octets;
}

export function isValidIPv4(ipStr: string): boolean {
  return parseIPv4(ipStr) !== null;
}

export function ipToNumber(ip: string): number {
  const octets = parseIPv4(ip);
  if (!octets) throw new Error(`Invalid IPv4 address: ${ip}`);
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

export function numberToIp(num: number): string {
  const n = num >>> 0;
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join('.');
}

export function prefixToMaskNumber(prefix: number): number {
  if (prefix < 0 || prefix > 32) throw new Error(`Invalid prefix length: ${prefix}`);
  if (prefix === 0) return 0;
  return ((0xffffffff << (32 - prefix)) >>> 0);
}

export function prefixToMaskString(prefix: number): string {
  return numberToIp(prefixToMaskNumber(prefix));
}

export function maskStringToPrefix(maskStr: string): number | null {
  const octets = parseIPv4(maskStr);
  if (!octets) return null;
  const num = ipToNumber(maskStr);
  
  // Valid subnet masks must be a sequence of 1s followed by 0s
  const inverted = (~num) >>> 0;
  // inverted + 1 must be a power of 2
  if ((inverted & (inverted + 1)) !== 0) return null;

  // Count leading 1 bits
  let prefix = 0;
  for (let i = 31; i >= 0; i--) {
    if ((num & (1 << i)) !== 0) {
      prefix++;
    } else {
      break;
    }
  }
  return prefix;
}

export function toBinaryDotted(num: number): string {
  const n = num >>> 0;
  const o1 = ((n >>> 24) & 255).toString(2).padStart(8, '0');
  const o2 = ((n >>> 16) & 255).toString(2).padStart(8, '0');
  const o3 = ((n >>> 8) & 255).toString(2).padStart(8, '0');
  const o4 = (n & 255).toString(2).padStart(8, '0');
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function getAddressType(ipNum: number): string {
  const o1 = (ipNum >>> 24) & 255;
  const o2 = (ipNum >>> 16) & 255;

  if (o1 === 10) return 'Private (RFC 1918)';
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return 'Private (RFC 1918)';
  if (o1 === 192 && o2 === 168) return 'Private (RFC 1918)';
  if (o1 === 127) return 'Loopback (RFC 1122)';
  if (o1 === 169 && o2 === 254) return 'Link-Local / APIPA (RFC 3927)';
  if (o1 === 100 && o2 >= 64 && o2 <= 127) return 'Carrier-Grade NAT (RFC 6598)';
  if (o1 === 192 && o2 === 0 && ((ipNum >>> 8) & 255) === 2) return 'Documentation TEST-NET-1 (RFC 5737)';
  if (o1 === 198 && o2 === 51 && ((ipNum >>> 8) & 255) === 100) return 'Documentation TEST-NET-2 (RFC 5737)';
  if (o1 === 203 && o2 === 0 && ((ipNum >>> 8) & 255) === 113) return 'Documentation TEST-NET-3 (RFC 5737)';
  if (o1 === 198 && (o2 === 18 || o2 === 19)) return 'Benchmark (RFC 2544)';
  if (o1 >= 224 && o1 <= 239) return 'Multicast (RFC 5771)';
  if (o1 >= 240) return 'Reserved / Experimental (RFC 1112)';
  if (o1 === 0) return 'Current Network (RFC 1122)';
  return 'Public Internet';
}

export function getNetworkClass(ipNum: number): string {
  const o1 = (ipNum >>> 24) & 255;
  if (o1 <= 127) return 'Class A';
  if (o1 <= 191) return 'Class B';
  if (o1 <= 223) return 'Class C';
  if (o1 <= 239) return 'Class D (Multicast)';
  return 'Class E (Experimental)';
}

export function calculateIPv4Details(ipInput: string, prefixInput: number): IPv4Details {
  if (!isValidIPv4(ipInput)) {
    throw new Error(`Please enter a valid IPv4 address (e.g. 192.168.1.1).`);
  }
  if (isNaN(prefixInput) || prefixInput < 0 || prefixInput > 32) {
    throw new Error(`Prefix length must be an integer between 0 and 32.`);
  }

  const ipNum = ipToNumber(ipInput);
  const maskNum = prefixToMaskNumber(prefixInput);
  const wildcardNum = (~maskNum) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  const hostBits = 32 - prefixInput;
  const totalAddresses = prefixInput === 0 ? 4294967296 : Math.pow(2, hostBits);

  let usableHosts: number;
  let firstUsable: string;
  let lastUsable: string;
  let broadcastAddress: string;
  let isSpecialCase = false;
  let specialCaseNote: string | undefined;

  if (prefixInput === 31) {
    isSpecialCase = true;
    totalAddresses === 2;
    usableHosts = 2;
    firstUsable = numberToIp(networkNum);
    lastUsable = numberToIp(networkNum + 1);
    broadcastAddress = 'None (RFC 3021 Point-to-Point)';
    specialCaseNote =
      'RFC 3021 specifies /31 subnets for point-to-point links. Both addresses are fully usable as endpoints without dedicated network and broadcast address loss.';
  } else if (prefixInput === 32) {
    isSpecialCase = true;
    usableHosts = 1;
    firstUsable = numberToIp(ipNum);
    lastUsable = numberToIp(ipNum);
    broadcastAddress = 'None (Single Host Route)';
    specialCaseNote =
      '/32 represents a single host route (a single IP address). There is no separate network or broadcast address.';
  } else if (prefixInput === 0) {
    usableHosts = totalAddresses - 2;
    firstUsable = '0.0.0.1';
    lastUsable = '255.255.255.254';
    broadcastAddress = '255.255.255.255';
    isSpecialCase = true;
    specialCaseNote = '/0 represents the default route (the entire IPv4 internet address space).';
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsable = numberToIp(networkNum + 1);
    lastUsable = numberToIp(broadcastNum - 1);
    broadcastAddress = numberToIp(broadcastNum);
  }

  return {
    ip: numberToIp(ipNum),
    prefix: prefixInput,
    cidr: `/${prefixInput}`,
    networkAddress: numberToIp(networkNum),
    subnetMask: numberToIp(maskNum),
    wildcardMask: numberToIp(wildcardNum),
    broadcastAddress,
    firstUsable,
    lastUsable,
    totalAddresses,
    usableHosts,
    hostBits,
    binaryIp: toBinaryDotted(ipNum),
    binaryMask: toBinaryDotted(maskNum),
    binaryNetwork: toBinaryDotted(networkNum),
    binaryWildcard: toBinaryDotted(wildcardNum),
    ipClass: getNetworkClass(ipNum),
    addressType: getAddressType(ipNum),
    isSpecialCase,
    specialCaseNote,
  };
}
