export type ConsolePageType =
  | 'dashboard'
  | 'profile'
  | 'attendance-info'
  | 'attendance-calendar'
  | 'attendance-history'
  | 'regularization'
  | 'team-attendance'
  | 'team-calendar'
  | 'leave-balance'
  | 'leave-application'
  | 'leave-admin'
  | 'leave-calendar'
  | 'settings'
  | 'timesheet'

export type ConsoleRoleType = 'Employee' | 'Manager' | 'Admin'

export const PAGE_TITLES: Record<ConsolePageType, string> = {
  'attendance-calendar': 'Attendance calendar',
  'attendance-history': 'Attendance history',
  'attendance-info': 'Attendance info',
  dashboard: 'Dashboard',
  'leave-calendar': 'Holiday calendar',
  'leave-application': 'Leave application',
  'leave-balance': 'Employee leave balance',
  'leave-admin': 'Leaves',
  profile: 'Profile',
  regularization: 'Regularization applications',
  settings: 'Settings',
  'team-attendance': 'Team attendance',
  'team-calendar': 'Team calendar',
  timesheet: 'Timesheet',
}

export const CONSOLE_PAGE_PATHS: Record<ConsolePageType, string> = {
  'attendance-calendar': '/attendance/calendar',
  'attendance-history': '/attendance/history',
  'attendance-info': '/attendance/info',
  dashboard: '/dashboard',
  'leave-admin': '/leave/setup',
  'leave-application': '/leave/applications',
  'leave-balance': '/leave/balance',
  'leave-calendar': '/leave/holiday-calendar',
  profile: '/profile',
  regularization: '/attendance/regularizations',
  settings: '/settings',
  'team-attendance': '/team/attendance',
  'team-calendar': '/team/calendar',
  timesheet: '/timesheet',
}

export function getConsolePageFromPath(pathname: string): ConsolePageType | null {
  const match = Object.entries(CONSOLE_PAGE_PATHS).find(([, path]) => path === pathname)
  return match ? (match[0] as ConsolePageType) : null
}

export function getPageBreadcrumb(page: ConsolePageType): string[] {
  if (
    [
      'attendance-info',
      'attendance-calendar',
      'attendance-history',
      'regularization',
      'timesheet',
      'team-attendance',
      'team-calendar',
    ].includes(page)
  ) {
    return ['Attendance', PAGE_TITLES[page]]
  }

  if (['leave-balance', 'leave-application', 'leave-calendar', 'leave-admin'].includes(page)) {
    return ['Leave', PAGE_TITLES[page]]
  }

  if (page === 'profile') {
    return ['Profile']
  }

  if (page === 'settings') {
    return ['Settings']
  }

  return [PAGE_TITLES[page]]
}

export const ROLE_PAGE_RULES: Record<ConsoleRoleType, ConsolePageType[]> = {
  Admin: [
    'dashboard',
    'profile',
    'attendance-info',
    'attendance-calendar',
    'attendance-history',
    'regularization',
    'timesheet',
    'team-attendance',
    'team-calendar',
    'leave-balance',
    'leave-application',
    'leave-calendar',
    'leave-admin',
    'settings',
  ],
  Employee: [
    'dashboard',
    'profile',
    'attendance-info',
    'attendance-calendar',
    'attendance-history',
    'regularization',
    'timesheet',
    'leave-balance',
    'leave-application',
    'leave-calendar',
    'settings',
  ],
  Manager: [
    'dashboard',
    'profile',
    'attendance-info',
    'attendance-calendar',
    'attendance-history',
    'regularization',
    'timesheet',
    'team-attendance',
    'team-calendar',
    'leave-balance',
    'leave-application',
    'leave-calendar',
    'settings',
  ],
}

export function getPagesForRole(role: ConsoleRoleType): ConsolePageType[] {
  return ROLE_PAGE_RULES[role]
}

export function canAccessPage(role: ConsoleRoleType, page: ConsolePageType) {
  return ROLE_PAGE_RULES[role].includes(page)
}

export function getMobilePages(role: ConsoleRoleType): ConsolePageType[] {
  const allowed = getPagesForRole(role)
  return [
    'dashboard',
    'profile',
    'attendance-info',
    'attendance-calendar',
    'team-attendance',
    'timesheet',
    'regularization',
    'leave-balance',
    'leave-application',
    'leave-calendar',
    'settings',
  ].filter((page): page is ConsolePageType => allowed.includes(page as ConsolePageType))
}
