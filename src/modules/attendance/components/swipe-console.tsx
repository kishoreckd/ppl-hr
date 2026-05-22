import { motion } from 'framer-motion'
import { ArrowRightLeft, Clock3, LogIn, LogOut, TimerReset } from 'lucide-react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { useLiveWorkedMinutes } from '../hooks/use-live-worked-minutes'
import { useAttendanceStore } from '../store/use-attendance-store'
import {
  formatMinutes,
  getAttendanceStatus,
  getClockLabel,
  getOvertimeMinutes,
} from '../utils/time-utils'

export function SwipeConsole() {
  const { swipeIn, swipeOut, today } = useAttendanceStore()
  const workedMinutes = useLiveWorkedMinutes(today)
  const status = getAttendanceStatus({ ...today, totalMinutes: workedMinutes })
  const shiftOpen = Boolean(today.swipeIn && !today.swipeOut)
  const shiftClosed = Boolean(today.swipeOut)

  function toggleSwipe() {
    if (!today.swipeIn) {
      swipeIn()
      toast.success('Swipe in successful.')
      return
    }

    if (shiftOpen) {
      swipeOut()
      toast.success('Swipe out successful.')
      return
    }

    toast.info('Today attendance is already closed.')
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={status === 'Absent' ? 'danger' : status === 'Half Day' ? 'warning' : 'success'}>
              {status}
            </Badge>
            <span className="text-sm font-bold text-[#5c6b8e]">General shift</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric icon={<TimerReset className="size-4" />} label="Worked" value={formatMinutes(workedMinutes)} />
            <Metric icon={<LogIn className="size-4" />} label="Swipe in" value={getClockLabel(today.swipeIn)} />
            <Metric icon={<Clock3 className="size-4" />} label="Overtime" value={formatMinutes(getOvertimeMinutes(workedMinutes))} />
          </div>
        </div>
        <div className="flex min-w-48 flex-col justify-center rounded-lg bg-[#021333] p-4 text-white">
          <p className="text-sm font-bold text-blue-100">{shiftOpen ? 'Shift running' : shiftClosed ? 'Shift complete' : 'Ready'}</p>
          <motion.div whileHover={{ scale: shiftClosed ? 1 : 1.02 }} whileTap={{ scale: shiftClosed ? 1 : 0.98 }}>
            <Button
              className="mt-4 w-full"
              disabled={shiftClosed}
              onClick={toggleSwipe}
              variant={shiftOpen ? 'default' : 'success'}
            >
              {shiftOpen ? <LogOut className="size-4" /> : <ArrowRightLeft className="size-4" />}
              {shiftOpen ? 'Swipe out' : shiftClosed ? 'Completed' : 'Swipe in'}
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-blue-100">Out {getClockLabel(today.swipeOut)}</p>
        </div>
      </div>
    </Card>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#5c6b8e]">
        <span className="text-[#1e3fe3]">{icon}</span>
        {label}
      </div>
      <p className="mt-3 text-2xl font-black text-[#021333]">{value}</p>
    </div>
  )
}
