import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
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

      const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean)).size;
      const homepageViews = events.filter((e) => e.page_path === '#/' || e.page_path === '' || e.page_path === '#home').length;
      const facultyViews = events.filter((e) => e.page_path.includes('faculty')).length;
      const eventViews = events.filter((e) => e.event_type === 'EVENT_VIEW' || e.page_path.includes('event')).length;
      const devHubViews = events.filter((e) => e.page_path.includes('hub')).length;

      // Calculate top pages
      const pathCounts: Record<string, number> = {};
      events.forEach((e) => {
        const p = e.page_path || '#/';
        pathCounts[p] = (pathCounts[p] || 0) + 1;
      });

      const topPages = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

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
      <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
        Access Restricted: You do not have permission to view website analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[#F2B705]" />
          <div>
            <h2 className="text-base font-extrabold text-white">Website Analytics & Traffic Intelligence</h2>
            <p className="text-xs text-slate-400">
              Visitor page view metrics & portal interactions — <span className="text-[#F2B705] font-bold">Tracked since implementation</span>
            </p>
          </div>
        </div>

        {/* Time Period Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex gap-1 text-xs">
            <button
              onClick={() => setPeriodDays(1)}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                periodDays === 1 ? 'bg-[#003366] text-[#F2B705]' : 'text-slate-400 hover:text-white'
              }`}
            >
              TODAY
            </button>
            <button
              onClick={() => setPeriodDays(7)}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                periodDays === 7 ? 'bg-[#003366] text-[#F2B705]' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 DAYS
            </button>
            <button
              onClick={() => setPeriodDays(30)}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                periodDays === 30 ? 'bg-[#003366] text-[#F2B705]' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 DAYS
            </button>
            <button
              onClick={() => setPeriodDays(90)}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                periodDays === 90 ? 'bg-[#003366] text-[#F2B705]' : 'text-slate-400 hover:text-white'
              }`}
            >
              90 DAYS
            </button>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#F2B705]" />
            Total Page Views
          </span>
          <span className="text-3xl font-black text-[#F2B705]">{metrics.totalViews}</span>
          <p className="text-[11px] text-slate-400">Total tracked views in past {periodDays} days</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            Unique Sessions
          </span>
          <span className="text-3xl font-black text-cyan-400">{metrics.uniqueSessions}</span>
          <p className="text-[11px] text-slate-400">Unique browser sessions</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Faculty Page Views
          </span>
          <span className="text-3xl font-black text-emerald-400">{metrics.facultyViews}</span>
          <p className="text-[11px] text-slate-400">Views on dedicated #/faculty page</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Event Popup Views
          </span>
          <span className="text-3xl font-black text-purple-400">{metrics.eventViews}</span>
          <p className="text-[11px] text-slate-400">Interactions with ISAP Forum event</p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Visited Pages */}
        <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-[#F2B705]">Top Visited Website Routes</h3>
          <div className="space-y-3">
            {metrics.topPages.length === 0 ? (
              <p className="text-xs text-slate-400">No page view events recorded yet for this period.</p>
            ) : (
              metrics.topPages.map((tp) => {
                const percentage = metrics.totalViews > 0 ? Math.round((tp.count / metrics.totalViews) * 100) : 0;
                return (
                  <div key={tp.path} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="font-mono text-white">{tp.path}</span>
                      <span className="text-slate-400">{tp.count} views ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#003366] to-[#00AEEF] rounded-full"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section Metrics Breakdown */}
        <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-[#F2B705]">Section Popularity Breakdown</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
              <span className="text-slate-400 block">Homepage (`#/`)</span>
              <span className="text-xl font-bold text-white">{metrics.homepageViews}</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
              <span className="text-slate-400 block">Faculty Directory (`#/faculty`)</span>
              <span className="text-xl font-bold text-white">{metrics.facultyViews}</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
              <span className="text-slate-400 block">Developers Hub (`#hub`)</span>
              <span className="text-xl font-bold text-white">{metrics.devHubViews}</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
              <span className="text-slate-400 block">Event Popup / Announcements</span>
              <span className="text-xl font-bold text-white">{metrics.eventViews}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
