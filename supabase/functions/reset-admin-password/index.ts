import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // 4. Verify caller permissions (Must be super_admin or have manage_admins permission)
    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, is_active, full_name, email")
      .eq("user_id", callerUser.id)
      .single();

    if (profileErr || !callerProfile || !callerProfile.is_active) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Active administrator profile required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let isAuthorized = callerProfile.role === "super_admin";

    if (!isAuthorized) {
      const { data: callerPerms } = await supabaseAdmin
        .from("admin_permissions")
        .select("permission")
        .eq("admin_user_id", callerUser.id);

      isAuthorized = (callerPerms || []).some((p: any) => p.permission === "manage_admins");
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "Forbidden: You do not have permission to manage or reset administrator passwords." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Parse payload
    const body = await req.json();
    const { targetUserId, newPassword, action = "set_password" } = body;

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: "Target administrator user ID is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch target admin profile for audit logging
    const { data: targetProfile, error: targetProfileErr } = await supabaseAdmin
      .from("admin_profiles")
      .select("full_name, email, role")
      .eq("user_id", targetUserId)
      .single();

    if (targetProfileErr || !targetProfile) {
      return new Response(
        JSON.stringify({ error: "Target administrator profile not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Protection: Sub-admin cannot reset Super Admin password unless they themselves are Super Admin
    if (targetProfile.role === "super_admin" && callerProfile.role !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only Super Administrators can reset Super Admin passwords." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "set_password") {
      if (!newPassword || newPassword.length < 6) {
        return new Response(
          JSON.stringify({ error: "Temporary password must be at least 6 characters long." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update password using Supabase Auth Admin API
      const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
        targetUserId,
        { password: newPassword }
      );

      if (updateAuthErr) {
        return new Response(
          JSON.stringify({ error: updateAuthErr.message || "Failed to update target user password." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Record Activity Log (NEVER log plaintext passwords)
      await supabaseAdmin.from("admin_activity_logs").insert({
        admin_user_id: callerUser.id,
        admin_name: callerProfile.full_name || callerProfile.email || "Administrator",
        action: "PASSWORD_RESET",
        resource_type: "Admin Account",
        resource_id: targetUserId,
        description: `Set temporary password for administrator ${targetProfile.full_name} (${targetProfile.email})`,
        metadata: { target_email: targetProfile.email, method: "admin_temporary_password" },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: `Temporary password updated successfully for ${targetProfile.full_name} (${targetProfile.email}).`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported action '${action}'.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "An unexpected server error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
