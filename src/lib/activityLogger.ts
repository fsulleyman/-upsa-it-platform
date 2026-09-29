import { supabase, isSupabaseConfigured } from './supabase';

export interface LogActivityParams {
  action: string;
  resourceType: string;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  adminUserId?: string;
  adminName?: string;
}

export async function logAdminActivity(params: LogActivityParams): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    let userId = params.adminUserId;
    let userName = params.adminName;

    // Get current auth user if not explicitly passed
    if (!userId || !userName) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userId = userId || session.user.id;

        // Try fetching admin name from admin_profiles
        if (!userName) {
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('full_name')
            .eq('user_id', session.user.id)
            .single();

          userName = profile?.full_name || session.user.email || 'System Admin';
        }
      }
    }

    const payload = {
      admin_user_id: userId || null,
      admin_name: userName || 'System Admin',
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId || null,
      description: params.description,
      metadata: params.metadata || {}
    };

    const { error } = await supabase.from('admin_activity_logs').insert(payload);
    if (error) {
      console.warn('Activity logging notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to record admin activity log:', err);
  }
}
