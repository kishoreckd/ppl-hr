# PPL-HR Phase 1 Implementation Plan

Last updated: 2026-05-28

## Phase objective

Establish product foundation, workspace onboarding, authentication, and core attendance operations with strict role-aware access.

## In-scope modules

- Workspace setup
- Authentication and session
- Attendance info
- Attendance calendar
- Attendance history
- Regularization
- Timesheets
- Base settings and role toggles

## Functional scope

1. Workspace setup flow before login:
   - Founder contact
   - Company identity
   - Admin employee access
2. Authentication:
   - Login
   - Signup
   - Forgot password
   - Reset password
   - Microsoft sign-in entry
3. Attendance operations:
   - Check in and check out
   - Late mark and hours calculation
   - Monthly status calendar
   - Attendance history table
4. Regularization:
   - Employee request creation
   - Manager/admin review actions
   - Notes and people distribution indicators
5. Timesheets:
   - Daily, weekly, monthly entries
   - Edit and delete own entries
   - Manager/admin review

## Role behavior

- Employee:
  - Access self attendance, leave-facing attendance links, own regularization, own timesheets.
- Manager:
  - Access team attendance views, approvals, regularization controls, team-level actions.
- Admin:
  - Access policy-oriented workflows and regularization controls without duplicate team attendance pages.

## Technical standards

- React + TypeScript + Vite
- Shadcn UI + Tailwind CSS
- React Hook Form + Zod
- React Query for server state
- Zustand for local app state
- Toastify for success/error/warning/info
- Skeleton/shimmer loading states on all main screens

## Deliverables

- Stable route map with protected route checks
- Sidebar navigation with role-conditioned menus
- Attendance and regularization production-like workflows
- Timesheet workflow integrated into attendance navigation
- Documentation baseline for later phases

## Completion checklist

- All Phase 1 screens routable by URL
- No unauthorized page access by role
- No duplicate header/subtitle noise in workspace pages
- Build and lint passing

## Reference docs

- [Phase 1 UI Guidelines](./ui-guidelines.md)
- [Phase 1 Completion Audit](./completion-audit.md)
