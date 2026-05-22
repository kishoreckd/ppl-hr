import { Skeleton } from '../../../shared/components/ui/skeleton'
import { useAttendanceRecords, useTeamAttendance } from '../../attendance/hooks/use-attendance-data'
import type { IAttendanceRecord, ITeamAttendanceMember } from '../../attendance/types/attendance-types'
import { getDateKey } from '../../attendance/utils/time-utils'
import { AttendanceCalendar } from '../../calendar'

export function TeamCalendarPage() {
  const teamQuery = useTeamAttendance()
  const recordsQuery = useAttendanceRecords()

  if (teamQuery.isLoading || recordsQuery.isLoading) {
    return <Skeleton className="h-[40rem]" />
  }

  const records = [...teamRecords(teamQuery.data ?? []), ...(recordsQuery.data ?? []).slice(0, 4)]
  return <AttendanceCalendar records={records} title="Team attendance calendar" />
}

function teamRecords(members: ITeamAttendanceMember[]): IAttendanceRecord[] {
  return members.map((member) => ({
    date: getDateKey(),
    employeeName: member.employeeName,
    late: member.swipeIn > '09:30 AM',
    totalMinutes: member.totalMinutes,
  }))
}
