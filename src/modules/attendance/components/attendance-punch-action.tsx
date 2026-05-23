import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { cn } from '../../../shared/lib/utils'
import { useAttendanceStore } from '../store/use-attendance-store'
import { isCheckedIn } from '../utils/time-utils'
import { CheckInMoodDialog } from './check-in-mood-dialog'

export function AttendancePunchAction({ className }: { className?: string }) {
  const [moodOpen, setMoodOpen] = useState(false)
  const { checkIn, checkOut, today } = useAttendanceStore()
  const checkedIn = isCheckedIn(today)

  function handleClick() {
    setMoodOpen(true)
  }

  return (
    <>
      <Button
        className={cn(
          'min-h-9 rounded-full px-4 shadow-none',
          checkedIn
            ? 'border border-rose-500/70 bg-white text-rose-700 hover:bg-rose-50'
            : 'border border-emerald-500/70 bg-white text-[#12734a] hover:bg-emerald-50',
          className,
        )}
        onClick={handleClick}
        variant="outline"
      >
        {checkedIn ? <LogOut className="size-3.5" /> : <LogIn className="size-3.5" />}
        {checkedIn ? 'Check Out' : 'Check In'}
      </Button>
      <CheckInMoodDialog
        actionLabel={checkedIn ? 'Check Out' : 'Check In'}
        onComplete={(mood) => {
          if (checkedIn) {
            checkOut(mood)
            toast.success('Check out successful.')
            return
          }

          checkIn(mood)
          toast.success('Check in successful.')
        }}
        onOpenChange={setMoodOpen}
        open={moodOpen}
      />
    </>
  )
}
