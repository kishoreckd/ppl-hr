import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../api/attendance-api'

export function useAttendanceRecords() {
  return useQuery({
    queryFn: attendanceApi.getRecords,
    queryKey: ['attendance-records'],
  })
}

export function useTeamAttendance() {
  return useQuery({
    queryFn: attendanceApi.getTeam,
    queryKey: ['team-attendance'],
  })
}
