import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { StatCard } from './ui/StatCard';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { BarChart3, Eye, Users, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';

interface AnalyticsMetric {
  totalViews: number;
  uniqueSessions: number;
  homepageViews: number;
  facultyViews: number;
  eventViews: number;
  devHubViews: number;
  topPages: { path: string; count: number }[];
}

export const AnalyticsSection: React.FC = () => {
  const { hasPermission } = useAuth();
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<AnalyticsMetric>({
    totalViews: 0,
    uniqueSessions: 0,
    homepageViews: 0,
    facultyViews: 0,
    eventViews: 0,
    devHubViews: 0,
    topPages: []
  });

  const fetchAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      const { data, error } = await supabase
        .from('site_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const events = data || [];
      const totalViews = events.length;

      const sessionsSet = new Set(events.map((e) => e.session_id).filter(Boolean));
      const uniqueSessions = sessionsSet.size;

      const homepageViews = events.filter((e) => e.page_path === 'home' || e.page_path === '/').length;
      const facultyViews = events.filter((e) => e.page_path === 'faculty' || e.event_type === 'FACULTY_PROFILE_VIEW').length;
      const eventViews = events.filter((e) => e.event_type === 'EVENT_VIEW').length;
      const devHubViews = events.filter((e) => e.page_path === 'hub').length;

      const pathCounts: Record<string, number> = {};
      events.forEach((e) => {
        const path = e.page_path || 'unknown';
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      });

      const topPages = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setMetrics({
        totalViews,
        uniqueSessions,
        homepageViews,
        facultyViews,
        eventViews,
        devHubViews,
        topPages
      });
    } catch (err) {
      console.warn('Notice loading analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!hasPermission('view_analytics')) {
    return (
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
        Access Restricted: You do not have permission to view site analytics.
      </div>
    );
  }

  const columns: Column<{ path: string; count: number }>[] = [
    {
      header: 'Page Path / Section',
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-white">/{row.path}</span>
      )
    },
    {
      header: 'Page Views',
      accessor: (row) => (
        <span className="font-mono text-xs font-semibold text-blue-400">{row.count} views</span>
      )
    },
    {
      header: 'Traffic Percentage',
      headerClassName: 'text-right',
      className: 'text-right',
      accessor: (row) => {
        const pct = metrics.totalViews > 0 ? ((row.count / metrics.totalViews) * 100).toFixed(1) : '0';
        return <span className="font-mono text-xs text-slate-400">{pct}%</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Visitor Analytics"
        description="Aggregate page visits, user engagement, profile views, and popular sections."
      >
        <div className="flex items-center gap-2">
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </AdminPageHeader>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={metrics.totalViews}
          subtitle={`Over last ${periodDays} days`}
          icon={Eye}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />

        <StatCard
          title="Unique Visitor Sessions"
          value={metrics.uniqueSessions}
          subtitle="Distinct session tokens"
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />

        <StatCard
          title="Faculty Roster Views"
          value={metrics.facultyViews}
          subtitle="Profile interactions"
          icon={TrendingUp}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10 border-cyan-500/20"
        />

        <StatCard
          title="Event Popup Interactions"
          value={metrics.eventViews}
          subtitle="ISAP Forum & announcements"
          icon={Sparkles}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Top Pages Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Most Visited Pages</h3>
        <DataTable
          columns={columns}
          data={metrics.topPages}
          loading={loading}
          keyExtractor={(item) => item.path}
          emptyMessage="No analytics data available"
          emptySubtext="Analytics telemetry will populate as visitors browse the website."
          emptyIcon={<BarChart3 className="w-6 h-6 text-slate-400" />}
        />
      </div>
    </div>
  );
};
