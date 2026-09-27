import {
  isValidIPv4,
  ipToNumber,
  numberToIp,
  prefixToMaskNumber,
  prefixToMaskString,
  toBinaryDotted,
  calculateIPv4Details,
} from './ipv4';

export interface ParsedSupernetInput {
  raw: string;
  networkAddress: string;
  prefix: number;
  startIpNum: number;
  endIpNum: number;
  totalAddresses: number;
  binaryNetwork: string;
}

export interface SupernetResult {
  inputNetworks: ParsedSupernetInput[];
  aggregatedCidr: string;
  aggregatedNetwork: string;
  aggregatedPrefix: number;
  subnetMask: string;
  wildcardMask: string;
  firstAddress: string;
  lastAddress: string;
  totalAddresses: number;
  inputTotalAddresses: number;
  isExact: boolean;
  extraAddresses: number;
  extraBlocks: string[];
  explanation: string;
  commonPrefixBits: number;
  binaryAggregatedMask: string;
  binaryAggregatedNetwork: string;
}

/**
 * Calculates CIDR aggregation and supernetting for a list of IPv4 networks
 */
export function calculateSupernet(networkLines: string[]): SupernetResult {
  const filtered = networkLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (filtered.length === 0) {
    throw new Error('Please enter at least one network to aggregate.');
  }

  const parsedList: ParsedSupernetInput[] = [];

  for (const line of filtered) {
    // Check if user entered IP/prefix or just IP
    let ipPart = line;
    let prefixPart = 32;

    if (line.includes('/')) {
      const parts = line.split('/');
      ipPart = parts[0].trim();
      const p = parseInt(parts[1].trim(), 10);
      if (isNaN(p) || p < 0 || p > 32) {
        throw new Error(`Invalid prefix length in "${line}". Must be between 0 and 32.`);
      }
      prefixPart = p;
    }

    if (!isValidIPv4(ipPart)) {
      throw new Error(`Invalid IPv4 address format in "${line}". Expected e.g. 192.168.0.0/24.`);
    }

    const details = calculateIPv4Details(ipPart, prefixPart);
    const startNum = ipToNumber(details.networkAddress);
    const endNum = (startNum + details.totalAddresses - 1) >>> 0;

    parsedList.push({
      raw: line,
      networkAddress: details.networkAddress,
      prefix: prefixPart,
      startIpNum: startNum,
      endIpNum: endNum,
      totalAddresses: details.totalAddresses,
      binaryNetwork: details.binaryNetwork,
    });
  }

  // Sort by start IP
  parsedList.sort((a, b) => a.startIpNum - b.startIpNum);

  // Find min and max IP
  let minIp = parsedList[0].startIpNum;
  let maxIp = parsedList[0].endIpNum;

  for (const item of parsedList) {
    if (item.startIpNum < minIp) minIp = item.startIpNum;
    if (item.endIpNum > maxIp) maxIp = item.endIpNum;
  }

  // Find common leading bits between minIp and maxIp
  let commonBits = 0;
  for (let i = 31; i >= 0; i--) {
    const bitMin = (minIp >>> i) & 1;
    const bitMax = (maxIp >>> i) & 1;
    if (bitMin === bitMax) {
      commonBits++;
    } else {
      break;
    }
  }

  const aggregatedPrefix = commonBits;
  const maskNum = prefixToMaskNumber(aggregatedPrefix);
  const wildcardNum = (~maskNum) >>> 0;
  const aggNetNum = (minIp & maskNum) >>> 0;
  const aggEndNum = (aggNetNum + wildcardNum) >>> 0;

  const totalAggAddresses = aggregatedPrefix === 0 ? 4294967296 : Math.pow(2, 32 - aggregatedPrefix);

  // Calculate union of input addresses to check for exactness
  // Merge intervals to avoid counting overlaps twice
  const intervals: { start: number; end: number }[] = [];
  for (const item of parsedList) {
    if (intervals.length === 0) {
      intervals.push({ start: item.startIpNum, end: item.endIpNum });
    } else {
      const last = intervals[intervals.length - 1];
      if (item.startIpNum <= last.end + 1) {
        last.end = Math.max(last.end, item.endIpNum);
      } else {
        intervals.push({ start: item.startIpNum, end: item.endIpNum });
      }
    }
  }

  let inputTotalCovered = 0;
  for (const inv of intervals) {
    inputTotalCovered += (inv.end - inv.start + 1);
  }

  // Check if intervals exactly match [aggNetNum .. aggEndNum]
  const isExact =
    intervals.length === 1 &&
    intervals[0].start === aggNetNum &&
    intervals[0].end === aggEndNum;

  const extraAddresses = Math.max(0, totalAggAddresses - inputTotalCovered);

  // Find extra blocks (missing subnets inside aggregate)
  const extraBlocks: string[] = [];
  if (!isExact) {
    let checkPtr = aggNetNum;
    for (const inv of intervals) {
      if (inv.start > checkPtr) {
        // Gap from checkPtr to inv.start - 1
        decomposeRangeToCidr(checkPtr, inv.start - 1, extraBlocks);
      }
      checkPtr = (inv.end + 1) >>> 0;
    }
    if (checkPtr <= aggEndNum) {
      decomposeRangeToCidr(checkPtr, aggEndNum, extraBlocks);
    }
  }

  let explanation = '';
  const aggCidr = `${numberToIp(aggNetNum)}/${aggregatedPrefix}`;

  if (isExact) {
    explanation = `The supplied networks form an exact contiguous supernet (${aggCidr}) with no missing or additional address space.`;
  } else {
    explanation = `These networks cannot be represented exactly by one CIDR block. The smallest containing aggregate is ${aggCidr} and includes additional address space (${extraAddresses.toLocaleString()} unused addresses).`;
  }

  return {
    inputNetworks: parsedList,
    aggregatedCidr: aggCidr,
    aggregatedNetwork: numberToIp(aggNetNum),
    aggregatedPrefix,
    subnetMask: prefixToMaskString(aggregatedPrefix),
    wildcardMask: numberToIp(wildcardNum),
    firstAddress: numberToIp(aggNetNum),
    lastAddress: numberToIp(aggEndNum),
    totalAddresses: totalAggAddresses,
    inputTotalAddresses: inputTotalCovered,
    isExact,
    extraAddresses,
    extraBlocks,
    explanation,
    commonPrefixBits: commonBits,
    binaryAggregatedMask: toBinaryDotted(maskNum),
    binaryAggregatedNetwork: toBinaryDotted(aggNetNum),
  };
}

function decomposeRangeToCidr(startNum: number, endNum: number, result: string[]) {
  let curr = startNum;
  while (curr <= endNum) {
    const remaining = (endNum - curr + 1) >>> 0;
    let blockSize = 1;
    while (blockSize * 2 <= remaining && (curr % (blockSize * 2) === 0)) {
      blockSize *= 2;
    }
    const prefix = 32 - Math.log2(blockSize);
    result.push(`${numberToIp(curr)}/${prefix}`);
    if (curr + blockSize - 1 >= endNum) break;
    curr = (curr + blockSize) >>> 0;
  }
}
