# Phase 1 attendance

Phase 1 narrows the product to authentication and attendance.

## Authentication

- Login, signup, forgot password, and reset password use React Hook Form and Zod.
- A role-scoped session is persisted locally behind the auth API adapter for the frontend prototype.
- Roles are Employee, Manager, and Admin.
- Protected attendance UI is rendered only after a session exists.
- Backend integration should replace the current adapter with FastAPI JWT issue, refresh, revoke, and reset endpoints.

## Attendance policy

- Swipe in starts a live working timer.
- Swipe out closes the attendance day and locks the calculated working minutes.
- One swipe button starts the workday and changes to swipe out while the shift is open.
- Eight or more working hours is Full Day Present.
- Four or more working hours is Half Day Present.
- Less than four working hours is Absent.
- Swipe in after `09:30` is late.
- Working time above nine hours is overtime.

## Dashboards

- Employee dashboard shows daily swipe state and summaries; attendance info, calendar, and history live in submenu pages.
- Manager dashboard shows online staff, absent staff, late marks, and its action queue; team attendance and calendar live in submenu pages.
- Date detail panels expose swipe in, swipe out, total hours, attendance status, and late marks.
- Leave and holiday pages allow employees to apply leave and managers to add holidays and approve requests.

## Realtime direction

- The current frontend simulates live time from swipe state.
- FastAPI WebSockets should publish employee presence, swipe transitions, correction approval updates, and team dashboard deltas.
- MongoDB attendance events should be append-first so audit and payroll reconciliation can replay a day.
