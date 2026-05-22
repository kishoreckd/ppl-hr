import { Skeleton } from '../../../shared/components/ui/skeleton'
import { useTeamAttendance } from '../../attendance/hooks/use-attendance-data'
import { TeamAttendanceTable } from '../components/team-attendance-table'

export function TeamAttendancePage() {
  const teamQuery = useTeamAttendance()

  if (teamQuery.isLoading) {
    return <Skeleton className="h-[30rem]" />
  }

  return <TeamAttendanceTable members={teamQuery.data ?? []} />
}
