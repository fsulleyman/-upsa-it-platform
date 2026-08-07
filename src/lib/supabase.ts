import { createClient } from '@supabase/supabase-js';

// Access ONLY Vite public environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize Supabase client safely with no-store cache control headers globally
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            cache: 'no-store',
            headers: {
              ...options?.headers,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          });
        },
      },
    })
  : null;
