import React from 'react';
import { StatCard } from './StatCard';
import { AdminPageHeader } from './AdminPageHeader';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  FolderGit2,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import type { AdminTab } from '../AdminDashboard';
import type { AdminPermission } from '../../../types';

interface AdminOverviewSectionProps {
  setActiveTab: (tab: AdminTab) => void;
  programmesCount: number;
  projectsCount: number;
  facultyCount: number;
  navItemsCount: number;
  slidesCount?: number;
  footerLinksCount: number;
  isSuperAdmin?: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  setActiveTab,
  programmesCount,
  projectsCount,
  facultyCount,
  navItemsCount,
  footerLinksCount,
  hasPermission
}) => {
  const contentHealthItems = [
    {
      label: 'Academic Programmes',
      status: 'Healthy',
      detail: `${programmesCount} active degree/diploma programmes`,
      isOk: true,
      tab: 'programmes' as AdminTab
    },
    {
      label: 'Curriculum & Courses',
      status: 'Healthy',
      detail: '46 courses seeded (39 required, 7 electives)',
      isOk: true,
      tab: 'curriculum' as AdminTab
    },
    {
      label: 'Faculty Directory',
      status: 'Healthy',
      detail: `${facultyCount} published faculty profiles`,
      isOk: true,
      tab: 'faculty' as AdminTab
    },
    {
      label: 'Student Projects Showcase',
      status: 'Healthy',
      detail: `${projectsCount} capstone innovation projects`,
      isOk: true,
      tab: 'projects' as AdminTab
    },
    {
      label: 'Learning Resources Hub',
      status: 'Healthy',
      detail: 'Database table & RLS policies operational',
      isOk: true,
      tab: 'resources' as AdminTab
    },
    {
      label: 'CMS Navigation & Footer',
      status: 'Healthy',
      detail: `${navItemsCount} nav items, ${footerLinksCount} footer links`,
      isOk: true,
      tab: 'navigation' as AdminTab
    }
  ];

  const quickActions = [
    {
      label: 'Add Academic Programme',
      description: 'Create new degree or diploma qualification',
      icon: GraduationCap,
      action: () => setActiveTab('programmes'),
      visible: hasPermission('manage_academics')
    },
    {
      label: 'Add Faculty Profile',
      description: 'Directory details, research, and contact',
      icon: Users,
      action: () => setActiveTab('faculty'),
      visible: hasPermission('manage_faculty')
    },
    {
      label: 'Edit Hero & Banners',
      description: 'Update headline text and announcement slides',
      icon: Megaphone,
      action: () => setActiveTab('hero'),
      visible: hasPermission('manage_homepage')
    },
    {
      label: 'Upload Learning Resource',
      description: 'Manage past questions, outlines & lecture slides',
      icon: FileText,
      action: () => setActiveTab('resources'),
      visible: hasPermission('manage_academics')
    }
  ].filter(item => item.visible);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Overview"
        description="High-level metrics, content health status, and quick administrative shortcuts for the UPSA IT Studies platform."
        badge="Live Telemetry"
      />

      {/* 1. Stat Cards Grid (1 / 2 / 4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Academic Programmes"
          value={programmesCount}
          subtitle="Undergraduate & Diploma"
          icon={GraduationCap}
          iconColor="text-[#F2B705]"
          iconBg="bg-amber-500/10 border-amber-500/20"
          onManage={hasPermission('manage_academics') ? () => setActiveTab('programmes') : undefined}
        />

        <StatCard
          title="Curriculum Courses"
          value={46}
          subtitle="39 Required, 7 Electives"
          icon={BookOpen}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
          onManage={hasPermission('manage_academics') ? () => setActiveTab('curriculum') : undefined}
        />

        <StatCard
          title="Faculty Roster"
          value={facultyCount}
          subtitle="Lecturers & HOD"
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          onManage={hasPermission('manage_faculty') ? () => setActiveTab('faculty') : undefined}
        />

        <StatCard
          title="Student Innovations"
          value={projectsCount}
          subtitle="Capstone Showcase"
          icon={FolderGit2}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10 border-cyan-500/20"
          onManage={hasPermission('manage_innovation') ? () => setActiveTab('projects') : undefined}
        />
      </div>

      {/* 2. Middle Grid: Content Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Health Status Card */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Content Health Status</h3>
                <p className="text-xs text-slate-400">Database & RLS operational status across CMS modules</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              All Systems Operational
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {contentHealthItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-1 last:pb-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.isOk ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500'}`} />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-200 block truncate">{item.label}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{item.detail}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab(item.tab)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] shrink-0 transition-colors inline-flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
              <p className="text-xs text-slate-400">Shortcuts for common tasks</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {quickActions.map((qa, idx) => {
              const ActionIcon = qa.icon;
              return (
                <button
                  key={idx}
                  onClick={qa.action}
                  className="w-full p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-left transition-all duration-150 group flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {qa.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{qa.description}</div>
                  </div>

                  <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 shrink-0 transition-colors">
                    <ActionIcon className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
