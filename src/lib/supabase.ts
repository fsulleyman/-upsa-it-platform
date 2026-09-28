import { createClient } from '@supabase/supabase-js';

// Access ONLY Vite public environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize Supabase client safely with robust header preservation for Auth & REST
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options) => {
          // Safely construct a Headers instance to preserve all existing headers
          // (apikey, Content-Type, Authorization) whether options.headers is a Headers instance, Object, or Array
          const headers = new Headers(options?.headers);

          // Apply cache-invalidation headers ONLY for GET data queries (REST API reads)
          if (!options?.method || options.method.toUpperCase() === 'GET') {
            headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            headers.set('Pragma', 'no-cache');
            headers.set('Expires', '0');
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    })
  : null;
