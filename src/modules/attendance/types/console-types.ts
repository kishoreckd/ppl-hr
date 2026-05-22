export type ConsolePageType =
  | 'dashboard'
  | 'attendance-info'
  | 'attendance-calendar'
  | 'attendance-history'
  | 'regularization'
  | 'team-attendance'
  | 'team-calendar'
  | 'leave-calendar'

export const PAGE_TITLES: Record<ConsolePageType, string> = {
  'attendance-calendar': 'Attendance calendar',
  'attendance-history': 'Attendance history',
  'attendance-info': 'Attendance info',
  dashboard: 'Dashboard',
  'leave-calendar': 'Leave and holidays',
  regularization: 'Regularization applications',
  'team-attendance': 'Team attendance',
  'team-calendar': 'Team calendar',
}

export function getMobilePages(managerView: boolean): ConsolePageType[] {
  return managerView
    ? ['dashboard', 'team-attendance', 'team-calendar', 'regularization', 'leave-calendar']
    : [
        'dashboard',
        'attendance-info',
        'attendance-calendar',
        'attendance-history',
        'regularization',
        'leave-calendar',
      ]
}
