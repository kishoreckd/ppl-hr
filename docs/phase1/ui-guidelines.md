# PPL-HR Phase 1 UI Guidelines

Last updated: 2026-05-27

## Design intent

Build a workflow-first enterprise UI that is calm, compact, and highly scannable.

Style principles:

- Operational, not marketing-like
- Minimal chrome, maximum action clarity
- Consistent spacing and typography
- Role-aware without visual clutter

## Typography

- Primary font family: `Manrope`
- Heading style:
  - Strong weight (`800` or `900`)
  - Tight tracking for section headers
- Body style:
  - `14px` to `16px`
  - Medium or semibold for operational readability
- Caption/meta style:
  - `12px`
  - Muted color for helper text and table meta

## Color system

Core palette:

- Primary action blue: `#1e3fe3`
- Primary text: `#071126`
- Secondary text: `#5c6b8e`
- Border line: `#dce3f1`
- Workspace background: `#f2f3f5`
- Card background: `#ffffff`

Semantic states:

- Success: green family (approved, completed, healthy)
- Warning: amber family (on hold, pending attention)
- Danger: red/rose family (rejected, blocked)
- Info: blue family (new request, informational)

Rule:

- Use semantic colors only for status and actionable signals, not for random decoration.

## Layout system

Global shell:

- Left sidebar fixed
- Topbar sticky
- Main workspace scrollable

Spacing:

- Page outer padding: `16px` mobile, `24px` desktop
- Card padding: `16px` to `20px`
- Section gaps: `12px` to `16px`

Corners and elevation:

- Standard radius: `12px` to `16px`
- Light shadow for cards and overlays
- Avoid heavy/glassy effects

## Navigation behavior

- Sidebar groups:
  - Core operations
  - Attendance
  - Leave
  - Admin/Org tools
- Only show role-allowed pages.
- Keep active item clearly highlighted.
- Avoid duplicate module entries for the same role context.

## Component rules

Buttons:

- Height minimum: `44px`
- Primary action: blue filled
- Secondary action: outline
- Ghost action: icon/support action only

Inputs/selects:

- Consistent height (`44px`)
- Same border and focus ring rules everywhere
- Error state always with clear inline message

Tables:

- Dense but readable row height
- Sticky-intent headers where applicable
- Status badge in dedicated column
- Notes/remarks visible in table when review context matters

Cards:

- Use cards for task surfaces, not as decorative wrappers
- Card header should include title and optional action

Badges:

- Use for role chips, state tags, counters
- Keep badge text short

## Page templates

Template A: List + filters + actions

- Header row: search + filter chips + primary action
- Optional summary strip
- Table body with pagination

Template B: Split form

- Left: calendar/context/preview
- Right: form fields and submit actions
- Works for leave and regularization

Template C: Dashboard operations

- Top: immediate action card (check-in/out)
- Middle: KPI metric cards
- Bottom: queue/recent activity/actionable lists

## Motion and interaction

- Use subtle transitions (`180ms` to `240ms`)
- Hover should improve affordance, never distract
- Avoid long or spring-heavy animations in core workflows

## Empty/loading/error standards

Loading:

- Show shimmer or skeleton for all primary regions
- Never render blank white space while loading

Empty:

- Show clear "what next" action
- Keep copy short and operational

Error:

- Inline field-level errors for forms
- Toast for operation-level errors with actionable wording

## Toast standards

- Success: clear completion message
- Error: clear reason and next step hint
- Warning: cautionary non-blocking notice
- Info: neutral operational update

Examples:

- `Employee added successfully`
- `Regularization request submitted successfully`
- `Failed to update attendance`
- `Insufficient permissions for this action`

## Accessibility and responsiveness

- Ensure keyboard focus visibility on all actions
- Keep tap targets large enough on mobile
- No text clipping in cards, table cells, or buttons
- Preserve hierarchy and context on tablet/mobile breakpoints

## Phase 1 enforcement checklist

- One consistent visual system across auth and app shell
- No duplicate page titles or unnecessary subtitle noise
- Sidebar and route visibility fully role-aware
- Table/filter/form patterns reused across modules
- All primary screens have loading, empty, and error states
