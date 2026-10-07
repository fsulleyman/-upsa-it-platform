# Audit Reconnaissance & Strategy Plan

**System Name**: UPSA Department of Information Technology Studies Platform (`upsa-it-platform`)  
**Audit Date**: October 3, 2026  
**Auditor**: Principal System Architecture & Security Audit Team (AI-Assisted Autonomous Audit)

---

## 1. System Inventory & Repository Structure

The project is a full-stack Web application built for the Department of Information Technology Studies at University of Professional Studies, Accra (UPSA).

### File System Overview
- `src/main.tsx` & `src/App.tsx`: Frontend React 19 application entry points.
- `src/pages/`: Student-facing & standalone pages (`LearningHubPage.tsx`, `FacultyPage.tsx`, `ResetPasswordPage.tsx`).
- `src/components/`:
  - `admin/`: Comprehensive Central CMS Admin Portal (`AdminDashboard.tsx`, `AdminManagementSection.tsx`, `ResourceManagementSection.tsx`, `AnalyticsSection.tsx`, `CurriculumManagementSection.tsx`, `ActivityLogsSection.tsx`, `MyAccountSection.tsx`, `ui/`).
  - `layout/`: Main website navigation and footer (`Navbar.tsx`, `Footer.tsx`).
  - `sections/`: Main landing page modules (`HeroSection.tsx`, `AboutSection.tsx`, `ProgrammesSection.tsx`, `FacultySection.tsx`, `ProjectsShowcaseSection.tsx`, `DevelopersHubSection.tsx`, `EventsSection.tsx`).
  - `modals/`: Interactive student dialogs (`JoinHubModal.tsx`, `ProgrammeDetailModal.tsx`, `ProjectDetailModal.tsx`, `EventAnnouncementModal.tsx`).
- `src/context/`: Auth state management (`AuthContext.tsx`).
- `src/hooks/`: Data fetching hooks (`useData.ts`, `useCourses.ts`, `useLearningResources.ts`).
- `src/lib/`:
  - Supabase client initialization (`supabase.ts`).
  - SQL schema, migration, RLS policy scripts (`admin_system_migration.sql`, `cms_schema_and_rls.sql`, `learning_hub_schema_and_curriculum.sql`, `learning_resources_storage_schema.sql`, `top_resources_analytics.sql`, etc.).
  - Telemetry and activity logging utilities (`analyticsTracker.ts`, `activityLogger.ts`).
- `src/utils/`: Hash router (`hashRouter.ts`), file storage handlers (`resourceStorage.ts`, `storage.ts`).
- `supabase/functions/`: Deno-based Edge Functions (`create-sub-admin`, `reset-admin-password`).
- `docs/`: Existing audit reports (`LEARNING_HUB_AUDIT.md`).

---

## 2. Identified System Entry Points

1. **Web Frontend Entrypoint**:
   - `index.html` $\rightarrow$ `src/main.tsx` $\rightarrow$ `src/App.tsx`.
   - Routing: Custom Hash-based routing via `src/utils/hashRouter.ts` supporting routes `#/`, `#/faculty`, `#/learning-hub`, `#/admin`, `#/reset-password`.
2. **Backend Services & API Entrypoints**:
   - **Supabase PostgREST API**: Exposed tables (`admin_profiles`, `admin_permissions`, `admin_activity_logs`, `courses`, `learning_resources`, `programmes`, `projects`, `faculty`, `site_analytics`, etc.).
   - **Supabase RPC Functions**: `track_resource_event`, `get_top_learning_resources`.
   - **Supabase Edge Functions**:
     - `POST /functions/v1/create-sub-admin`
     - `POST /functions/v1/reset-admin-password`
   - **Supabase Auth Service**: `signInWithPassword`, `resetPasswordForEmail`, `signOut`, `onAuthStateChange`.
   - **Supabase Storage Service**: `learning-resources` public bucket.

---

## 3. Accessible vs. Inaccessible Assets

### Accessible Assets (IN-SCOPE for inspection)
- Complete source code (`src/`, `supabase/functions/`, `package.json`, `vite.config.ts`, `tsconfig.json`).
- All database migration SQL scripts in `src/lib/`.
- Built artifacts in `dist/`.
- Local git repository structure and commit history.
- Local static assets and mock fallbacks (`src/data/groundTruth.ts`).

### Inaccessible Assets (LIMITATIONS / OUT-OF-SCOPE)
- Production Supabase Cloud database live connection credentials (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` runtime environment secrets when unconfigured).
- Supabase Cloud Service Role Key (`SUPABASE_SERVICE_ROLE_KEY` is server-side only in Edge Functions).
- Vercel Hosting infrastructure deployment panel settings and environment variables.
- Direct execution logs from Vercel / Supabase Edge Network.

---

## 4. Audit Execution Strategy & Plan

1. **Phase 1: Reverse-Engineering & System Analysis (Part A)**
   - Extract exact requirements, data contracts, schema definitions, and system boundaries.
   - Author Mermaid diagrams for System Context, Container/Services, Components, Deployment, Trust Boundaries, ERD, Data Flows, Sequence Diagrams, and State Transitions.
   - Save standalone `.mmd` files in `audit/diagrams/`.

2. **Phase 2: Systematic Domain Audit (Part B)**
   - Evaluate 14 key technical domains:
     1. Architecture & Design Fitness
     2. Code Quality & Maintainability
     3. AI-Generated Code Risks (Antigravity-specific pattern checks)
     4. Security Architecture & Vulnerability Audit (OWASP Top 10)
     5. Data & Database Engineering
     6. API & Integration Contracts
     7. Testing & QA Coverage
     8. DevOps, CI/CD & Build Infrastructure
     9. Performance, Scalability & Web Vitals
     10. Reliability, Resilience & Observability
     11. Frontend, UX & Accessibility (WCAG 2.1 AA)
     12. Compliance, Privacy & Data Governance
     13. Documentation & Team Readiness
     14. Operational Cost & Efficiency

3. **Phase 3: Target Architecture & Recommendations (Part C)**
   - Design target architecture with Mermaid diagram.
   - Draft Architecture Decision Records (ADRs) for key structural improvements.
   - Produce prioritized findings matrix (`FINDINGS.csv`), action roadmap (Immediate, Short-term, Medium-term), and Quick Wins.

4. **Phase 4: Final Deliverables Compilation**
   - Synthesize all findings into `audit/SYSTEM_AUDIT_REPORT.md`, `audit/FINDINGS.csv`, `audit/OPEN_QUESTIONS.md`, and `audit/diagrams/`.
