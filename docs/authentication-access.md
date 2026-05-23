# TeamPilot Authentication Access

This document explains the login paths available in the current TeamPilot Phase 1 build.

## User Login

Employees and managers can sign in with a work email and password from the login screen.

Example users:

| Role | Email pattern | Password |
| --- | --- | --- |
| Employee | `employee@cxontology.com` | Any non-empty password that does not include `invalid` |
| Manager | `manager@cxontology.com` | Any non-empty password that does not include `invalid` |

Role detection currently follows the email address:

- Emails containing `manager` sign in as Manager.
- Standard work emails sign in as Employee.

After successful login, the session is persisted locally and the user is taken to the TeamPilot workspace.

## Admin Login

Use the following admin credentials:

| Field | Value |
| --- | --- |
| Email | `Admin@cxontology.com` |
| Password | `Admin@123` |

The email comparison is case-insensitive, so `admin@cxontology.com` also works.

Admin login unlocks manager/admin views, including team attendance, team calendar, regularization review, and leave calendar access.

## Microsoft Login

The Microsoft sign-in button is available on the login screen.

In this local build, Microsoft login uses a mocked secure session and signs in as:

| Field | Value |
| --- | --- |
| Name | Microsoft User |
| Email | `employee@cxontology.com` |
| Role | Employee |

## Validation Behavior

- Login fields validate while typing.
- Errors are shown only after interaction with a field.
- Invalid admin passwords show a clear admin credential error.
- Invalid demo passwords containing `invalid` show a credential error.

## Security Notes

- This is a frontend demo auth flow for Phase 1.
- Production auth must use FastAPI, JWT refresh flows, secure cookies or token storage rules, password hashing, rate limiting, audit logs, and Microsoft Entra ID/OAuth validation.
- Role and permission checks must also be enforced on the backend.
