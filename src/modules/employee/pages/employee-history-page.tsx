import { Skeleton } from '../../../shared/components/ui/skeleton'
import { AttendanceHistoryTable } from '../../attendance/components/attendance-history-table'
import { useAttendanceRecords } from '../../attendance/hooks/use-attendance-data'
import { useAttendanceStore } from '../../attendance/store/use-attendance-store'

export function EmployeeHistoryPage() {
  const recordsQuery = useAttendanceRecords()
  const today = useAttendanceStore((state) => state.today)

  if (recordsQuery.isLoading) {
    return <Skeleton className="h-96" />
  }

  const records = [today, ...(recordsQuery.data ?? []).filter((record) => record.date !== today.date)]
  return <AttendanceHistoryTable records={records} />
}
