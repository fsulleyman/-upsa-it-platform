import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Obtain request environment keys securely
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Server configuration error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment secret missing.");
    }

    // 2. Validate caller authentication header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing Authorization header." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client using caller's JWT to verify identity
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callerUser }, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired caller authentication session." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Create Admin client using Service Role Key (Server-side ONLY)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Verify caller is an active Super Admin in admin_profiles
    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, is_active, full_name")
      .eq("user_id", callerUser.id)
      .single();

    const isSuperAdmin = callerProfile && callerProfile.role === "super_admin" && callerProfile.is_active;

    if (!isSuperAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only active Super Administrators can create sub-admin accounts." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Parse payload
    const body = await req.json();
    const { name, email, password, role = "sub_admin", permissions = [] } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Full name, email, and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters long." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (role !== "sub_admin" && role !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Invalid role specified." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const exactPassword = String(password); // Passed exactly as entered without trimming or transformation

    // 6. Create Auth User using Supabase Admin API
    const { data: newAuth, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: exactPassword,
      email_confirm: true,
      user_metadata: { full_name: String(name).trim() },
    });

    if (createAuthErr || !newAuth?.user) {
      return new Response(
        JSON.stringify({ error: createAuthErr?.message || "Failed to create authentication user." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newUserId = newAuth.user.id;

    // 7. Sync legacy admin_users table
    const { error: insertUserErr } = await supabaseAdmin
      .from("admin_users")
      .upsert({
        user_id: newUserId,
        email: cleanEmail,
      });

    if (insertUserErr) {
      // Rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return new Response(
        JSON.stringify({ error: `Admin user table record creation failed: ${insertUserErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Insert or update admin_profiles row
    const { error: insertProfileErr } = await supabaseAdmin
      .from("admin_profiles")
      .upsert({
        user_id: newUserId,
        full_name: String(name).trim(),
        email: cleanEmail,
        role: role,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (insertProfileErr) {
      // Rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return new Response(
        JSON.stringify({ error: `Profile creation failed: ${insertProfileErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 9. Insert permissions if sub_admin
    if (role === "sub_admin" && Array.isArray(permissions) && permissions.length > 0) {
      const permRows = permissions.map((p: string) => ({
        admin_user_id: newUserId,
        permission: p,
      }));

      const { error: permErr } = await supabaseAdmin.from("admin_permissions").insert(permRows);
      if (permErr) {
        // Rollback auth user
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
        return new Response(
          JSON.stringify({ error: `Permissions setup failed: ${permErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 10. Record Activity Log (No plaintext password logged)
    await supabaseAdmin.from("admin_activity_logs").insert({
      admin_user_id: callerUser.id,
      admin_name: callerProfile.full_name || callerUser.email || "Super Admin",
      action: "CREATE",
      resource_type: "Admin Account",
      resource_id: newUserId,
      description: `Created ${role === "super_admin" ? "Super Admin" : "Sub Admin"} account for ${name} (${cleanEmail})`,
      metadata: { role, permissions },
    });

    // 11. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Account created successfully for ${name}`,
        user: {
          id: newUserId,
          email: cleanEmail,
          fullName: String(name).trim(),
          role: role,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "An unexpected server error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
