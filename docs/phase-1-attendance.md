# Phase 1 attendance

Phase 1 narrows the product to authentication and attendance.

## Authentication

- Login, signup, forgot password, and reset password use React Hook Form and Zod.
- A role-scoped session is persisted locally behind the auth API adapter for the frontend prototype.
- Roles are Employee, Manager, and Admin.
- Protected attendance UI is rendered only after a session exists.
- Backend integration should replace the current adapter with FastAPI JWT issue, refresh, revoke, and reset endpoints.

## Attendance policy

- Check in starts a live working timer.
- Check in can capture an optional mood so daily attendance and wellbeing trends can be reviewed together.
- Check out closes one work interval.
- The same check button supports repeated check-in and check-out intervals through the day.
- Eight or more working hours is Full Day Present.
- Four or more working hours is Half Day Present.
- Less than four working hours is Absent.
- First check in after `09:30` is late.
- Working time above nine hours is overtime.

## Dashboards

- Employee dashboard shows daily check state and summaries; attendance info, calendar, and history live in submenu pages.
- Manager dashboard shows online staff, absent staff, late marks, and its action queue; team attendance and calendar live in submenu pages.
- Date detail panels expose check in, check out, total hours, attendance status, and late marks.
- Leave and holiday pages allow employees to apply leave and managers to add holidays and approve requests.

## Realtime direction

- The current frontend simulates live time from check state.
- FastAPI WebSockets should publish employee presence, punch transitions, correction approval updates, and team dashboard deltas.
- MongoDB attendance events should be append-first so audit and payroll reconciliation can replay a day.
