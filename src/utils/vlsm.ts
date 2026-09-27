import {
  ipToNumber,
  numberToIp,
  prefixToMaskNumber,
  prefixToMaskString,
  calculateIPv4Details,
  isValidIPv4,
} from './ipv4';

export interface VlsmRequirement {
  id: string;
  name: string;
  requiredHosts: number;
}

export interface VlsmAllocation {
  id: string;
  name: string;
  requiredHosts: number;
  allocatedHosts: number;
  prefix: number;
  cidr: string;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalAddresses: number;
  hostBits: number;
  efficiency: number; // percentage
}

export interface RemainingBlock {
  cidr: string;
  networkAddress: string;
  prefix: number;
  totalAddresses: number;
  firstIp: string;
  lastIp: string;
}

export interface VlsmResult {
  parentCidr: string;
  parentNetwork: string;
  parentPrefix: number;
  parentTotalAddresses: number;
  allocations: VlsmAllocation[];
  totalAllocatedAddresses: number;
  totalUnallocatedAddresses: number;
  remainingBlocks: RemainingBlock[];
  utilizationPercentage: number;
  fits: boolean;
  errorMessage?: string;
}

/**
 * Calculates optimal VLSM allocations given a parent network and host requirements
 */
export function calculateVLSM(
  parentCidrInput: string,
  requirements: VlsmRequirement[]
): VlsmResult {
  // Parse parent CIDR
  const parts = parentCidrInput.trim().split('/');
  if (parts.length !== 2) {
    throw new Error('Please enter parent network in CIDR notation (e.g. 192.168.10.0/24).');
  }

  const parentIp = parts[0].trim();
  const parentPrefix = parseInt(parts[1].trim(), 10);

  if (!isValidIPv4(parentIp)) {
    throw new Error(`Invalid parent IPv4 address: ${parentIp}`);
  }
  if (isNaN(parentPrefix) || parentPrefix < 0 || parentPrefix > 32) {
    throw new Error('Parent prefix must be between 0 and 32.');
  }

  const parentDetails = calculateIPv4Details(parentIp, parentPrefix);
  const parentNetNum = ipToNumber(parentDetails.networkAddress);
  const parentTotalAddresses = parentDetails.totalAddresses;
  const parentEndNum = (parentNetNum + parentTotalAddresses - 1) >>> 0;

  // Validate requirements
  if (!requirements || requirements.length === 0) {
    throw new Error('Please add at least one subnet requirement.');
  }

  const namesSeen = new Set<string>();
  for (const req of requirements) {
    const trimmedName = req.name.trim();
    if (!trimmedName) {
      throw new Error('Subnet requirement name cannot be empty.');
    }
    const lowerName = trimmedName.toLowerCase();
    if (namesSeen.has(lowerName)) {
      throw new Error(`Duplicate subnet name "${trimmedName}". Each subnet requirement must have a unique name.`);
    }
    namesSeen.add(lowerName);

    if (isNaN(req.requiredHosts) || req.requiredHosts <= 0) {
      throw new Error(`Invalid host requirement for "${trimmedName}". Host count must be greater than 0.`);
    }
    if (!Number.isInteger(req.requiredHosts)) {
      throw new Error(`Host count for "${trimmedName}" must be a whole number.`);
    }
  }

  // Sort requirements descending by required hosts (VLSM Rule)
  const sortedReqs = [...requirements].sort((a, b) => b.requiredHosts - a.requiredHosts);

  const allocations: VlsmAllocation[] = [];
  let currentBase = parentNetNum;
  let fits = true;

  for (const req of sortedReqs) {
    // Determine needed host bits
    // For standard IPv4 subnets, we need at least req.requiredHosts + 2 (1 for network, 1 for broadcast)
    // Smallest usable subnet for hosts > 2 is /30 (2 hosts). For 1 or 2 hosts, /30 provides 2 usable.
    // If requirement is 1 or 2, hostBits = 2 (prefix 30).
    const neededWithOverhead = req.requiredHosts + 2;
    const hostBits = Math.max(2, Math.ceil(Math.log2(neededWithOverhead)));
    const prefix = 32 - hostBits;
    const blockSize = Math.pow(2, hostBits);

    // Align currentBase to a multiple of blockSize (CIDR boundary rule)
    const remainder = currentBase % blockSize;
    if (remainder !== 0) {
      currentBase = (currentBase + (blockSize - remainder)) >>> 0;
    }

    const blockEnd = (currentBase + blockSize - 1) >>> 0;

    // Check if block exceeds parent boundary
    if (blockEnd > parentEndNum || currentBase > parentEndNum) {
      fits = false;
      break;
    }

    const usableHosts = blockSize - 2;
    const efficiency = Math.round((req.requiredHosts / usableHosts) * 100);

    allocations.push({
      id: req.id,
      name: req.name.trim(),
      requiredHosts: req.requiredHosts,
      allocatedHosts: usableHosts,
      prefix,
      cidr: `${numberToIp(currentBase)}/${prefix}`,
      subnetMask: prefixToMaskString(prefix),
      networkAddress: numberToIp(currentBase),
      broadcastAddress: numberToIp(blockEnd),
      firstUsable: numberToIp(currentBase + 1),
      lastUsable: numberToIp(blockEnd - 1),
      totalAddresses: blockSize,
      hostBits,
      efficiency,
    });

    currentBase = (blockEnd + 1) >>> 0;
  }

  if (!fits) {
    return {
      parentCidr: `${parentDetails.networkAddress}/${parentPrefix}`,
      parentNetwork: parentDetails.networkAddress,
      parentPrefix,
      parentTotalAddresses,
      allocations: [],
      totalAllocatedAddresses: 0,
      totalUnallocatedAddresses: parentTotalAddresses,
      remainingBlocks: [],
      utilizationPercentage: 0,
      fits: false,
      errorMessage: `These requirements cannot fit inside ${parentDetails.networkAddress}/${parentPrefix}. The requested subnets require more address space than available.`,
    };
  }

  // Calculate remaining address space blocks
  const remainingBlocks: RemainingBlock[] = [];
  let remainingStart = currentBase;

  // Decompose remaining contiguous space [remainingStart .. parentEndNum] into valid CIDR blocks
  while (remainingStart <= parentEndNum && remainingStart !== 0) {
    const remainingCount = (parentEndNum - remainingStart + 1) >>> 0;
    if (remainingCount <= 0) break;

    // Find the largest power-of-2 block that fits in remainingCount and aligns with remainingStart
    let blockSize = 1;
    while (blockSize * 2 <= remainingCount && (remainingStart % (blockSize * 2) === 0)) {
      blockSize *= 2;
    }

    const prefix = 32 - Math.log2(blockSize);
    const blockEnd = (remainingStart + blockSize - 1) >>> 0;

    remainingBlocks.push({
      cidr: `${numberToIp(remainingStart)}/${prefix}`,
      networkAddress: numberToIp(remainingStart),
      prefix,
      totalAddresses: blockSize,
      firstIp: numberToIp(remainingStart),
      lastIp: numberToIp(blockEnd),
    });

    if (blockEnd >= parentEndNum) break;
    remainingStart = (blockEnd + 1) >>> 0;
  }

  const totalAllocatedAddresses = allocations.reduce((sum, a) => sum + a.totalAddresses, 0);
  const totalUnallocatedAddresses = Math.max(0, parentTotalAddresses - totalAllocatedAddresses);
  const utilizationPercentage = Math.round((totalAllocatedAddresses / parentTotalAddresses) * 100);

  return {
    parentCidr: `${parentDetails.networkAddress}/${parentPrefix}`,
    parentNetwork: parentDetails.networkAddress,
    parentPrefix,
    parentTotalAddresses,
    allocations,
    totalAllocatedAddresses,
    totalUnallocatedAddresses,
    remainingBlocks,
    utilizationPercentage,
    fits: true,
  };
}
