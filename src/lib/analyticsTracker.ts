import { supabase, isSupabaseConfigured } from './supabase';

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('upsa_analytics_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('upsa_analytics_session_id', sid);
    }
    return sid;
  } catch {
    return 'sess_anon_' + Date.now();
  }
}

export async function trackAnalyticsEvent(
  eventType: 'PAGE_VIEW' | 'FACULTY_PROFILE_VIEW' | 'EVENT_VIEW' | 'SEARCH' | 'CONTACT_CLICK' | 'DOCUMENT_VIEW',
  pagePath: string,
  metadata?: Record<string, any>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const sessionId = getOrCreateSessionId();
    const payload = {
      event_type: eventType,
      page_path: pagePath,
      session_id: sessionId,
      metadata: metadata || {}
    };

    const { error } = await supabase.from('site_analytics').insert(payload);
    if (error) {
      console.warn('Analytics tracking notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to record analytics event:', err);
  }
}
