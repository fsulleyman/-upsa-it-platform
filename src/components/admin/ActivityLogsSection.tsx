import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
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
      <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
        Access Restricted: You do not have permission to view administrative activity logs.
      </div>
    );
  }

  // Filtering
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

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-[#F2B705]" />
          <div>
            <h2 className="text-base font-extrabold text-white">Administrative Activity Audit Logs</h2>
            <p className="text-xs text-slate-400">Persistent immutable audit log of administrative actions, mutations, and authentications</p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search logs by keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
          />
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="CHANGE_PERMISSIONS">CHANGE_PERMISSIONS</option>
            <option value="CHANGE_PASSWORD">CHANGE_PASSWORD</option>
            <option value="CHANGE_EMAIL">CHANGE_EMAIL</option>
            <option value="ACTIVATE_ADMIN">ACTIVATE_ADMIN</option>
            <option value="DEACTIVATE_ADMIN">DEACTIVATE_ADMIN</option>
          </select>
        </div>

        <div>
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
          >
            <option value="ALL">All Resource Types</option>
            <option value="Faculty">Faculty</option>
            <option value="Event">Event</option>
            <option value="Homepage">Homepage</option>
            <option value="Navbar">Navbar</option>
            <option value="Academic">Academic</option>
            <option value="Student Project">Student Project</option>
            <option value="Admin Account">Admin Account</option>
            <option value="Admin Profile">Admin Profile</option>
            <option value="Auth">Auth</option>
          </select>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-700">
            <tr>
              <th className="p-3">Date / Time</th>
              <th className="p-3">Administrator</th>
              <th className="p-3">Action</th>
              <th className="p-3">Resource</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">Loading activity logs...</td>
              </tr>
            ) : paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">No matching activity logs found.</td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 font-extrabold text-white">{log.adminName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      log.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                      log.action === 'DELETE' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                      log.action === 'LOGIN' || log.action === 'LOGOUT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#00AEEF]">{log.resourceType}</td>
                  <td className="p-3 text-slate-200">{log.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
        <span>Showing {paginatedLogs.length} of {filteredLogs.length} activity records</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-white">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
