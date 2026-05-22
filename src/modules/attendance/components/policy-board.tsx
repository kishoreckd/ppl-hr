import { AlertTriangle, BadgeCheck, Clock3 } from 'lucide-react'
import { Card } from '../../../shared/components/ui/card'
import { ATTENDANCE_POLICY } from '../constants/attendance-policy'

export function PolicyBoard() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <BadgeCheck className="size-5 text-[#1e3fe3]" />
        <h2 className="text-lg font-black text-[#021333]">Attendance policy</h2>
      </div>
      <div className="mt-4 space-y-2">
        <Rule label="Full day present" value={`${ATTENDANCE_POLICY.fullDayMinutes / 60}+ working hours`} />
        <Rule label="Half day present" value={`${ATTENDANCE_POLICY.halfDayMinutes / 60}+ working hours`} />
        <Rule label="Overtime" value={`Above ${ATTENDANCE_POLICY.overtimeMinutes / 60} hours`} />
        <Rule label="Late mark" value={`After ${ATTENDANCE_POLICY.lateAfter}`} />
      </div>
      <div className="mt-4 flex gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        Attendance corrections require manager approval before payroll dependency sync.
      </div>
    </Card>
  )
}

function Rule({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3 text-sm">
      <span className="inline-flex items-center gap-2 font-bold text-[#021333]">
        <Clock3 className="size-4 text-[#1e3fe3]" />
        {label}
      </span>
      <span className="text-right font-semibold text-[#5c6b8e]">{value}</span>
    </div>
  )
}
