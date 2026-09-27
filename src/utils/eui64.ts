import { isValidIPv6, parseIPv6ToGroups, bigIntToGroups, compressIPv6 } from './ipv6';

export interface Eui64Result {
  macNormalized: string;
  eui64: string;
  invertedByte0: string;
  originalByte0: string;
  stepExplanation: string[];
  fullIpv6Address?: string;
}

/**
 * Validates and normalizes 48-bit MAC address string to 6 bytes array
 */
export function parseMacAddress(macStr: string): number[] {
  const cleaned = macStr.trim().replace(/[:.\-\s]/g, '');
  if (cleaned.length !== 12 || !/^[0-9a-fA-F]{12}$/.test(cleaned)) {
    throw new Error('Please enter a valid 12-character MAC address (e.g. 00:1A:2B:3C:4D:5E or 001a.2b3c.4d5e).');
  }

  const bytes: number[] = [];
  for (let i = 0; i < 12; i += 2) {
    bytes.push(parseInt(cleaned.slice(i, i + 2), 16));
  }
  return bytes;
}

/**
 * Calculates modified EUI-64 interface identifier from 48-bit MAC address
 */
export function macToEui64(macInput: string, ipv6PrefixInput?: string): Eui64Result {
  const bytes = parseMacAddress(macInput);

  // Original byte 0
  const origByte0 = bytes[0];
  // Invert universal/local bit (bit 7, mask 0x02)
  const modifiedByte0 = origByte0 ^ 0x02;

  // Insert 0xFF, 0xFE in the middle (between byte 2 and byte 3)
  const eui64Bytes = [
    modifiedByte0,
    bytes[1],
    bytes[2],
    0xff,
    0xfe,
    bytes[3],
    bytes[4],
    bytes[5],
  ];

  // Group into 4 16-bit hex words: xxxx:xxxx:xxxx:xxxx
  const words: string[] = [];
  for (let i = 0; i < 8; i += 2) {
    const wordVal = (eui64Bytes[i] << 8) | eui64Bytes[i + 1];
    words.push(wordVal.toString(16).padStart(4, '0'));
  }

  const eui64 = words.join(':');
  const macNormalized = bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(':');

  const stepExplanation = [
    `1. Split 48-bit MAC into two 24-bit halves: ${bytes.slice(0, 3).map((b) => b.toString(16).padStart(2, '0')).join(':')} and ${bytes.slice(3).map((b) => b.toString(16).padStart(2, '0')).join(':')}`,
    `2. Insert 16-bit 0xFFFE into the middle: ${bytes[0].toString(16).padStart(2, '0')}:${bytes[1].toString(16).padStart(2, '0')}:${bytes[2].toString(16).padStart(2, '0')}:ff:fe:${bytes[3].toString(16).padStart(2, '0')}:${bytes[4].toString(16).padStart(2, '0')}:${bytes[5].toString(16).padStart(2, '0')}`,
    `3. Invert the 7th bit (Universal/Local bit) of first octet (0x${origByte0.toString(16).padStart(2, '0')} XOR 0x02 = 0x${modifiedByte0.toString(16).padStart(2, '0')})`,
    `4. Resulting 64-bit Modified EUI-64 Interface Identifier: ${eui64}`,
  ];

  let fullIpv6Address: string | undefined;

  if (ipv6PrefixInput && ipv6PrefixInput.trim()) {
    let cleanPrefix = ipv6PrefixInput.trim();
    if (cleanPrefix.endsWith('/64')) {
      cleanPrefix = cleanPrefix.slice(0, -3);
    }
    if (!isValidIPv6(cleanPrefix)) {
      throw new Error(`Invalid IPv6 /64 prefix: "${ipv6PrefixInput}". Expected e.g. 2001:db8:1:1::/64`);
    }

    const prefixGroups = parseIPv6ToGroups(cleanPrefix);
    // Take first 4 groups from prefix, and 4 groups from EUI-64
    const euiGroups = words.map((w) => parseInt(w, 16));
    const fullGroups = [
      prefixGroups[0],
      prefixGroups[1],
      prefixGroups[2],
      prefixGroups[3],
      euiGroups[0],
      euiGroups[1],
      euiGroups[2],
      euiGroups[3],
    ];

    fullIpv6Address = compressIPv6(fullGroups);
    stepExplanation.push(
      `5. Combine /64 prefix (${cleanPrefix}) with EUI-64 to form full IPv6 SLAAC address: ${fullIpv6Address}`
    );
  }

  return {
    macNormalized,
    eui64,
    originalByte0: `0x${origByte0.toString(16).padStart(2, '0')}`,
    invertedByte0: `0x${modifiedByte0.toString(16).padStart(2, '0')}`,
    stepExplanation,
    fullIpv6Address,
  };
}
