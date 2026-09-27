/**
 * Formatting and Clipboard utilities
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    textArea.remove();
    return success;
  } catch {
    return false;
  }
}

export function formatNumber(n: number | bigint): string {
  return n.toLocaleString();
}

export function formatBinaryWithSpacing(bin: string): string {
  // Format 11000000.10101000.00001010.00011001 into groups of 4 or preserve dots
  return bin;
}
