import React from 'react';

interface AdSlotProps {
  label?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  label = 'Sponsored / Developer Tools',
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`my-8 mx-auto border border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-3 text-center transition-all ${
        format === 'horizontal' ? 'max-w-4xl h-24 sm:h-28' : 'max-w-xs h-64'
      } flex flex-col items-center justify-center ${className}`}
      aria-label="Advertisement area"
    >
      <span className="text-3xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
        {label}
      </span>
      <p className="text-xs text-slate-400 font-normal">
        Reserved Advertisement Space · Responsive Banner Placement
      </p>
    </div>
  );
};
