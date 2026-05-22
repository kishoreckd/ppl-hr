export function useCalendarLabel(scope: 'employee' | 'team') {
  return scope === 'team' ? 'Team attendance calendar' : 'Attendance calendar'
}
