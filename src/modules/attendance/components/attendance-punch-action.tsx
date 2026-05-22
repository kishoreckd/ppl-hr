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
    if (checkedIn) {
      checkOut()
      toast.success('Check out successful.')
      return
    }

    setMoodOpen(true)
  }

  return (
    <>
      <Button
        className={cn(
          'min-h-9 rounded-full border border-emerald-500/70 px-4 shadow-none',
          checkedIn ? 'bg-white text-[#12734a] hover:bg-emerald-50' : 'bg-white text-[#12734a] hover:bg-emerald-50',
          className,
        )}
        onClick={handleClick}
        variant="outline"
      >
        {checkedIn ? <LogOut className="size-3.5" /> : <LogIn className="size-3.5" />}
        {checkedIn ? 'Check Out' : 'Check In'}
      </Button>
      <CheckInMoodDialog
        onCheckIn={(mood) => {
          checkIn(mood)
          toast.success('Check in successful.')
        }}
        onOpenChange={setMoodOpen}
        open={moodOpen}
      />
    </>
  )
}
