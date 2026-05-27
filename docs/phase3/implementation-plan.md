# PPL-HR Phase 3 Implementation Plan

Last updated: 2026-05-27

## Phase objective

Implement complete leave and holiday operations with policy control, employee requests, and approval routing.

## In-scope modules

- Leave balance
- Leave application
- Leave approvals
- Leave setup and policy controls
- Holiday calendar management

## Functional scope

1. Leave balance:
   - Leave type table
   - Consumed, pending, and available tracking
2. Leave applications:
   - Calendar + form split view
   - Leave type, date range, emergency contact, reason
   - Approval status tracking
3. Leave setup:
   - Leave policy CRUD
   - Cashable and role applicability
4. Holiday calendar:
   - Month-wise list
   - Add holiday manually
   - Import holiday dataset

## Role behavior

- Employee:
  - Apply leave and view own leave states.
- Manager:
  - Approve team leave and review leave patterns.
- Admin:
  - Configure leave policies and holiday definitions.

## Deliverables

- Unified leave workflow
- Policy configuration interface
- Import-ready holiday management
- Approval chain visibility
