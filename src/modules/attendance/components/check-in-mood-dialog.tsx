import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../../shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog'
import type { AttendanceMoodType } from '../types/attendance-types'

const MOODS: Array<{ emoji: string; label: AttendanceMoodType }> = [
  { emoji: '🥳', label: 'Energetic' },
  { emoji: '😊', label: 'Focused' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😓', label: 'Stressed' },
  { emoji: '😤', label: 'Frustrated' },
]

interface ICheckInMoodDialogProps {
  onCheckIn: (mood?: AttendanceMoodType) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CheckInMoodDialog({ onCheckIn, onOpenChange, open }: ICheckInMoodDialogProps) {
  const [mood, setMood] = useState<AttendanceMoodType>('Focused')

  function completeCheckIn(value?: AttendanceMoodType) {
    onCheckIn(value)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm border-white/10 bg-[#262626] p-4 text-white">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-white">How you're feeling today?</DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-5 gap-1">
          {MOODS.map((item) => (
            <button
              className="group flex flex-col items-center gap-1 text-center"
              key={item.label}
              onClick={() => setMood(item.label)}
              type="button"
            >
              <motion.span
                animate={{ scale: mood === item.label ? 1.14 : 1 }}
                className={`grid size-9 place-items-center rounded-full text-2xl transition ${
                  mood === item.label ? 'bg-[#12734a]/25 ring-1 ring-[#35b86b]' : 'bg-white/0'
                }`}
              >
                {item.emoji}
              </motion.span>
              <span className={`text-[10px] ${mood === item.label ? 'text-[#35b86b]' : 'text-zinc-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              className="min-h-9 border-white/15 bg-transparent px-3 text-zinc-300 hover:bg-white/10 hover:text-white"
              onClick={() => completeCheckIn()}
              variant="outline"
            >
              Not Today
            </Button>
          </DialogClose>
          <Button className="min-h-9 bg-[#2ea52c] px-3 hover:bg-[#248b23]" onClick={() => completeCheckIn(mood)}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
