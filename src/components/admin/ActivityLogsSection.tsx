import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { StatusBadge } from './ui/StatusBadge';
import type { BadgeVariant } from './ui/StatusBadge';
import { History, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminActivityLog } from '../../types';

export const ActivityLogsSection: React.FC = () => {
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchLogs = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      const formatted: AdminActivityLog[] = (data || []).map((l) => ({
        id: l.id,
        adminUserId: l.admin_user_id,
        adminName: l.admin_name || 'System Admin',
        action: l.action,
        resourceType: l.resource_type,
        resourceId: l.resource_id,
        description: l.description,
        metadata: l.metadata,
        createdAt: l.created_at
      }));

      setLogs(formatted);
    } catch (err) {
      console.warn('Notice loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (!hasPermission('view_activity_logs')) {
    return (
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
        Access Restricted: You do not have permission to view administrative activity logs.
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'ALL' || log.resourceType === resourceFilter;

    return matchesSearch && matchesAction && matchesResource;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionBadgeVariant = (action: string): BadgeVariant => {
    switch (action) {
      case 'CREATE':
        return 'active';
      case 'UPDATE':
      case 'UPDATE_PERMISSIONS':
        return 'info';
      case 'DELETE':
      case 'DELETE_ADMIN':
        return 'danger';
      case 'PASSWORD_RESET':
      case 'PASSWORD_RESET_REQUESTED':
      case 'CHANGE_PASSWORD':
        return 'warning';
      case 'PUBLISH':
        return 'success';
      case 'UNPUBLISH':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  const columns: Column<AdminActivityLog>[] = [
    {
      header: 'Timestamp',
      accessor: (row) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs text-white block">{getRelativeTime(row.createdAt)}</span>
          <span className="text-[10px] text-slate-500 block font-mono">
            {new Date(row.createdAt).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      header: 'Administrator',
      accessor: (row) => (
        <span className="font-bold text-slate-200 text-xs">{row.adminName}</span>
      )
    },
    {
      header: 'Action',
      accessor: (row) => (
        <StatusBadge variant={getActionBadgeVariant(row.action)} label={row.action} size="sm" />
      )
    },
    {
      header: 'Resource',
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
          {row.resourceType}
        </span>
      )
    },
    {
      header: 'Audit Description',
      accessor: (row) => (
        <p className="text-xs text-slate-300 line-clamp-2">{row.description}</p>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Activity Logs"
        description="Persistent immutable audit trail of administrative actions, mutations, and authentication attempts."
        badge={`${logs.length} Entries`}
      >
        <button
          onClick={fetchLogs}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </AdminPageHeader>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search admin name, action, or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Action Types</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="PASSWORD_RESET">PASSWORD_RESET</option>
            <option value="PUBLISH">PUBLISH</option>
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Resource Types</option>
            <option value="Admin Account">Admin Account</option>
            <option value="Admin Profile">Admin Profile</option>
            <option value="Academic">Academic Programme</option>
            <option value="Learning Resource">Learning Resource</option>
            <option value="Faculty">Faculty Profile</option>
            <option value="Student Project">Student Project</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedLogs}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No activity logs found"
        emptySubtext="Administrative mutations and authentications will be recorded here automatically."
        emptyIcon={<History className="w-6 h-6 text-slate-400" />}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
