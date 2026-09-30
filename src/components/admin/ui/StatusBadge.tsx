import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'inactive'
  | 'required'
  | 'elective'
  | 'super_admin'
  | 'sub_admin'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  label: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  label,
  size = 'md'
}) => {
  const getVariantStyles = (v: BadgeVariant) => {
    switch (v) {
      case 'active':
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'inactive':
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'required':
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'elective':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'super_admin':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'sub_admin':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'neutral':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700/60';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide font-mono ${getVariantStyles(
        variant
      )} ${sizeStyles}`}
    >
      {label}
    </span>
  );
};
