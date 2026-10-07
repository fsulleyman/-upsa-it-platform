import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { StatusBadge } from './ui/StatusBadge';
import { FormInput } from './ui/FormField';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { Shield, Plus, Edit2, Trash2, KeyRound, AlertTriangle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import type { AdminProfile, AdminPermission } from '../../types';

const getPasswordStrength = (pass: string): { label: string; color: string; bg: string; percentage: number } => {
  if (!pass) return { label: '', color: '', bg: '', percentage: 0 };
  if (pass.length < 6) return { label: 'Weak (Min 6 chars)', color: 'text-red-400', bg: 'bg-red-500', percentage: 25 };
  
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (pass.length >= 12) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { label: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500', percentage: 50 };
  if (score <= 3) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500', percentage: 75 };
  return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500', percentage: 100 };
};

const ALL_PERMISSIONS: { id: AdminPermission; label: string }[] = [
  { id: 'manage_faculty', label: 'Manage Faculty Directory' },
  { id: 'manage_events', label: 'Manage Event Announcements' },
  { id: 'manage_homepage', label: 'Manage Homepage (Hero & Banners)' },
  { id: 'manage_navbar', label: 'Manage Navigation Items' },
  { id: 'manage_academics', label: 'Manage Programmes & Curriculum' },
  { id: 'manage_community', label: 'Manage Community & Footer Links' },
  { id: 'manage_innovation', label: 'Manage Student Projects Showcase' },
  { id: 'manage_hub', label: 'Manage Developers Hub' },
  { id: 'manage_media', label: 'Manage Images & Storage Media' },
  { id: 'view_analytics', label: 'View System Analytics' },
  { id: 'view_activity_logs', label: 'View Audit Activity Logs' }
];

export const AdminManagementSection: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals & Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState<AdminProfile | null>(null);
  const [resetMode, setResetMode] = useState<'email' | 'temporary'>('email');
  const [tempPasswordInput, setTempPasswordInput] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Confirm delete/deactivate state
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminProfile | null>(null);

  // New Admin Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPermissions, setNewPermissions] = useState<AdminPermission[]>([
    'manage_faculty',
    'manage_events',
    'view_analytics'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { data: profiles, error: profErr } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profErr) {
        if (
          profErr.message.includes('admin_profiles') ||
          profErr.message.includes('schema cache') ||
          profErr.code === 'PGRST204' ||
          profErr.code === '42P01'
        ) {
          setErrorMsg(
            "Table 'public.admin_profiles' missing from schema cache. Execute 'src/lib/admin_system_migration.sql' in Supabase SQL Editor."
          );
          setLoading(false);
          return;
        }
        throw profErr;
      }

      const { data: permsData } = await supabase.from('admin_permissions').select('*');

      const mapped: AdminProfile[] = (profiles || []).map((p) => {
        const userPerms = (permsData || [])
          .filter((pm) => pm.admin_user_id === p.user_id)
          .map((pm) => pm.permission as AdminPermission);

        return {
          id: p.id,
          userId: p.user_id,
          fullName: p.full_name,
          email: p.email,
          role: p.role,
          isActive: p.is_active,
          lastLoginAt: p.last_login_at,
          createdAt: p.created_at,
          permissions: userPerms
        };
      });

      setAdmins(mapped);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to fetch administrator profiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPassword) {
      alert('Full Name, Email, and Password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const functionUrl = `${supabaseUrl}/functions/v1/create-sub-admin`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFullName.trim(),
          email: newEmail.trim(),
          password: newPassword,
          role: 'sub_admin',
          permissions: newPermissions
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to create sub-admin user');
      }

      setIsAddModalOpen(false);
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      fetchAdmins();
    } catch (err: any) {
      alert(`Error creating sub-admin: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin || !isSupabaseConfigured || !supabase) return;

    try {
      setIsSubmitting(true);
      await supabase
        .from('admin_permissions')
        .delete()
        .eq('admin_user_id', editingAdmin.userId);

      if (editingAdmin.permissions && editingAdmin.permissions.length > 0) {
        const rows = editingAdmin.permissions.map((p) => ({
          admin_user_id: editingAdmin.userId,
          permission: p
        }));
        await supabase.from('admin_permissions').insert(rows);
      }

      await logAdminActivity({
        action: 'UPDATE_PERMISSIONS',
        resourceType: 'Admin Profile',
        resourceId: editingAdmin.userId,
        description: `Updated permissions for ${editingAdmin.fullName}`
      });

      setEditingAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      alert(`Error updating permissions: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (admin: AdminProfile) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const newStatus = !admin.isActive;
      const { error } = await supabase
        .from('admin_profiles')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', admin.userId);

      if (error) throw error;

      await logAdminActivity({
        action: newStatus ? 'ACTIVATE' : 'DEACTIVATE',
        resourceType: 'Admin Profile',
        resourceId: admin.userId,
        description: `${newStatus ? 'Activated' : 'Deactivated'} account for ${admin.fullName}`
      });

      fetchAdmins();
    } catch (err: any) {
      alert(`Error changing account status: ${err.message}`);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordAdmin || !isSupabaseConfigured || !supabase) return;

    setIsResettingPassword(true);
    try {
      if (resetMode === 'email') {
        const { error } = await supabase.auth.resetPasswordForEmail(resetPasswordAdmin.email, {
          redirectTo: `${window.location.origin}/#/reset-password`
        });
        if (error) throw error;

        await logAdminActivity({
          action: 'PASSWORD_RESET_REQUESTED',
          resourceType: 'Admin Account',
          resourceId: resetPasswordAdmin.userId,
          description: `Sent password reset email to ${resetPasswordAdmin.fullName} (${resetPasswordAdmin.email})`
        });
      } else {
        if (!tempPasswordInput || tempPasswordInput.length < 6) {
          alert('Temporary password must be at least 6 characters long.');
          setIsResettingPassword(false);
          return;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

        const response = await fetch(`${supabaseUrl}/functions/v1/reset-admin-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            targetUserId: resetPasswordAdmin.userId,
            newPassword: tempPasswordInput,
            action: 'set_password'
          })
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || 'Failed to update password');
        }
      }

      setResetPasswordAdmin(null);
      setTempPasswordInput('');
    } catch (err: any) {
      alert(`Password reset error: ${err.message}`);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAdminExecute = async () => {
    if (!deleteAdminTarget || !isSupabaseConfigured || !supabase) return;
    try {
      const { error: profErr } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('user_id', deleteAdminTarget.userId);

      if (profErr) throw profErr;

      await logAdminActivity({
        action: 'DELETE_ADMIN',
        resourceType: 'Admin Profile',
        resourceId: deleteAdminTarget.userId,
        description: `Deleted admin profile for ${deleteAdminTarget.fullName}`
      });

      fetchAdmins();
    } catch (err: any) {
      alert(`Error deleting admin profile: ${err.message}`);
    } finally {
      setDeleteAdminTarget(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
        Access Restricted: Admin Management is available exclusively to Super Administrators.
      </div>
    );
  }

  const columns: Column<AdminProfile>[] = [
    {
      header: 'Administrator Name & Email',
      accessor: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-white text-xs block">{row.fullName}</span>
          <span className="text-[11px] text-slate-400 block font-mono">{row.email}</span>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row) => (
        <StatusBadge
          variant={row.role === 'super_admin' ? 'super_admin' : 'sub_admin'}
          label={row.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
          size="sm"
        />
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <StatusBadge
          variant={row.isActive ? 'active' : 'inactive'}
          label={row.isActive ? 'Active' : 'Inactive'}
          size="sm"
        />
      )
    },
    {
      header: 'Permissions Granted',
      accessor: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.role === 'super_admin' ? (
            <span className="text-[11px] text-amber-400 font-semibold italic">Full System Privileges</span>
          ) : row.permissions && row.permissions.length > 0 ? (
            row.permissions.map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                {p.replace('manage_', '').replace('view_', '')}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-500 italic">No permissions assigned</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setResetPasswordAdmin(row)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
            title="Reset Admin Password"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>

          {row.role !== 'super_admin' && (
            <button
              onClick={() => setEditingAdmin({ ...row })}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
              title="Edit Permissions"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {row.userId !== user?.id && (
            <>
              <button
                onClick={() => handleToggleActive(row)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={row.isActive ? 'Deactivate Account' : 'Activate Account'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDeleteAdminTarget(row)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors"
                title="Delete Admin Profile"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sub-Admin & Security Management"
        description="Provision administrative sub-accounts, grant granular module permissions, and manage access privileges."
        badge={`${admins.length} Administrators Total`}
      >
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub-Admin</span>
        </button>
      </AdminPageHeader>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={admins}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No administrators found"
        emptySubtext="Provision a sub-admin account to delegate CMS control duties."
        emptyIcon={<Shield className="w-6 h-6 text-slate-400" />}
      />

      {/* Add Sub-Admin Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Sub-Administrator Account"
        description="Create an authentication account and assign module permissions."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-admin-form"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </>
        }
      >
        <form id="add-admin-form" onSubmit={handleCreateSubAdmin} className="space-y-4">
          <FormInput
            label="Full Name"
            required
            placeholder="e.g. Dr. Kwame Mensah"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />

          <FormInput
            label="Email Address"
            type="email"
            required
            placeholder="e.g. kmensah@upsamail.edu.gh"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300">Initial Password *</label>
              {newPassword && (
                <span className={`text-[11px] font-semibold ${getPasswordStrength(newPassword).color}`}>
                  {getPasswordStrength(newPassword).label}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="Min 6 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && (
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrength(newPassword).bg}`}
                  style={{ width: `${getPasswordStrength(newPassword).percentage}%` }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-200 block">
              Module Authorizations & Permissions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {ALL_PERMISSIONS.map((perm) => {
                const isChecked = newPermissions.includes(perm.id);
                return (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 py-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewPermissions([...newPermissions, perm.id]);
                        } else {
                          setNewPermissions(newPermissions.filter((p) => p !== perm.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={Boolean(editingAdmin)}
        onClose={() => setEditingAdmin(null)}
        title={`Edit Permissions — ${editingAdmin?.fullName}`}
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingAdmin(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-perm-form"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Permissions'}
            </button>
          </>
        }
      >
        {editingAdmin && (
          <form id="edit-perm-form" onSubmit={handleUpdatePermissions} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {ALL_PERMISSIONS.map((perm) => {
                const currentPerms = editingAdmin.permissions || [];
                const isChecked = currentPerms.includes(perm.id);
                return (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 py-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...currentPerms, perm.id]
                          : currentPerms.filter((p) => p !== perm.id);
                        setEditingAdmin({ ...editingAdmin, permissions: updated });
                      }}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </form>
        )}
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={Boolean(resetPasswordAdmin)}
        onClose={() => setResetPasswordAdmin(null)}
        title={`Reset Password — ${resetPasswordAdmin?.fullName}`}
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setResetPasswordAdmin(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="reset-pass-form"
              disabled={isResettingPassword}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              {isResettingPassword ? 'Processing...' : 'Execute Password Reset'}
            </button>
          </>
        }
      >
        {resetPasswordAdmin && (
          <form id="reset-pass-form" onSubmit={handlePasswordResetSubmit} className="space-y-4 text-xs">
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setResetMode('email')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  resetMode === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Send Reset Email
              </button>
              <button
                type="button"
                onClick={() => setResetMode('temporary')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  resetMode === 'temporary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Set Temporary Password
              </button>
            </div>

            {resetMode === 'email' ? (
              <p className="text-slate-300 leading-relaxed">
                Sends a Supabase Auth recovery email to <strong className="text-white">{resetPasswordAdmin.email}</strong> with a secure link to update their password.
              </p>
            ) : (
              <FormInput
                label="Temporary Password"
                type="password"
                required
                placeholder="Min 6 characters..."
                value={tempPasswordInput}
                onChange={(e) => setTempPasswordInput(e.target.value)}
              />
            )}
          </form>
        )}
      </Modal>

      {/* Confirm Delete Admin */}
      <ConfirmDialog
        isOpen={Boolean(deleteAdminTarget)}
        onClose={() => setDeleteAdminTarget(null)}
        onConfirm={handleDeleteAdminExecute}
        title="Delete Administrator Profile"
        message={
          deleteAdminTarget
            ? `Are you sure you want to delete administrator profile for ${deleteAdminTarget.fullName}?`
            : ''
        }
        confirmLabel="Delete Admin"
      />
    </div>
  );
};
