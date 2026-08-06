import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdminLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => {
    return localStorage.getItem('upsa_admin_session') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Fallback local admin authentication for initial local test mode before Supabase credentials
      if (email.trim().toLowerCase() === 'admin@upsa.edu.gh' && pass === 'upsa2026') {
        localStorage.setItem('upsa_admin_session', 'true');
        setLocalAdmin(true);
        return { error: null };
      }
      return { error: 'Invalid admin credentials.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('upsa_admin_session');
    setLocalAdmin(false);
    setUser(null);
    setSession(null);
  };

  const isAdminLoggedIn = Boolean(user || localAdmin);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: isAdminLoggedIn,
        isAdminLoggedIn,
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
