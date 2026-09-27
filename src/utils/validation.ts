import { isValidIPv4, parseIPv4 } from './ipv4';
import { isValidIPv6 } from './ipv6';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateIPv4Input(ipStr: string): ValidationResult {
  const trimmed = ipStr.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter an IPv4 address.' };
  }
  if (!isValidIPv4(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid IPv4 address (e.g. 192.168.1.0) with four octets between 0 and 255.',
    };
  }
  return { valid: true };
}

export function validateIPv4Prefix(prefix: number | string): ValidationResult {
  const p = typeof prefix === 'string' ? parseInt(prefix.trim(), 10) : prefix;
  if (isNaN(p) || p < 0 || p > 32) {
    return {
      valid: false,
      error: 'Prefix length must be a whole number between /0 and /32.',
    };
  }
  return { valid: true };
}

export function validateIPv6Input(ipStr: string): ValidationResult {
  const trimmed = ipStr.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter an IPv6 address.' };
  }
  if (!isValidIPv6(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid IPv6 address (e.g. 2001:db8:abcd::1). Check hex characters and group counts.',
    };
  }
  return { valid: true };
}

export function validateIPv6Prefix(prefix: number | string): ValidationResult {
  const p = typeof prefix === 'string' ? parseInt(prefix.trim(), 10) : prefix;
  if (isNaN(p) || p < 0 || p > 128) {
    return {
      valid: false,
      error: 'Prefix length must be a whole number between /0 and /128.',
    };
  }
  return { valid: true };
}
