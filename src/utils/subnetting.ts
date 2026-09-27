import {
  ipToNumber,
  numberToIp,
  prefixToMaskNumber,
  isValidIPv4,
  calculateIPv4Details,
  IPv4Details,
} from './ipv4';

export interface SubnetRow {
  index: number;
  network: string;
  cidr: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  usableHosts: number;
  totalAddresses: number;
}

export interface IPv4SubnettingResult {
  parentDetails: IPv4Details;
  newPrefix: number;
  subnetBits: number;
  hostBits: number;
  numberOfSubnets: number;
  addressesPerSubnet: number;
  usableHostsPerSubnet: number;
  subnets: SubnetRow[];
  totalRowsTruncated: boolean;
  maxDisplayCount: number;
  mode: 'prefix' | 'hosts';
  requiredHosts?: number;
}

/**
 * Calculates subnetting for Mode A (Prefix-based) or Mode B (Host requirement)
 */
export function calculateIPv4Subnets(
  networkInput: string,
  parentPrefix: number,
  desiredPrefix: number,
  mode: 'prefix' | 'hosts' = 'prefix',
  requiredHosts?: number,
  maxDisplayCount = 512
): IPv4SubnettingResult {
  if (!isValidIPv4(networkInput)) {
    throw new Error('Please enter a valid IPv4 address.');
  }
  if (parentPrefix < 0 || parentPrefix > 32) {
    throw new Error('Parent prefix length must be between 0 and 32.');
  }
  if (desiredPrefix < parentPrefix) {
    throw new Error(`Subnet prefix (/${desiredPrefix}) must be greater than or equal to parent prefix (/${parentPrefix}).`);
  }
  if (desiredPrefix > 32) {
    throw new Error('Subnet prefix length cannot exceed /32.');
  }

  const parentDetails = calculateIPv4Details(networkInput, parentPrefix);
  const parentNetNum = ipToNumber(parentDetails.networkAddress);

  const subnetBits = desiredPrefix - parentPrefix;
  const hostBits = 32 - desiredPrefix;
  const numberOfSubnets = Math.pow(2, subnetBits);
  const addressesPerSubnet = desiredPrefix === 0 ? 4294967296 : Math.pow(2, hostBits);

  let usableHostsPerSubnet: number;
  if (desiredPrefix === 31) {
    usableHostsPerSubnet = 2;
  } else if (desiredPrefix === 32) {
    usableHostsPerSubnet = 1;
  } else {
    usableHostsPerSubnet = Math.max(0, addressesPerSubnet - 2);
  }

  const subnets: SubnetRow[] = [];
  const countToGenerate = Math.min(numberOfSubnets, maxDisplayCount);

  for (let i = 0; i < countToGenerate; i++) {
    const netNum = (parentNetNum + i * addressesPerSubnet) >>> 0;
    const bcastNum = (netNum + addressesPerSubnet - 1) >>> 0;

    let firstHost: string;
    let lastHost: string;
    let broadcast: string;

    if (desiredPrefix === 31) {
      firstHost = numberToIp(netNum);
      lastHost = numberToIp(netNum + 1);
      broadcast = 'None (P2P)';
    } else if (desiredPrefix === 32) {
      firstHost = numberToIp(netNum);
      lastHost = numberToIp(netNum);
      broadcast = 'None (Host)';
    } else {
      firstHost = numberToIp(netNum + 1);
      lastHost = numberToIp(bcastNum - 1);
      broadcast = numberToIp(bcastNum);
    }

    subnets.push({
      index: i + 1,
      network: numberToIp(netNum),
      cidr: `/${desiredPrefix}`,
      firstHost,
      lastHost,
      broadcast,
      usableHosts: usableHostsPerSubnet,
      totalAddresses: addressesPerSubnet,
    });
  }

  return {
    parentDetails,
    newPrefix: desiredPrefix,
    subnetBits,
    hostBits,
    numberOfSubnets,
    addressesPerSubnet,
    usableHostsPerSubnet,
    subnets,
    totalRowsTruncated: numberOfSubnets > maxDisplayCount,
    maxDisplayCount,
    mode,
    requiredHosts,
  };
}

/**
 * Calculates the smallest prefix supporting the required hosts per subnet
 */
export function calculatePrefixForRequiredHosts(
  requiredHosts: number,
  allow31 = true
): { prefix: number; usableHosts: number; totalAddresses: number; hostBits: number } {
  if (requiredHosts <= 0) {
    throw new Error('Required hosts must be greater than 0.');
  }

  // /31 provides 2 usable hosts for point-to-point links (RFC 3021)
  if (requiredHosts <= 2 && allow31) {
    // Check if /31 can be used for <= 2 hosts
    // Standard host requirement for 1 host or 2 hosts:
    // If allow31 is true, 1 or 2 hosts can fit in /31 (2 usable) or /30 (2 usable).
    // Traditional networking courses teach /30 for 2 hosts. Let's provide /30 as standard for general subnets, or /31 if specified.
    // To strictly follow requirement 4: "Required hosts: 50 -> Usable hosts: 62 -> Prefix: /26 -> Number of subnets: 4"
  }

  // For general hosts H: needed addresses >= H + 2 (1 for network, 1 for broadcast)
  const neededAddresses = requiredHosts + 2;
  const hostBits = Math.ceil(Math.log2(neededAddresses));
  const boundedHostBits = Math.max(2, Math.min(32, hostBits));
  const prefix = 32 - boundedHostBits;
  const totalAddresses = Math.pow(2, boundedHostBits);
  const usableHosts = totalAddresses - 2;

  return {
    prefix,
    usableHosts,
    totalAddresses,
    hostBits: boundedHostBits,
  };
}
