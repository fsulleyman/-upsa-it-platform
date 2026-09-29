import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAdminActivity } from '../lib/activityLogger';
import type { User, Session } from '@supabase/supabase-js';
import type { AdminProfile, AdminPermission } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdminLoggedIn: boolean;
  adminProfile: AdminProfile | null;
  permissions: AdminPermission[];
  isSuperAdmin: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  refreshAdminProfile: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdminDetails = useCallback(async (authUser: User | null) => {
    if (!authUser || !isSupabaseConfigured || !supabase) {
      setAdminProfile(null);
      setPermissions([]);
      return;
    }

    try {
      // 1. Fetch Profile from admin_profiles
      const { data: profileData, error: profileErr } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (!profileErr && profileData) {
        let perms: AdminPermission[] = [];

        if (profileData.role === 'super_admin') {
          perms = [
            'manage_faculty',
            'manage_events',
            'manage_homepage',
            'manage_navbar',
            'manage_academics',
            'manage_community',
            'manage_innovation',
            'manage_hub',
            'manage_media',
            'view_analytics',
            'view_activity_logs',
            'manage_admins'
          ];
        } else {
          // Fetch Sub Admin permissions
          const { data: permData } = await supabase
            .from('admin_permissions')
            .select('permission')
            .eq('admin_user_id', authUser.id);

          perms = permData ? (permData.map((p) => p.permission) as AdminPermission[]) : [];
        }

        const formattedProfile: AdminProfile = {
          id: profileData.id,
          userId: profileData.user_id,
          fullName: profileData.full_name,
          email: profileData.email,
          role: profileData.role,
          isActive: profileData.is_active ?? true,
          lastLoginAt: profileData.last_login_at,
          createdAt: profileData.created_at,
          permissions: perms
        };

        setAdminProfile(formattedProfile);
        setPermissions(perms);
      } else {
        // Fallback: If legacy user in admin_users or auth.users without admin_profile entry
        const fallbackSuper: AdminProfile = {
          id: authUser.id,
          userId: authUser.id,
          fullName: authUser.email ? authUser.email.split('@')[0] : 'Administrator',
          email: authUser.email || '',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          permissions: [
            'manage_faculty',
            'manage_events',
            'manage_homepage',
            'manage_navbar',
            'manage_academics',
            'manage_community',
            'manage_innovation',
            'manage_hub',
            'manage_media',
            'view_analytics',
            'view_activity_logs',
            'manage_admins'
          ]
        };
        setAdminProfile(fallbackSuper);
        setPermissions(fallbackSuper.permissions!);
      }
    } catch (err) {
      console.warn('Notice loading admin permissions:', err);
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchAdminDetails(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchAdminDetails(session.user);
        } else {
          setAdminProfile(null);
          setPermissions([]);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, [fetchAdminDetails]);

  const login = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service not configured. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
          return { error: 'Unable to verify administrator permissions. Please check network connectivity or environment keys.' };
        }
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return { error: 'Invalid email address or password.' };
        }
        return { error: error.message };
      }

      if (data.user) {
        // Update last_login_at in admin_profiles if exists
        await supabase
          .from('admin_profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('user_id', data.user.id);

        await fetchAdminDetails(data.user);

        // Record LOGIN Activity Log
        await logAdminActivity({
          action: 'LOGIN',
          resourceType: 'Auth',
          resourceId: data.user.id,
          description: `Administrator signed in (${email})`,
          adminUserId: data.user.id,
          adminName: email
        });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'An unexpected error occurred during authentication.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      if (user) {
        await logAdminActivity({
          action: 'LOGOUT',
          resourceType: 'Auth',
          resourceId: user.id,
          description: `Administrator signed out (${user.email})`,
          adminUserId: user.id,
          adminName: adminProfile?.fullName || user.email || 'Admin'
        });
      }
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setAdminProfile(null);
    setPermissions([]);
  };

  const isSuperAdmin = adminProfile?.role === 'super_admin';

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const refreshAdminProfile = async () => {
    if (user) {
      await fetchAdminDetails(user);
    }
  };

  const isAdminLoggedIn = Boolean(user && (adminProfile ? adminProfile.isActive : true));

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: isAdminLoggedIn,
        isAdminLoggedIn,
        adminProfile,
        permissions,
        isSuperAdmin,
        hasPermission,
        refreshAdminProfile,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
