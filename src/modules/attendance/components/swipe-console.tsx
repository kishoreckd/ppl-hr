import { CalendarDays, Clock3, TimerReset } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { useLiveWorkedMinutes } from '../hooks/use-live-worked-minutes'
import { useAttendanceStore } from '../store/use-attendance-store'
import {
  formatMinutes,
  getAttendanceStatus,
  getClockLabel,
  getLastPunch,
  isCheckedIn,
} from '../utils/time-utils'
import { AttendancePunchAction } from './attendance-punch-action'

export function SwipeConsole() {
  const today = useAttendanceStore((state) => state.today)
  const workedMinutes = useLiveWorkedMinutes(today)
  const status = getAttendanceStatus({ ...today, totalMinutes: workedMinutes })
  const lastPunch = getLastPunch(today)

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#021333]/10 bg-[#fbfbfd] px-4 py-2.5">
        <p className="text-sm font-semibold text-[#5c6b8e]">Track</p>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-[#021333]">
              Friday
              <span className="h-4 w-px bg-[#021333]/15" />
              General Shift
            </p>
            <p className="mt-2 text-xl font-black text-[#021333]">22-05-2026</p>
          </div>
          <Badge tone={status === 'Absent' ? 'danger' : status === 'Half Day' ? 'warning' : 'success'}>
            {status}
          </Badge>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-black text-[#021333]">{formatMinutes(workedMinutes)}</p>
            <p className="mt-1 text-sm font-semibold text-[#5c6b8e]">
              {lastPunch ? `${lastPunch.action} ${getClockLabel(lastPunch.occurredAt)}` : 'No recent punches'}
            </p>
          </div>
          <AttendancePunchAction />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <CompactMetric icon={<TimerReset className="size-3.5" />} label="First in" value={getClockLabel(today.swipeIn)} />
          <CompactMetric icon={<Clock3 className="size-3.5" />} label="State" value={isCheckedIn(today) ? 'In' : 'Out'} />
          <CompactMetric icon={<CalendarDays className="size-3.5" />} label="Mood" value={today.mood ?? 'Not shared'} />
        </div>
      </div>
    </Card>
  )
}

function CompactMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-[#021333]/8 bg-[#f6f8ff] px-2.5 py-2">
      <p className="flex items-center gap-1 text-[11px] font-black uppercase text-[#5c6b8e]">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-[#021333]">{value}</p>
    </div>
  )
}
