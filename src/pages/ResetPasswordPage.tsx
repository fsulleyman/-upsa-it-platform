import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lock, KeyRound, CheckCircle, AlertTriangle, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigateAdmin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateAdmin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if recovery event or session token is present
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase authentication client is not configured.');
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg('Please enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase authentication client is not configured.');
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password reset update error:', err);
      setErrorMsg(err.message || 'Failed to update password. Your reset session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 selection:bg-[#F2B705] selection:text-[#003366]">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#003366] border border-[#F2B705]/40 flex items-center justify-center mx-auto text-[#F2B705] shadow-lg">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full bg-[#003366]/80 text-[#F2B705] border border-[#F2B705]/30 text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
            UPSA IT STUDIES • SECURITY CENTER
          </span>
          <h2 className="text-xl font-extrabold text-white">Administrator Password Update</h2>
          <p className="text-slate-400 text-xs">
            Enter a new secure password for your administrator account.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-4">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">Password Updated Successfully</h3>
              <p className="text-xs text-slate-300">
                Your administrator account password has been safely updated. You can now sign in with your new credentials.
              </p>
            </div>

            <button
              onClick={onNavigateAdmin}
              className="w-full py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#F2B705]" />
              <span>Proceed to Admin Portal Login</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                New Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Confirm New Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#F2B705]" />
                  <span>Update Admin Password</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateAdmin}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Portal</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
