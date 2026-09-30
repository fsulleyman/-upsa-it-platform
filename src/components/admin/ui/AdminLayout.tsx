import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { CheckCircle, X } from 'lucide-react';
import type { AdminTab } from '../AdminDashboard';
import type { AdminPermission } from '../../../types';

interface AdminLayoutProps {
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
  onNavigateHome: () => void;
  onLogout: () => void;
  userEmail?: string;
  fullName?: string;
  role?: string;
  notice?: string | null;
  onCloseNotice?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  hasPermission,
  isSuperAdmin,
  counts,
  onNavigateHome,
  onLogout,
  userEmail,
  fullName,
  role,
  notice,
  onCloseNotice,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col lg:flex-row antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Desktop Sidebar (Fixed 260px) */}
      <div className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen z-40">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasPermission={hasPermission}
          isSuperAdmin={isSuperAdmin}
          counts={counts}
        />
      </div>

      {/* Mobile Drawer Navigation (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative z-10 w-[260px] max-w-[85vw] h-full shadow-2xl">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasPermission={hasPermission}
              isSuperAdmin={isSuperAdmin}
              counts={counts}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Topbar */}
        <AdminTopbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateHome={onNavigateHome}
          onLogout={onLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          userEmail={userEmail}
          fullName={fullName}
          role={role}
        />

        {/* Global Banner Toast Notification */}
        {notice && (
          <div className="bg-blue-900/40 border-b border-blue-500/30 px-4 sm:px-6 py-2.5 text-xs font-medium text-blue-200 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{notice}</span>
            </div>
            {onCloseNotice && (
              <button
                onClick={onCloseNotice}
                className="text-blue-300 hover:text-white p-1 rounded-md hover:bg-blue-800/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Main Content Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
