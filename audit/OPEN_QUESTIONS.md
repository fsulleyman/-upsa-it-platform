# Open Questions for Engineering & Product Teams

The following questions require input from project stakeholders, DevOps, or system administrators, as they cannot be fully verified through static codebase inspection alone:

| # | Topic | Question | Impact / Rationale |
|---|---|---|---|
| **Q1** | **Database Migration State** | Have all 11 SQL scripts in `src/lib/` (including `admin_system_migration.sql`, `cms_schema_and_rls.sql`, `learning_hub_schema_and_curriculum.sql`, `learning_resources_storage_schema.sql`, `top_resources_analytics.sql`) been executed in sequence on the live production Supabase instance? | Unexecuted migrations will cause missing table (`42P01`) or column errors on production. |
| **Q2** | **Production Secret Management** | Are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured as environment variables in Vercel, and is `SUPABASE_SERVICE_ROLE_KEY` restricted strictly to Supabase Edge Function secrets (`Deno.env.get`)? | Exposing `SUPABASE_SERVICE_ROLE_KEY` in frontend bundles bypasses RLS globally. |
| **Q3** | **CI/CD & Deployment Strategy** | Is Vercel configured for automated git-driven deployments on push to `main`, or are deployments executed manually via Vercel CLI? | Determines automated testing gates and rollback procedures before production deployment. |
| **Q4** | **Backup, RPO & RTO SLAs** | What is the configured Point-in-Time Recovery (PITR) retention period and disaster recovery SLA for the Supabase PostgreSQL database? | Critical for recovering academic course materials, curriculum metadata, and audit logs. |
| **Q5** | **Super Admin MFA & SSO Enrolment** | Is Multi-Factor Authentication (MFA / TOTP) planned or enforced for Super Administrators logging into the Central CMS Control Center? | Prevents credential theft or brute-force compromise of Super Admin permissions. |
| **Q6** | **Storage Bucket Public Access Boundaries** | Is the `learning-resources` bucket configured with public read access while restricting write/update/delete operations to authenticated admins via RLS? | Protects stored academic files from unauthorized overwrites or deletion. |
| **Q7** | **PostgREST Result Limit Configuration** | Is PostgREST's default maximum row limit (1,000 rows) overridden in Supabase project settings for site analytics or course listing queries? | Uncapped queries without pagination or RPC truncation could truncate results when dataset exceeds 1,000 rows. |
