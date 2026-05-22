import { PolicyBoard } from '../../attendance/components/policy-board'
import { SwipeConsole } from '../../attendance/components/swipe-console'
import { Card } from '../../../shared/components/ui/card'
import { Badge } from '../../../shared/components/ui/badge'
import { useAttendanceStore } from '../../attendance/store/use-attendance-store'
import { getAttendanceStatus, getClockLabel } from '../../attendance/utils/time-utils'

export function EmployeeAttendancePage() {
  const today = useAttendanceStore((state) => state.today)
  const status = getAttendanceStatus(today)

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        <SwipeConsole />
        <Card className="p-4 sm:p-5">
          <Badge tone="brand">Check activity</Badge>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['Current status', status],
              ['Today shift', 'General'],
              ['Recent check in', getClockLabel(today.swipeIn)],
            ].map(([label, value]) => (
              <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3" key={label}>
                <p className="text-xs font-black uppercase text-[#5c6b8e]">{label}</p>
                <p className="mt-2 text-lg font-black text-[#021333]">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <PolicyBoard />
    </div>
  )
}
