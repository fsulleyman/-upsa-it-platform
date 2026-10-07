-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- LEARNING HUB RESOURCE ANALYTICS FUNCTION
-- ============================================================================
-- Security Definer function to track resource views and downloads with abuse protection.

CREATE OR REPLACE FUNCTION public.track_resource_event(
  p_resource_id UUID,
  p_event TEXT,
  p_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id TEXT;
  v_title TEXT;
  v_is_published BOOLEAN;
  v_recent_count INT;
  v_event_type TEXT;
BEGIN
  -- 1. Validate event parameter
  IF p_event IS NULL OR LOWER(p_event) NOT IN ('view', 'download') THEN
    RETURN FALSE;
  END IF;

  v_event_type := CASE WHEN LOWER(p_event) = 'download' THEN 'RESOURCE_DOWNLOAD' ELSE 'RESOURCE_VIEW' END;

  -- 2. Verify target resource exists and is published
  SELECT course_id, title, is_published
  INTO v_course_id, v_title, v_is_published
  FROM public.learning_resources
  WHERE id = p_resource_id;

  IF NOT FOUND OR v_is_published IS NOT TRUE THEN
    RETURN FALSE;
  END IF;

  -- 3. Abuse Protection: Rate-limit duplicate events from same session/resource within 60 seconds
  IF p_session_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_recent_count
    FROM public.site_analytics
    WHERE event_type = v_event_type
      AND session_id = p_session_id
      AND metadata->>'resource_id' = p_resource_id::text
      AND created_at > NOW() - INTERVAL '60 seconds';

    IF v_recent_count > 0 THEN
      RETURN FALSE; -- Debounced
    END IF;
  END IF;

  -- 4. Record event into site_analytics
  INSERT INTO public.site_analytics (
    event_type,
    page_path,
    session_id,
    metadata,
    created_at
  ) VALUES (
    v_event_type,
    '/learning-hub',
    p_session_id,
    jsonb_build_object(
      'resource_id', p_resource_id,
      'course_id', v_course_id,
      'title', v_title,
      'event', LOWER(p_event)
    ),
    NOW()
  );

  RETURN TRUE;
END;
$$;

-- Grant EXECUTE to anon and authenticated, revoke from PUBLIC
REVOKE ALL ON FUNCTION public.track_resource_event(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_resource_event(UUID, TEXT, TEXT) TO anon, authenticated;
