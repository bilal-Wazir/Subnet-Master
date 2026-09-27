import React from 'react';
import { CopyButton } from './CopyButton';
import { Tooltip } from './Tooltip';

interface ResultCardProps {
  label: string;
  value: string | number;
  copyValue?: string;
  tooltip?: string;
  subtext?: string;
  highlight?: boolean;
  monospace?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  copyValue,
  tooltip,
  subtext,
  highlight = false,
  monospace = true,
}) => {
  const strVal = String(value);
  const textToCopy = copyValue ?? strVal;

  return (
    <div
      className={`p-3.5 rounded-lg border transition-all ${
        highlight
          ? 'bg-blue-50/70 border-blue-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center text-xs font-medium text-slate-500">
          <span>{label}</span>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
        <CopyButton text={textToCopy} title={`Copy ${label}`} />
      </div>

      <div
        className={`text-sm sm:text-base font-semibold text-slate-900 truncate select-all ${
          monospace ? 'font-mono' : ''
        }`}
        title={strVal}
      >
        {strVal}
      </div>

      {subtext && <div className="mt-1 text-xs text-slate-500">{subtext}</div>}
    </div>
  );
};
