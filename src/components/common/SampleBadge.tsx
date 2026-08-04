import React from 'react';
import { Tag } from 'lucide-react';

interface SampleBadgeProps {
  label?: string;
  className?: string;
}

export const SampleBadge: React.FC<SampleBadgeProps> = ({
  label = 'Sample Showcase',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/40 ${className}`}
    >
      <Tag className="w-3 h-3 text-purple-400" />
      <span>[{label}]</span>
    </span>
  );
};
