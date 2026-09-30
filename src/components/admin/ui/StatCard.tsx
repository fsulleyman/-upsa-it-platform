import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  onManage?: () => void;
  manageLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/10 border-blue-500/20',
  onManage,
  manageLabel = 'Manage'
}) => {
  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4 group">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 block tracking-wide">{title}</span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</div>
        </div>

        <div className={`p-2.5 rounded-xl border ${iconBg} ${iconColor} shrink-0 transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        {subtitle ? (
          <span className="text-slate-500 font-medium truncate max-w-[180px]">{subtitle}</span>
        ) : (
          <span className="text-slate-500 font-medium">Active in database</span>
        )}

        {onManage && (
          <button
            onClick={onManage}
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors group/btn"
          >
            <span>{manageLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};
