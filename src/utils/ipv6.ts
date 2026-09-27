/**
 * IPv6 Mathematical Calculation Engine for SubnetMaster
 */

export interface IPv6Details {
  raw: string;
  prefix: number;
  expanded: string;
  compressed: string;
  networkPrefix: string;
  interfaceId: string;
  addressType: string;
  bigIntValue: bigint;
  networkBigInt: bigint;
}

export interface IPv6SubnettingResult {
  details: IPv6Details;
  parentPrefix: number;
  newPrefix: number;
  subnetBits: number;
  numberOfSubnetsFormatted: string;
  numberOfSubnetsBigInt: bigint;
  addressesPerSubnetFormatted: string;
  firstSubnet: string;
  lastSubnet: string;
  generatedSubnets: string[];
  maxDisplayCount: number;
}

/**
 * Validates IPv6 string syntax strictly
 */
export function isValidIPv6(ipStr: string): boolean {
  try {
    parseIPv6ToGroups(ipStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses IPv6 address into array of 8 integers (0 - 65535)
 */
export function parseIPv6ToGroups(ipStr: string): number[] {
  const trimmed = ipStr.trim().toLowerCase();
  if (!trimmed) throw new Error('IPv6 address cannot be empty.');

  // Check for IPv4 mapped at end e.g. ::ffff:192.168.1.1
  let workingStr = trimmed;
  const ipv4Match = workingStr.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Match) {
    const ipv4 = ipv4Match[1];
    const octets = ipv4.split('.').map((o) => parseInt(o, 10));
    if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
      throw new Error(`Invalid embedded IPv4 address in ${ipStr}`);
    }
    const high = ((octets[0] << 8) | octets[1]).toString(16);
    const low = ((octets[2] << 8) | octets[3]).toString(16);
    workingStr = workingStr.slice(0, -ipv4.length) + `${high}:${low}`;
  }

  // Check for multiple "::"
  const doubleColonCount = (workingStr.match(/::/g) || []).length;
  if (doubleColonCount > 1) {
    throw new Error('An IPv6 address cannot contain more than one "::".');
  }

  const parts = workingStr.split('::');
  let leftGroups: string[] = [];
  let rightGroups: string[] = [];

  if (parts.length === 2) {
    leftGroups = parts[0] ? parts[0].split(':') : [];
    rightGroups = parts[1] ? parts[1].split(':') : [];
  } else {
    leftGroups = parts[0].split(':');
  }

  const totalGroups = leftGroups.length + rightGroups.length;
  if (parts.length === 1 && totalGroups !== 8) {
    throw new Error(`Expected 8 hex groups, got ${totalGroups}.`);
  }
  if (parts.length === 2 && totalGroups >= 8) {
    throw new Error(`Too many groups (${totalGroups}) with "::" compression.`);
  }

  const missingZeros = parts.length === 2 ? 8 - totalGroups : 0;
  const allGroups = [
    ...leftGroups,
    ...Array(missingZeros).fill('0'),
    ...rightGroups,
  ];

  if (allGroups.length !== 8) {
    throw new Error('Invalid IPv6 group count after expansion.');
  }

  return allGroups.map((grp) => {
    if (!/^[0-9a-f]{1,4}$/i.test(grp)) {
      throw new Error(`Invalid hex group: "${grp}". Groups must have 1 to 4 hexadecimal characters.`);
    }
    return parseInt(grp, 16);
  });
}

export function groupsToBigInt(groups: number[]): bigint {
  let val = 0n;
  for (let i = 0; i < 8; i++) {
    val = (val << 16n) | BigInt(groups[i]);
  }
  return val;
}

export function bigIntToGroups(val: bigint): number[] {
  const groups: number[] = [];
  let current = val;
  for (let i = 0; i < 8; i++) {
    const shift = BigInt((7 - i) * 16);
    const grp = Number((current >> shift) & 0xffffn);
    groups.push(grp);
  }
  return groups;
}

export function expandIPv6(groups: number[]): string {
  return groups.map((g) => g.toString(16).padStart(4, '0')).join(':');
}

/**
 * RFC 5952 compliant IPv6 compression
 */
export function compressIPv6(groups: number[]): string {
  // Find longest run of consecutive zeros
  let maxZeroStart = -1;
  let maxZeroLen = 0;
  let currZeroStart = -1;
  let currZeroLen = 0;

  for (let i = 0; i < 8; i++) {
    if (groups[i] === 0) {
      if (currZeroStart === -1) {
        currZeroStart = i;
        currZeroLen = 1;
      } else {
        currZeroLen++;
      }
    } else {
      if (currZeroLen > maxZeroLen) {
        maxZeroLen = currZeroLen;
        maxZeroStart = currZeroStart;
      }
      currZeroStart = -1;
      currZeroLen = 0;
    }
  }
  if (currZeroLen > maxZeroLen) {
    maxZeroLen = currZeroLen;
    maxZeroStart = currZeroStart;
  }

  // RFC 5952: only compress if length > 1
  if (maxZeroLen <= 1) {
    return groups.map((g) => g.toString(16)).join(':');
  }

  const left = groups.slice(0, maxZeroStart).map((g) => g.toString(16)).join(':');
  const right = groups.slice(maxZeroStart + maxZeroLen).map((g) => g.toString(16)).join(':');

  if (!left && !right) return '::';
  if (!left) return `::${right}`;
  if (!right) return `${left}::`;
  return `${left}::${right}`;
}

export function getIPv6AddressType(val: bigint): string {
  if (val === 0n) return 'Unspecified (::/128)';
  if (val === 1n) return 'Loopback (::1/128)';

  // Fe80::/10 (fe80 to febf)
  const fe80Prefix = val >> (128n - 10n);
  if (fe80Prefix === 0x3fan) return 'Link-Local Unicast (fe80::/10)';

  // Fc00::/7 (fc00 to fdff)
  const fc00Prefix = val >> (128n - 7n);
  if (fc00Prefix === 0x7en) return 'Unique Local Unicast (fc00::/7 - ULA)';

  // Ff00::/8 (ff00 to ffff)
  const ff00Prefix = val >> (128n - 8n);
  if (ff00Prefix === 0xffn) return 'Multicast (ff00::/8)';

  // 2001:db8::/32 Documentation
  const docPrefix = val >> (128n - 32n);
  if (docPrefix === 0x20010db8n) return 'Documentation (2001:db8::/32 - RFC 3849)';

  // 64:ff9b::/96
  const nat64Prefix = val >> (128n - 96n);
  if (nat64Prefix === 0x0064ff9b0000000000000000n) return 'IPv4/IPv6 Translation (64:ff9b::/96)';

  // ::ffff:0:0/96
  if ((val >> 32n) === 0xffffn) return 'IPv4-Mapped IPv6 (::ffff:0:0/96)';

  // 2000::/3 (2000 to 3fff) Global Unicast
  const guaPrefix = val >> (128n - 3n);
  if (guaPrefix === 0x1n) return 'Global Unicast (2000::/3 - GUA)';

  return 'Special / Reserved Unicast';
}

export function calculateIPv6Details(ipInput: string, prefixInput: number): IPv6Details {
  if (prefixInput < 0 || prefixInput > 128) {
    throw new Error('Prefix length must be between 0 and 128.');
  }

  const groups = parseIPv6ToGroups(ipInput);
  const val = groupsToBigInt(groups);

  // Network prefix mask
  let mask = 0n;
  if (prefixInput > 0) {
    mask = ((1n << BigInt(prefixInput)) - 1n) << BigInt(128 - prefixInput);
  }
  const netVal = val & mask;
  const netGroups = bigIntToGroups(netVal);

  // Interface ID (lower bits, conventionally 64 bits if prefix <= 64, or 128 - prefix bits)
  const expanded = expandIPv6(groups);
  const expParts = expanded.split(':');
  const interfaceId = `${expParts[4]}:${expParts[5]}:${expParts[6]}:${expParts[7]}`;

  return {
    raw: ipInput,
    prefix: prefixInput,
    expanded,
    compressed: compressIPv6(groups),
    networkPrefix: `${compressIPv6(netGroups)}`,
    interfaceId,
    addressType: getIPv6AddressType(val),
    bigIntValue: val,
    networkBigInt: netVal,
  };
}

export function formatAddressCount(exponent: number): string {
  if (exponent === 0) return '1';
  if (exponent <= 32) {
    return Math.pow(2, exponent).toLocaleString();
  }
  if (exponent <= 50) {
    const big = 2n ** BigInt(exponent);
    return big.toLocaleString();
  }
  return `2^${exponent} (${(2n ** BigInt(exponent)).toString().slice(0, 5)}... addresses)`;
}

export function formatSubnetCount(bits: number): { formatted: string; val: bigint } {
  const val = 2n ** BigInt(bits);
  if (bits <= 50) {
    return { formatted: val.toLocaleString(), val };
  }
  return { formatted: `2^${bits}`, val };
}

/**
 * Calculates IPv6 subnetting between parentPrefix and newPrefix
 */
export function calculateIPv6Subnets(
  networkInput: string,
  parentPrefix: number,
  newPrefix: number,
  maxDisplayCount = 25
): IPv6SubnettingResult {
  if (parentPrefix < 0 || parentPrefix > 128) {
    throw new Error('Parent prefix must be between 0 and 128.');
  }
  if (newPrefix < parentPrefix) {
    throw new Error(`New prefix (/${newPrefix}) must be greater than or equal to parent prefix (/${parentPrefix}).`);
  }
  if (newPrefix > 128) {
    throw new Error('New prefix cannot exceed /128.');
  }

  const details = calculateIPv6Details(networkInput, parentPrefix);
  const subnetBits = newPrefix - parentPrefix;
  const { formatted: numSubnetsFormatted, val: numSubnetsBigInt } = formatSubnetCount(subnetBits);

  const hostBits = 128 - newPrefix;
  let addressesPerSubnetFormatted = `2^${hostBits}`;
  if (hostBits <= 32) {
    addressesPerSubnetFormatted = `${Math.pow(2, hostBits).toLocaleString()} (2^${hostBits})`;
  }

  // Base network for parent
  const parentNetBigInt = details.networkBigInt;
  const subnetStep = 1n << BigInt(128 - newPrefix);

  // First subnet
  const firstNetGroups = bigIntToGroups(parentNetBigInt);
  const firstSubnet = `${compressIPv6(firstNetGroups)}/${newPrefix}`;

  // Last subnet
  const lastSubnetOffset = (numSubnetsBigInt - 1n) * subnetStep;
  const lastNetBigInt = parentNetBigInt + lastSubnetOffset;
  const lastNetGroups = bigIntToGroups(lastNetBigInt);
  const lastSubnet = `${compressIPv6(lastNetGroups)}/${newPrefix}`;

  // Generate range of subnets up to maxDisplayCount
  const countToGen = Number(numSubnetsBigInt < BigInt(maxDisplayCount) ? numSubnetsBigInt : BigInt(maxDisplayCount));
  const generatedSubnets: string[] = [];

  for (let i = 0; i < countToGen; i++) {
    const currentNet = parentNetBigInt + BigInt(i) * subnetStep;
    const grps = bigIntToGroups(currentNet);
    generatedSubnets.push(`${compressIPv6(grps)}/${newPrefix}`);
  }

  return {
    details,
    parentPrefix,
    newPrefix,
    subnetBits,
    numberOfSubnetsFormatted: numSubnetsFormatted,
    numberOfSubnetsBigInt: numSubnetsBigInt,
    addressesPerSubnetFormatted,
    firstSubnet,
    lastSubnet,
    generatedSubnets,
    maxDisplayCount,
  };
}
