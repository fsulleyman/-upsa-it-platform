import React, { useState, useRef, useEffect } from 'react';
import { Menu, ExternalLink, LogOut, UserCheck, ChevronDown } from 'lucide-react';
import type { AdminTab } from '../AdminDashboard';

interface AdminTopbarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  userEmail?: string;
  fullName?: string;
  role?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  setActiveTab,
  onNavigateHome,
  onLogout,
  onOpenMobileMenu,
  userEmail = 'admin@upsa.edu.gh',
  fullName = 'Administrator',
  role = 'super_admin'
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute section category and title for breadcrumb
  const getBreadcrumb = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return { category: 'Dashboard', page: 'Overview' };
      case 'hero':
        return { category: 'Content', page: 'Hero & Banners' };
      case 'navigation':
        return { category: 'Content', page: 'Navigation' };
      case 'programmes':
        return { category: 'Content', page: 'Programmes' };
      case 'curriculum':
        return { category: 'Content', page: 'Curriculum & Courses' };
      case 'resources':
        return { category: 'Content', page: 'Learning Resources' };
      case 'projects':
        return { category: 'Content', page: 'Student Projects' };
      case 'faculty':
        return { category: 'Content', page: 'Faculty Directory' };
      case 'event':
        return { category: 'Content', page: 'Event Popup' };
      case 'footer':
        return { category: 'Content', page: 'Footer Links' };
      case 'social':
        return { category: 'Content', page: 'Social Links' };
      case 'settings':
        return { category: 'Content', page: 'Site SEO Settings' };
      case 'my_account':
        return { category: 'Administration', page: 'My Account' };
      case 'admin_mgmt':
        return { category: 'Administration', page: 'Admin Management' };
      case 'analytics':
        return { category: 'Administration', page: 'System Analytics' };
      case 'activity_logs':
        return { category: 'Administration', page: 'Audit Activity Logs' };
      default:
        return { category: 'Dashboard', page: 'Overview' };
    }
  };

  const breadcrumb = getBreadcrumb(activeTab);

  // Initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase() || 'AD';
  };

  const isSuper = role === 'super_admin';

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md bg-slate-900/95">
      {/* Left section: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-500 hidden sm:inline">{breadcrumb.category}</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-200 font-semibold">{breadcrumb.page}</span>
        </div>
      </div>

      {/* Right section: Live Link & User Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span className="hidden sm:inline">View Live Website</span>
          <span className="sm:hidden">Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
          >
            <div className="w-7 h-7 rounded-md bg-[#003366] text-[#F2B705] font-bold text-xs flex items-center justify-center border border-[#F2B705]/30 shrink-0">
              {getInitials(fullName)}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-white leading-tight">{fullName}</div>
              <div className="text-[10px] text-slate-400 font-medium">
                {isSuper ? 'Super Admin' : 'Sub Admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2.5 border-b border-slate-800">
                <p className="font-semibold text-white truncate">{fullName}</p>
                <p className="text-slate-400 text-[11px] truncate mt-0.5">{userEmail}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isSuper
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {isSuper ? 'Super Administrator' : 'Sub Administrator'}
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveTab('my_account');
                  setDropdownOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>My Account</span>
              </button>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full px-3.5 py-2 text-left text-slate-400 hover:text-red-400 hover:bg-slate-800/80 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
