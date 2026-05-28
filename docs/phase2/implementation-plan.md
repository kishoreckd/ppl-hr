# PPL-HR Phase 2 Implementation Plan

Last updated: 2026-05-28

## Phase objective

Expand people operations and attendance workflows into full employee lifecycle and manager execution surfaces.

## In-scope modules

- Employees directory
- Employee profile and editable sections
- Team-level attendance controls
- Regularization manager workbench enhancements

## Functional scope

1. Employees:
   - Employee list page with filters
   - Add employee flow with role mapping
   - Department, manager, and hierarchy tags
2. Employee profile:
   - Overview
   - Contact
   - Interests
   - Optional document metadata (visibility by role)
3. Attendance manager scope:
   - Team exceptions
   - Late login focus
   - Pending attendance actions
4. Regularization manager scope:
   - Bulk selection actions
   - Notes-first review behavior
   - People distribution and manager filters

## Role behavior

- Employee:
  - View own profile and own attendance-linked requests.
- Manager:
  - View and act on team requests.
- Admin:
  - Manage org-wide people configuration and policy-facing actions.

## Deliverables

- Employee directory with add flow
- Profile surface consistency
- Team-attendance and regularization review maturity
- Role-accurate navigation behavior

## Completion checklist

- Employee directory supports list filters and role mapping add flow
- Employee profile includes role-aware optional document metadata visibility
- Team attendance supports exception, late-login, and pending-action focus controls
- Regularization manager workbench supports bulk actions and notes-first review
- Build and lint passing

## Reference docs

- [Phase 2 Completion Audit](./completion-audit.md)
- [Phase 2 UI Color Direction](./ui-color-direction.md)
