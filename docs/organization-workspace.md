# Organization workspace

The first TeamPilot product surface establishes a company hierarchy before HR workflows are activated.

## Setup entry

The workspace setup surface lives at `/setup` and is completed before `/login`.

Setup is intentionally split into three focused steps:

- Founder contact captures the initial workspace owner.
- Company identity captures company website, name, and domain.
- Admin employee access captures one or more admin employees through repeatable name and email rows.

This keeps company creation separate from authentication while still preparing the admin ownership model for later employee, policy, and hierarchy configuration.

## Hierarchy rules

- A company head is the root escalation owner until managers and HRBPs are assigned.
- The supported inheritance path is Company > Business Unit > Department > Team > Manager > Employee.
- Dotted-line managers can be visible without receiving action permissions.
- Location mapping drives holiday calendars, shift policy, and payroll dependencies.

## Approval flow

- Requests retain their reporting chain, policy impact, SLA, and audit context.
- Managers and HR admins can route approval actions from the current cockpit.
- Employees can inspect their scoped requests but cannot approve a hierarchy action.
- Attendance corrections and leave requests must remain policy-aware before payroll sync.

## UI states

- Workspace data loads through the organization API/service boundary and React Query.
- Shimmer skeletons cover the shell and product panels while data loads.
- Form validation messages are kept next to setup fields.
- Toast notifications use success, error, warning, and info tones with explicit next-step text.

## Next modules

Attendance, leave, OKRs, performance, payroll integration, reporting, and security features should extend the same feature folder pattern and add API, workflow, edge-case, and RBAC documentation.
