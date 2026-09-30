import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Compass,
  GraduationCap,
  BookOpen,
  FileText,
  FolderGit2,
  Users,
  Sparkles,
  LayoutList,
  Share2,
  Settings,
  UserCheck,
  Shield,
  BarChart3,
  History,
  X
} from 'lucide-react';
import type { AdminTab } from '../AdminDashboard';
import type { AdminPermission } from '../../../types';

interface SidebarNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  hasPermission: (permission: AdminPermission) => boolean;
  isSuperAdmin: boolean;
  counts: {
    slides: number;
    navItems: number;
    programmes: number;
    projects: number;
    faculty: number;
    footerLinks: number;
    socialLinks: number;
  };
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  hasPermission,
  isSuperAdmin,
  counts,
  onCloseMobile
}) => {
  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const overviewItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: LayoutDashboard,
      visible: true
    }
  ];

  const contentItems = [
    {
      id: 'hero' as AdminTab,
      label: 'Hero & Banners',
      icon: Megaphone,
      badge: counts.slides > 0 ? counts.slides : undefined,
      visible: hasPermission('manage_homepage')
    },
    {
      id: 'navigation' as AdminTab,
      label: 'Navigation',
      icon: Compass,
      badge: counts.navItems > 0 ? counts.navItems : undefined,
      visible: hasPermission('manage_navbar')
    },
    {
      id: 'programmes' as AdminTab,
      label: 'Programmes',
      icon: GraduationCap,
      badge: counts.programmes > 0 ? counts.programmes : undefined,
      visible: hasPermission('manage_academics')
    },
    {
      id: 'curriculum' as AdminTab,
      label: 'Curriculum / Courses',
      icon: BookOpen,
      visible: hasPermission('manage_academics')
    },
    {
      id: 'resources' as AdminTab,
      label: 'Learning Resources',
      icon: FileText,
      visible: hasPermission('manage_academics')
    },
    {
      id: 'projects' as AdminTab,
      label: 'Student Projects',
      icon: FolderGit2,
      badge: counts.projects > 0 ? counts.projects : undefined,
      visible: hasPermission('manage_innovation')
    },
    {
      id: 'faculty' as AdminTab,
      label: 'Faculty Directory',
      icon: Users,
      badge: counts.faculty > 0 ? counts.faculty : undefined,
      visible: hasPermission('manage_faculty')
    },
    {
      id: 'event' as AdminTab,
      label: 'Event Popup',
      icon: Sparkles,
      visible: hasPermission('manage_events')
    },
    {
      id: 'footer' as AdminTab,
      label: 'Footer Links',
      icon: LayoutList,
      badge: counts.footerLinks > 0 ? counts.footerLinks : undefined,
      visible: hasPermission('manage_community')
    },
    {
      id: 'social' as AdminTab,
      label: 'Social Links',
      icon: Share2,
      badge: counts.socialLinks > 0 ? counts.socialLinks : undefined,
      visible: hasPermission('manage_community')
    },
    {
      id: 'settings' as AdminTab,
      label: 'Site SEO Settings',
      icon: Settings,
      visible: hasPermission('manage_homepage')
    }
  ];

  const adminItems = [
    {
      id: 'my_account' as AdminTab,
      label: 'My Account',
      icon: UserCheck,
      visible: true
    },
    {
      id: 'admin_mgmt' as AdminTab,
      label: 'Admin Management',
      icon: Shield,
      visible: isSuperAdmin
    },
    {
      id: 'analytics' as AdminTab,
      label: 'System Analytics',
      icon: BarChart3,
      visible: hasPermission('view_analytics')
    },
    {
      id: 'activity_logs' as AdminTab,
      label: 'Audit Activity Logs',
      icon: History,
      visible: hasPermission('view_activity_logs')
    }
  ];

  const renderNavGroup = (title: string, items: typeof contentItems) => {
    const visibleItems = items.filter(item => item.visible);
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1 py-2">
        <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="h-full flex flex-col bg-slate-900 border-r border-slate-800/90 text-slate-200 w-[260px] shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#003366] border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705] font-extrabold text-xs shadow-inner shrink-0">
            UPSA
          </div>
          <div>
            <span className="font-semibold text-xs tracking-tight text-white block">UPSA IT Studies</span>
            <span className="text-[10px] text-slate-400 font-mono block">SaaS Admin Portal</span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {renderNavGroup('Overview', overviewItems)}
        {renderNavGroup('Content Management', contentItems)}
        {renderNavGroup('Administration', adminItems)}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/40">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Production Active</span>
        </div>
      </div>
    </aside>
  );
};
