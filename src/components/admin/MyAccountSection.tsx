import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { FormInput } from './ui/FormField';
import { StatusBadge } from './ui/StatusBadge';
import { UserCheck, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

export const MyAccountSection: React.FC = () => {
  const { user, adminProfile, refreshAdminProfile } = useAuth();

  const [fullName, setFullName] = useState(adminProfile?.fullName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    setErrorNotice(null);
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase || !user) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase
        .from('admin_profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName.trim(),
          email: user.email || '',
          role: adminProfile?.role || 'super_admin',
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      await logAdminActivity({
        action: 'UPDATE',
        resourceType: 'Admin Profile',
        resourceId: user.id,
        description: `Updated profile details for ${fullName}`,
        adminUserId: user.id,
        adminName: fullName
      });

      await refreshAdminProfile();
      setStatusNotice('Profile details updated successfully!');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Failed to update profile name');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    setErrorNotice(null);

    if (newPassword.length < 6) {
      setErrorNotice('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorNotice('New password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      await logAdminActivity({
        action: 'CHANGE_PASSWORD',
        resourceType: 'Auth',
        resourceId: user?.id,
        description: 'Successfully updated account password',
        adminUserId: user?.id,
        adminName: adminProfile?.fullName || 'Admin'
      });

      setStatusNotice('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuperAdmin = adminProfile?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="My Account Settings"
        description="Manage your administrator profile details, update security credentials, and view active role authorizations."
      />

      {statusNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Overview Card */}
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-[#003366] text-[#F2B705] border border-[#F2B705]/30 font-bold text-sm flex items-center justify-center">
              {adminProfile?.fullName ? adminProfile.fullName.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{adminProfile?.fullName || 'Administrator'}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">System Role:</span>
              <StatusBadge
                variant={isSuperAdmin ? 'super_admin' : 'sub_admin'}
                label={isSuperAdmin ? 'Super Admin' : 'Sub Admin'}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Account Status:</span>
              <StatusBadge variant="active" label="Active" />
            </div>
          </div>
        </div>

        {/* Profile Details & Password Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Name Form */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Profile Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <FormInput
                label="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <FormInput
                label="Email Address"
                disabled
                value={user?.email || ''}
                helperText="Email changes require system administrator authorization."
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Security & Password</h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="New Password"
                  type="password"
                  required
                  placeholder="Min 6 characters..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <FormInput
                  label="Confirm New Password"
                  type="password"
                  required
                  placeholder="Repeat new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Change Account Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
