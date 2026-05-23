import { LogIn, LogOut } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { useLiveWorkedMinutes } from '../hooks/use-live-worked-minutes'
import { useAttendanceStore } from '../store/use-attendance-store'
import {
  formatMinutes,
  getAttendanceStatus,
  getClockLabel,
  getLastPunch,
  getWorkedMinutes,
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
      </div>
    </Card>
  )
}

export function RecentSwipesPanel() {
  const today = useAttendanceStore((state) => state.today)
  const punches = today.punches ?? []
  const workedMinutes = getWorkedMinutes(today)

  if (!punches.length) {
    return (
      <Card className="p-4">
        <div className="rounded-md border border-dashed border-[#021333]/15 bg-[#fbfbfd] px-3 py-10 text-center text-sm font-semibold text-[#5c6b8e]">
          No swipe activity yet.
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#021333]/10 bg-[#fbfbfd] px-3 py-2">
        <div>
          <p className="text-xs font-black uppercase text-[#5c6b8e]">Recent swipes</p>
          <p className="mt-0.5 text-xs font-semibold text-[#5c6b8e]">Worked hours: {formatMinutes(workedMinutes)}</p>
        </div>
        <p className="text-xs font-semibold text-[#5c6b8e]">{punches.length} entries</p>
      </div>
      <div className="max-h-80 divide-y divide-[#021333]/10 overflow-y-auto">
        {punches.map((punch, index) => (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5" key={`${punch.occurredAt}-${index}`}>
            <span
              className={`grid size-8 place-items-center rounded-full ${
                punch.action === 'Check In' ? 'bg-emerald-50 text-[#12734a]' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {punch.action === 'Check In' ? <LogIn className="size-4" /> : <LogOut className="size-4" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#021333]">{punch.action}</p>
              <p className="truncate text-xs font-semibold text-[#5c6b8e]">
                {punch.mood ? `Mood: ${punch.mood}` : 'System swipe'}
              </p>
            </div>
            <time className="text-sm font-bold text-[#021333]">{getClockLabel(punch.occurredAt)}</time>
          </div>
        ))}
      </div>
    </Card>
  )
}
