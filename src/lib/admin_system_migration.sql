-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- SUPER ADMIN & SUB-ADMIN MANAGEMENT SYSTEM SCHEMA & RLS POLICIES
-- ============================================================================
-- Copy and paste this ENTIRE file into the Supabase SQL Editor and click RUN.
-- It is 100% idempotent: safe to run on new or existing databases.

-- ----------------------------------------------------------------------------
-- PART 1: CREATE LEGACY & CORE AUTHORIZATION TABLES
-- ----------------------------------------------------------------------------

-- Legacy Admin Table (Preserves compatibility with earlier migrations)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sub_admin' CHECK (role IN ('super_admin', 'sub_admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure columns exist if table was partially created previously
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- PART 2: CREATE ADMIN PERMISSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (admin_user_id, permission)
);

-- ----------------------------------------------------------------------------
-- PART 3: CREATE ADMIN ACTIVITY LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL DEFAULT 'System Admin',
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.admin_activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_user ON public.admin_activity_logs (admin_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.admin_activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON public.admin_activity_logs (resource_type);

-- ----------------------------------------------------------------------------
-- PART 4: CREATE SITE ANALYTICS EVENT TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.site_analytics (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.site_analytics (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON public.site_analytics (page_path);

-- ----------------------------------------------------------------------------
-- PART 5: SEED INITIAL SUPER ADMIN ACCOUNT
-- ----------------------------------------------------------------------------
-- Ensure existing legacy admin_users entry is synced
INSERT INTO public.admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = '10310342@upsamail.edu.gh'
ON CONFLICT (user_id) DO NOTHING;

-- Seed admin_profiles for 10310342@upsamail.edu.gh as Super Admin
INSERT INTO public.admin_profiles (user_id, full_name, email, role, is_active)
SELECT 
  id AS user_id,
  'Department Super Admin' AS full_name,
  email,
  'super_admin' AS role,
  true AS is_active
FROM auth.users
WHERE email = '10310342@upsamail.edu.gh'
ON CONFLICT (user_id) DO UPDATE 
SET role = 'super_admin', is_active = true;

-- If any auth user exists but no super_admin exists yet, make the first user super_admin
INSERT INTO public.admin_profiles (user_id, full_name, email, role, is_active)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'System Super Admin'),
  email,
  'super_admin',
  true
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.admin_profiles WHERE role = 'super_admin')
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- PART 6: HELPER SECURITY FUNCTIONS (OVERLOADED SIGNATURES FOR FULL COMPATIBILITY)
-- ----------------------------------------------------------------------------

-- Function 1a: Zero-argument is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
  ) OR EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Function 1b: Single-argument is_admin(UUID)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = check_user_id
      AND is_active = true
  ) OR EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

-- Function 2: Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
  );
$$;

-- Function 3: Check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(p_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.is_super_admin() OR EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    JOIN public.admin_permissions perm ON ap.user_id = perm.admin_user_id
    WHERE ap.user_id = auth.uid()
      AND ap.is_active = true
      AND perm.permission = p_permission
  );
$$;

-- ----------------------------------------------------------------------------
-- PART 7: ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on Admin Tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Clean up old policies on Admin tables
DROP POLICY IF EXISTS "Authenticated Admins Read Profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super Admin Write Profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users Read Own Profile" ON public.admin_profiles;

DROP POLICY IF EXISTS "Authenticated Admins Read Permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super Admin Write Permissions" ON public.admin_permissions;

DROP POLICY IF EXISTS "Authenticated Read Activity Logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Authenticated Insert Activity Logs" ON public.admin_activity_logs;

DROP POLICY IF EXISTS "Public Insert Analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Authenticated Read Analytics" ON public.site_analytics;

-- Admin Profiles Policies
CREATE POLICY "Authenticated Admins Read Profiles" ON public.admin_profiles
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Super Admin Write Profiles" ON public.admin_profiles
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Admin Permissions Policies
CREATE POLICY "Authenticated Admins Read Permissions" ON public.admin_permissions
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Super Admin Write Permissions" ON public.admin_permissions
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Activity Logs Policies
CREATE POLICY "Authenticated Read Activity Logs" ON public.admin_activity_logs
  FOR SELECT TO authenticated USING (public.has_permission('view_activity_logs') OR public.is_super_admin());

CREATE POLICY "Authenticated Insert Activity Logs" ON public.admin_activity_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- Site Analytics Policies
CREATE POLICY "Public Insert Analytics" ON public.site_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated Read Analytics" ON public.site_analytics
  FOR SELECT TO authenticated USING (public.has_permission('view_analytics') OR public.is_super_admin());

-- ----------------------------------------------------------------------------
-- PART 8: SECURE FALLBACK RPC FUNCTION FOR SUB-ADMIN CREATION
-- ----------------------------------------------------------------------------
-- Allows authenticated Super Admins to create sub-admin accounts directly via RPC
-- if Edge Functions are not deployed or unavailable.

CREATE OR REPLACE FUNCTION public.create_sub_admin(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_permissions TEXT[] DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_caller_id UUID;
  v_is_super BOOLEAN;
  v_new_user_id UUID;
BEGIN
  v_caller_id := auth.uid();
  
  -- Verify caller is super admin
  SELECT (role = 'super_admin' AND is_active = true) INTO v_is_super
  FROM public.admin_profiles
  WHERE user_id = v_caller_id;

  IF v_is_super IS NOT TRUE THEN
    RAISE EXCEPTION 'Forbidden: Only active Super Administrators can create sub-admin accounts.';
  END IF;

  -- Create or find user id in auth.users
  SELECT id INTO v_new_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email));

  IF v_new_user_id IS NULL THEN
    v_new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role
    )
    VALUES (
      v_new_user_id,
      '00000000-0000-0000-0000-000000000000',
      LOWER(TRIM(p_email)),
      crypt(p_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', p_full_name),
      NOW(),
      NOW(),
      'authenticated'
    );
  END IF;

  -- Insert profile
  INSERT INTO public.admin_profiles (user_id, full_name, email, role, is_active)
  VALUES (v_new_user_id, p_full_name, LOWER(TRIM(p_email)), 'sub_admin', true)
  ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, is_active = true;

  -- Insert permissions
  IF array_length(p_permissions, 1) > 0 THEN
    DELETE FROM public.admin_permissions WHERE admin_user_id = v_new_user_id;
    INSERT INTO public.admin_permissions (admin_user_id, permission)
    SELECT v_new_user_id, unnest(p_permissions);
  END IF;

  -- Insert Activity Log
  INSERT INTO public.admin_activity_logs (admin_user_id, admin_name, action, resource_type, resource_id, description)
  VALUES (v_caller_id, 'Super Admin', 'CREATE', 'Admin Account', v_new_user_id, 'Created Sub Admin account for ' || p_full_name || ' (' || p_email || ')');

  RETURN jsonb_build_object('success', true, 'user_id', v_new_user_id);
END;
$$;

-- ----------------------------------------------------------------------------
-- PART 9: RELOAD POSTGREST SCHEMA CACHE & VERIFY
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_profiles', 'admin_permissions', 'admin_activity_logs', 'site_analytics');
