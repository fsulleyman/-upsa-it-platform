import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmBadgeProps {
  label?: string;
  tooltip?: string;
  className?: string;
}

export const ConfirmBadge: React.FC<ConfirmBadgeProps> = ({
  label = 'CONFIRM',
  tooltip = 'Requires institutional verification before final publication',
  className = ''
}) => {
  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm animate-pulse ${className}`}
    >
      <AlertCircle className="w-3 h-3 text-amber-400" />
      <span>[{label}]</span>
    </span>
  );
};
