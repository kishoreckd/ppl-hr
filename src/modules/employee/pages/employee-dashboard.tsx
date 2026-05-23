import { CalendarCheck2, Clock9, PlaneTakeoff, ShieldAlert } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { RecentSwipesPanel, SwipeConsole } from '../../attendance/components/swipe-console'
import { useAttendanceRecords } from '../../attendance/hooks/use-attendance-data'
import { useAttendanceStore } from '../../attendance/store/use-attendance-store'
import { formatMinutes, getAttendanceStatus, getWorkedMinutes } from '../../attendance/utils/time-utils'

export function EmployeeDashboard({ onOpenLeaveApplication }: { onOpenLeaveApplication?: () => void }) {
  const recordsQuery = useAttendanceRecords()
  const today = useAttendanceStore((state) => state.today)

  if (recordsQuery.isLoading) {
    return <EmployeeSkeleton />
  }

  const records = [today, ...(recordsQuery.data ?? []).filter((record) => record.date !== today.date)]
  const presentDays = records.filter((record) => getAttendanceStatus(record) === 'Present').length
  const weeklyMinutes = records.slice(0, 5).reduce((total, record) => total + getWorkedMinutes(record, record.swipeOut), 0)
  const lateMarks = records.filter((record) => record.late).length

  return (
    <div className="space-y-4">
      <SwipeConsole />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary icon={<CalendarCheck2 className="size-5" />} label="Present" value={`${presentDays} days`} />
        <Summary icon={<Clock9 className="size-5" />} label="Weekly hours" value={formatMinutes(weeklyMinutes)} />
        <Summary icon={<ShieldAlert className="size-5" />} label="Late marks" value={`${lateMarks}`} />
        <Summary icon={<PlaneTakeoff className="size-5" />} label="Leave balance" value="11 days" />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <RecentSwipesPanel />
        <Card className="p-4 sm:p-5">
          <Badge tone="brand">Upcoming holidays</Badge>
          <div className="mt-4 space-y-2">
            {[
              ['Holiday', 'Chennai office', '28 May'],
              ['Leave', 'Casual leave request', 'Pending'],
              ['Shift', 'General shift', '09:00'],
            ].map(([label, item, value]) => (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3 text-left transition hover:border-[#1e3fe3]/30 hover:bg-[#eaf0ff]"
                key={item}
                onClick={onOpenLeaveApplication}
                type="button"
              >
                <div>
                  <p className="text-xs font-black uppercase text-[#5c6b8e]">{label}</p>
                  <p className="font-bold text-[#021333]">{item}</p>
                </div>
                <span className="text-sm font-black text-[#1e3fe3]">{value}</span>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4 transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between text-[#1e3fe3]">
        {icon}
      </div>
      <p className="mt-4 text-sm font-bold text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#021333]">{value}</p>
    </Card>
  )
}

function EmployeeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-72" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-32" key={index} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}
