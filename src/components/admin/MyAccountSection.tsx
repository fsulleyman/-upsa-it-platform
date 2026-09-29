import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import { UserCheck, ShieldCheck, KeyRound, Mail, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const MyAccountSection: React.FC = () => {
  const { user, adminProfile, refreshAdminProfile } = useAuth();

  const [fullName, setFullName] = useState(adminProfile?.fullName || '');
  const [emailInput, setEmailInput] = useState(adminProfile?.email || user?.email || '');
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
          email: user.email || emailInput.trim(),
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
      setStatusNotice('Profile full name updated successfully!');
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

      setNewPassword('');
      setConfirmPassword('');
      setStatusNotice('Your password has been changed securely.');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Failed to change password. Please re-authenticate and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    setErrorNotice(null);

    if (!emailInput || !emailInput.includes('@')) {
      setErrorNotice('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.updateUser({
        email: emailInput.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      await logAdminActivity({
        action: 'CHANGE_EMAIL',
        resourceType: 'Auth',
        resourceId: user?.id,
        description: `Requested email change to ${emailInput}`,
        adminUserId: user?.id,
        adminName: adminProfile?.fullName || 'Admin'
      });

      setStatusNotice('Email update link sent! Please check your new email address to confirm.');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Failed to initiate email change.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <UserCheck className="w-6 h-6 text-[#F2B705]" />
        <div>
          <h2 className="text-base font-extrabold text-white">My Account & Security Profile</h2>
          <p className="text-xs text-slate-400">Manage your administrative credentials and security settings</p>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3.5 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Account Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2B705]" />
            Account Role
          </span>
          <span className="text-sm font-extrabold text-[#F2B705] uppercase">
            {adminProfile?.role === 'super_admin' ? 'SUPER ADMIN' : 'SUB ADMIN'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Status
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {adminProfile?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Created
          </span>
          <span className="text-xs font-mono text-slate-200 block truncate">
            {adminProfile?.createdAt ? new Date(adminProfile.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Last Sign-In
          </span>
          <span className="text-xs font-mono text-slate-200 block truncate">
            {adminProfile?.lastLoginAt ? new Date(adminProfile.lastLoginAt).toLocaleString() : 'Active Session'}
          </span>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Full Name & Profile Details */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
          <h3 className="text-xs font-extrabold text-[#F2B705] uppercase tracking-wider">Personal Information</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Address (Read-Only)</label>
              <input
                type="email"
                disabled
                value={adminProfile?.email || user?.email || ''}
                className="w-full p-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-400 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs"
            >
              Update Name
            </button>
          </form>
        </div>

        {/* Change Email Address */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
          <h3 className="text-xs font-extrabold text-[#F2B705] uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            Update Email Address
          </h3>
          <form onSubmit={handleEmailChange} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">New Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Supabase Auth will dispatch a confirmation email link to verify the new email address before updating.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Update Email Address
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
          <h3 className="text-xs font-extrabold text-[#F2B705] uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-4 h-4" />
            Update Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">New Password *</label>
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
                <label className="block font-bold text-slate-300 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
