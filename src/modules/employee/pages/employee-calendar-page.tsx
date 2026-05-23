import { Skeleton } from '../../../shared/components/ui/skeleton'
import { useAttendanceRecords } from '../../attendance/hooks/use-attendance-data'
import { useAttendanceStore } from '../../attendance/store/use-attendance-store'
import { AttendanceCalendar } from '../../calendar'

export function EmployeeCalendarPage({ onRegularize }: { onRegularize?: () => void }) {
  const recordsQuery = useAttendanceRecords()
  const today = useAttendanceStore((state) => state.today)

  if (recordsQuery.isLoading) {
    return <Skeleton className="h-[40rem]" />
  }

  const records = [today, ...(recordsQuery.data ?? []).filter((record) => record.date !== today.date)]
  return <AttendanceCalendar onRegularize={onRegularize} records={records} title="Attendance calendar" />
}
