-- Server-side SQL function to aggregate top learning resources telemetry
-- Eliminates PostgREST default 1000-row client-side aggregation limit.
-- DO NOT RUN DIRECTLY IN APPLICATION CLIENT CODE. Apply via Supabase SQL Editor.

CREATE OR REPLACE FUNCTION public.get_top_learning_resources(
  p_days integer DEFAULT 30,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  resource_id uuid,
  title text,
  course_code text,
  open_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_days integer;
  v_limit integer;
BEGIN
  -- Strict permission guard check
  IF NOT (public.has_permission('view_analytics') OR public.is_super_admin()) THEN
    RAISE EXCEPTION 'Access denied: view_analytics permission or super admin required';
  END IF;

  -- Bound parameters safely
  v_days := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_limit := LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100);

  RETURN QUERY
  WITH resource_stats AS (
    SELECT 
      sa.metadata->>'resource_id' AS res_id_str,
      COUNT(*) AS cnt
    FROM public.site_analytics sa
    WHERE sa.created_at >= (NOW() - (v_days || ' days')::interval)
      AND sa.event_type IN ('RESOURCE_DOWNLOAD', 'RESOURCE_VIEW')
      AND sa.metadata->>'resource_id' IS NOT NULL
    GROUP BY sa.metadata->>'resource_id'
  )
  SELECT 
    lr.id AS resource_id,
    lr.title,
    COALESCE(c.course_code, 'COURSE') AS course_code,
    rs.cnt AS open_count
  FROM resource_stats rs
  JOIN public.learning_resources lr ON lr.id::text = rs.res_id_str
  LEFT JOIN public.courses c ON c.id = lr.course_id
  ORDER BY rs.cnt DESC
  LIMIT v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.get_top_learning_resources(integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_top_learning_resources(integer, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_top_learning_resources(integer, integer) TO authenticated;
