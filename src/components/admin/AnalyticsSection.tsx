import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { StatCard } from './ui/StatCard';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { BarChart3, Eye, Users, TrendingUp, RefreshCw, Download, FileText, AlertCircle } from 'lucide-react';

interface TopResourceItem {
  resourceId: string;
  title: string;
  courseId: string;
  downloads: number;
}

interface AnalyticsMetric {
  totalViews: number;
  uniqueSessions: number;
  homepageViews: number;
  facultyViews: number;
  eventViews: number;
  devHubViews: number;
  resourceDownloads: number;
  topPages: { path: string; count: number }[];
  topResources: TopResourceItem[];
}

export const AnalyticsSection: React.FC = () => {
  const { hasPermission } = useAuth();
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [topResourcesError, setTopResourcesError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetric>({
    totalViews: 0,
    uniqueSessions: 0,
    homepageViews: 0,
    facultyViews: 0,
    eventViews: 0,
    devHubViews: 0,
    resourceDownloads: 0,
    topPages: [],
    topResources: []
  });

  const fetchAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setTopResourcesError(null);

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

      // Filter resource events (downloads or views)
      const resourceEvents = events.filter(
        (e) =>
          e.event_type === 'RESOURCE_DOWNLOAD' ||
          e.event_type === 'RESOURCE_VIEW' ||
          e.event_type === 'DOCUMENT_VIEW' ||
          (e.metadata && (e.metadata.resource_id || e.metadata.event === 'download'))
      );

      const resourceDownloads = resourceEvents.length;

      // Build Top Resources strictly via server-side RPC get_top_learning_resources
      let topResources: TopResourceItem[] = [];
      const { data: rpcTopRes, error: rpcErr } = await supabase.rpc('get_top_learning_resources', {
        p_days: periodDays,
        p_limit: 10
      });

      if (rpcErr) {
        console.error('Failed to load top resources via get_top_learning_resources RPC:', rpcErr.message || rpcErr);
        setTopResourcesError('Could not load top resources');
      } else if (Array.isArray(rpcTopRes)) {
        topResources = rpcTopRes.map((r: any) => ({
          resourceId: r.resource_id,
          title: r.title,
          courseId: r.course_code,
          downloads: Number(r.open_count)
        }));
      }

      // Path counts for pages
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
        resourceDownloads,
        topPages,
        topResources
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

  const columnsPages: Column<{ path: string; count: number }>[] = [
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

  const columnsResources: Column<TopResourceItem>[] = [
    {
      header: 'Resource Title',
      accessor: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-white block">{row.title}</span>
          <span className="font-mono text-[10px] text-slate-400">ID: {row.resourceId}</span>
        </div>
      )
    },
    {
      header: 'Associated Course',
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {row.courseId}
        </span>
      )
    },
    {
      header: 'Opens / Accesses',
      headerClassName: 'text-right',
      className: 'text-right',
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>{row.downloads} opens</span>
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Visitor Analytics"
        description="Aggregate page visits, user engagement, resource opens, and popular learning materials."
      >
        <div className="flex items-center gap-2">
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
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
          title="Learning Resource Opens"
          value={metrics.resourceDownloads}
          subtitle="Resource accesses & opens"
          icon={Download}
          iconColor="text-[#F2B705]"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />

        <StatCard
          title="Faculty Roster Views"
          value={metrics.facultyViews}
          subtitle="Profile interactions"
          icon={TrendingUp}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10 border-cyan-500/20"
        />
      </div>

      {/* Top Resources Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#F2B705]" />
            <span>Top Opened Learning Resources</span>
          </h3>
          <span className="text-xs text-slate-400">Ranked by student engagement</span>
        </div>
        {topResourcesError ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Could not load top resources</span>
          </div>
        ) : (
          <DataTable
            columns={columnsResources}
            data={metrics.topResources}
            loading={loading}
            keyExtractor={(item) => item.resourceId}
            emptyMessage="No learning resource open data available yet"
            emptySubtext="Telemetry will populate as students view and open course materials."
            emptyIcon={<FileText className="w-6 h-6 text-slate-400" />}
          />
        )}
      </div>

      {/* Top Pages Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>Most Visited Site Pages</span>
        </h3>
        <DataTable
          columns={columnsPages}
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
