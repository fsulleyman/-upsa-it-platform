import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import { createClient } from '@supabase/supabase-js';
import { Shield, Plus, Edit, Trash2, AlertTriangle, CheckCircle, ShieldAlert, X } from 'lucide-react';
import type { AdminProfile, AdminPermission } from '../../types';

const ALL_PERMISSIONS: { id: AdminPermission; label: string }[] = [
  { id: 'manage_faculty', label: 'Manage Faculty' },
  { id: 'manage_events', label: 'Manage Events' },
  { id: 'manage_homepage', label: 'Manage Homepage (Hero, Slides, Settings)' },
  { id: 'manage_navbar', label: 'Manage Navbar' },
  { id: 'manage_academics', label: 'Manage Academics' },
  { id: 'manage_community', label: 'Manage Community & Footer' },
  { id: 'manage_innovation', label: 'Manage Student Innovation Projects' },
  { id: 'manage_hub', label: 'Manage Developers Hub' },
  { id: 'manage_media', label: 'Manage Images & Media' },
  { id: 'view_analytics', label: 'View Website Analytics' },
  { id: 'view_activity_logs', label: 'View Admin Activity Logs' }
];

export const AdminManagementSection: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal / Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // New Admin Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPermissions, setNewPermissions] = useState<AdminPermission[]>([
    'manage_faculty',
    'manage_events',
    'view_analytics'
  ]);

  const fetchAdmins = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: profiles, error: profErr } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profErr) throw profErr;

      const { data: permissionsData } = await supabase
        .from('admin_permissions')
        .select('*');

      const fullAdmins: AdminProfile[] = (profiles || []).map((p) => {
        const userPerms = (permissionsData || [])
          .filter((perm) => perm.admin_user_id === p.user_id)
          .map((perm) => perm.permission as AdminPermission);

        return {
          id: p.id,
          userId: p.user_id,
          fullName: p.full_name,
          email: p.email,
          role: p.role,
          isActive: p.is_active ?? true,
          lastLoginAt: p.last_login_at,
          createdAt: p.created_at,
          permissions: userPerms
        };
      });

      setAdmins(fullAdmins);
    } catch (err: any) {
      setErrorMsg(`Failed to load administrators: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // 1. ADD SUB ADMIN (Uses isolated client to avoid signing out active Super Admin)
  const handleAddSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newFullName || !newEmail || !newPassword) {
      setErrorMsg('Full Name, Email, and Password are required.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      
      // Secondary isolated client for creating sub-admin without overriding session
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });

      const { data: signUpData, error: signUpErr } = await tempClient.auth.signUp({
        email: newEmail.trim(),
        password: newPassword,
        options: {
          data: { full_name: newFullName.trim() }
        }
      });

      if (signUpErr) throw signUpErr;
      if (!signUpData.user) throw new Error('Sub-admin authentication account could not be created.');

      const newUserId = signUpData.user.id;

      // Insert admin_profile
      const { error: profileErr } = await supabase!
        .from('admin_profiles')
        .insert({
          user_id: newUserId,
          full_name: newFullName.trim(),
          email: newEmail.trim(),
          role: 'sub_admin',
          is_active: true
        });

      if (profileErr) throw profileErr;

      // Insert permissions
      if (newPermissions.length > 0) {
        const permRows = newPermissions.map((p) => ({
          admin_user_id: newUserId,
          permission: p
        }));
        await supabase!.from('admin_permissions').insert(permRows);
      }

      await logAdminActivity({
        action: 'CREATE',
        resourceType: 'Admin Account',
        resourceId: newUserId,
        description: `Created Sub Admin account for ${newFullName} (${newEmail})`,
        adminUserId: user?.id,
        adminName: user?.email || 'Super Admin'
      });

      setIsAddModalOpen(false);
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewPermissions(['manage_faculty', 'manage_events', 'view_analytics']);

      showNotice(`Sub Admin ${newFullName} added successfully!`);
      fetchAdmins();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create Sub Admin account.');
    }
  };

  // 2. SAVE PERMISSIONS / ROLE EDIT
  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      // Delete existing permissions for user
      await supabase!
        .from('admin_permissions')
        .delete()
        .eq('admin_user_id', editingAdmin.userId);

      // Re-insert selected permissions if sub_admin
      if (editingAdmin.role === 'sub_admin' && editingAdmin.permissions && editingAdmin.permissions.length > 0) {
        const permRows = editingAdmin.permissions.map((p) => ({
          admin_user_id: editingAdmin.userId,
          permission: p
        }));
        await supabase!.from('admin_permissions').insert(permRows);
      }

      // Update role & status
      await supabase!
        .from('admin_profiles')
        .update({
          role: editingAdmin.role,
          is_active: editingAdmin.isActive,
          full_name: editingAdmin.fullName
        })
        .eq('user_id', editingAdmin.userId);

      await logAdminActivity({
        action: 'CHANGE_PERMISSIONS',
        resourceType: 'Admin Account',
        resourceId: editingAdmin.userId,
        description: `Updated permissions and settings for ${editingAdmin.fullName}`,
        adminUserId: user?.id,
        adminName: user?.email || 'Super Admin'
      });

      setEditingAdmin(null);
      showNotice(`Permissions updated for ${editingAdmin.fullName}`);
      fetchAdmins();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update permissions.');
    }
  };

  // 3. TOGGLE ACTIVE / INACTIVE STATUS
  const handleToggleActiveStatus = async (admin: AdminProfile) => {
    if (admin.userId === user?.id) {
      alert('You cannot deactivate your own active Super Admin account.');
      return;
    }

    const nextStatus = !admin.isActive;
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus ? 'Activate' : 'Deactivate'} Administrator`,
      description: `Are you sure you want to ${nextStatus ? 'activate' : 'deactivate'} ${admin.fullName} (${admin.email})?`,
      onConfirm: async () => {
        await supabase!
          .from('admin_profiles')
          .update({ is_active: nextStatus })
          .eq('user_id', admin.userId);

        await logAdminActivity({
          action: nextStatus ? 'ACTIVATE_ADMIN' : 'DEACTIVATE_ADMIN',
          resourceType: 'Admin Account',
          resourceId: admin.userId,
          description: `${nextStatus ? 'Activated' : 'Deactivated'} administrator ${admin.fullName}`,
          adminUserId: user?.id,
          adminName: user?.email || 'Super Admin'
        });

        setConfirmModal(null);
        showNotice(`Administrator ${admin.fullName} ${nextStatus ? 'activated' : 'deactivated'}.`);
        fetchAdmins();
      }
    });
  };

  // 4. DELETE ADMIN
  const handleDeleteAdmin = async (admin: AdminProfile) => {
    if (admin.userId === user?.id) {
      alert('You cannot delete your own logged-in Super Admin account.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Delete Administrator Account`,
      description: `WARNING: Are you sure you want to permanently delete administrator account ${admin.fullName} (${admin.email})? This action cannot be undone.`,
      onConfirm: async () => {
        await supabase!
          .from('admin_profiles')
          .delete()
          .eq('user_id', admin.userId);

        await logAdminActivity({
          action: 'DELETE',
          resourceType: 'Admin Account',
          resourceId: admin.userId,
          description: `Deleted administrator profile for ${admin.fullName}`,
          adminUserId: user?.id,
          adminName: user?.email || 'Super Admin'
        });

        setConfirmModal(null);
        showNotice(`Administrator account ${admin.fullName} deleted.`);
        fetchAdmins();
      }
    });
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
        <span>Access Restricted: Only Super Administrators can view and manage administrator accounts.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#F2B705]" />
          <div>
            <h2 className="text-base font-extrabold text-white">Administrator Management & Access Control</h2>
            <p className="text-xs text-slate-400">Create, assign permissions, and manage Super Admin and Sub Admin accounts</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub Admin</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-700">
            <tr>
              <th className="p-3">Administrator Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Login</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">Loading admin accounts...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">No admin accounts found.</td>
              </tr>
            ) : (
              admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-extrabold text-white flex items-center gap-2">
                    <span>{adm.fullName}</span>
                    {adm.userId === user?.id && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500 text-blue-300 text-[10px] font-mono">YOU</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-300">{adm.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      adm.role === 'super_admin' ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/40' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {adm.role === 'super_admin' ? 'SUPER ADMIN' : 'SUB ADMIN'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleActiveStatus(adm)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        adm.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' : 'bg-red-500/20 text-red-300 border border-red-500'
                      }`}
                    >
                      {adm.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {new Date(adm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingAdmin(adm)}
                      title="Edit Permissions & Role"
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(adm)}
                      disabled={adm.userId === user?.id}
                      title="Delete Admin Account"
                      className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 disabled:opacity-30 text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD SUB ADMIN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-extrabold text-[#F2B705] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Sub Admin
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubAdmin} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. subadmin@upsamail.edu.gh"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-2">Granular Sub Admin Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-700 max-h-48 overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 font-medium cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={newPermissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPermissions([...newPermissions, perm.id]);
                          } else {
                            setNewPermissions(newPermissions.filter((p) => p !== perm.id));
                          }
                        }}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-[#003366] focus:ring-[#F2B705]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-700">
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Create Sub Admin Account
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-700 text-white font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS / ROLE MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-extrabold text-[#F2B705] flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Administrator — {editingAdmin.fullName}
              </h3>
              <button onClick={() => setEditingAdmin(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingAdmin.fullName}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Role Assignment</label>
                <select
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as any })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                >
                  <option value="sub_admin">SUB ADMIN (Restricted permissions)</option>
                  <option value="super_admin">SUPER ADMIN (Full system access)</option>
                </select>
              </div>

              {editingAdmin.role === 'sub_admin' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-2">Granular Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-700 max-h-48 overflow-y-auto">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = (editingAdmin.permissions || []).includes(perm.id);
                      return (
                        <label key={perm.id} className="flex items-center gap-2 font-medium cursor-pointer hover:text-white">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const current = editingAdmin.permissions || [];
                              const updated = e.target.checked
                                ? [...current, perm.id]
                                : current.filter((p) => p !== perm.id);
                              setEditingAdmin({ ...editingAdmin, permissions: updated });
                            }}
                            className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-[#003366] focus:ring-[#F2B705]"
                          />
                          <span>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-700">
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingAdmin(null)} className="px-4 py-2 rounded-lg bg-slate-700 text-white font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs text-white">
            <h3 className="text-sm font-extrabold text-[#F2B705] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F2B705]" />
              {confirmModal.title}
            </h3>
            <p className="text-slate-300 leading-relaxed">{confirmModal.description}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
