import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/formatting';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  title?: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  className = '',
  title = 'Copy to clipboard',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer select-none rounded focus-visible:outline-2 focus-visible:outline-blue-500 ${
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      } ${
        copied
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
      } ${className}`}
      aria-label={label || 'Copy'}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
