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
  'team-attendance': 'Team attendance',
  'team-calendar': 'Team calendar',
}

export function getPageBreadcrumb(page: ConsolePageType): string[] {
  if (
    [
      'attendance-info',
      'attendance-calendar',
      'attendance-history',
      'regularization',
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

  return [PAGE_TITLES[page]]
}

export function getMobilePages(managerView: boolean): ConsolePageType[] {
  return managerView
    ? ['dashboard', 'profile', 'team-attendance', 'team-calendar', 'regularization', 'leave-application', 'leave-calendar']
    : [
        'dashboard',
        'profile',
        'attendance-info',
        'attendance-calendar',
        'attendance-history',
        'regularization',
        'leave-balance',
        'leave-calendar',
      ]
}
