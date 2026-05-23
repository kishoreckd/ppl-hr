import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../../shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog'
import type { AttendanceMoodType } from '../types/attendance-types'

const MOODS: Array<{ emoji: string; label: AttendanceMoodType }> = [
  { emoji: '\u{1F973}', label: 'Energetic' },
  { emoji: '\u{1F60A}', label: 'Focused' },
  { emoji: '\u{1F610}', label: 'Neutral' },
  { emoji: '\u{1F612}', label: 'Stressed' },
  { emoji: '\u{1F624}', label: 'Frustrated' },
]

interface ICheckInMoodDialogProps {
  actionLabel?: 'Check In' | 'Check Out'
  onComplete: (mood?: AttendanceMoodType) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CheckInMoodDialog({
  actionLabel = 'Check In',
  onComplete,
  onOpenChange,
  open,
}: ICheckInMoodDialogProps) {
  const [mood, setMood] = useState<AttendanceMoodType>('Focused')
  const [intro, setIntro] = useState(true)

  function completeCheckIn(value?: AttendanceMoodType) {
    onComplete(value)
    setIntro(true)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg bg-white p-0 text-[#021333]">
        {intro ? (
          <div className="px-8 py-7 text-center">
            <h2 className="text-xl font-black text-[#021333]">
              {actionLabel === 'Check In' ? 'Good Morning!' : 'Wrapping up?'}
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[#5c6b8e]">
              {actionLabel === 'Check In'
                ? 'Welcome back. Start your day strong by checking in and sharing how you feel today.'
                : 'Before you check out, share how you are feeling at the end of this work session.'}
            </p>
            <Button className="mt-6 min-h-9 min-w-32 rounded-full" onClick={() => setIntro(false)}>
              {actionLabel}
            </Button>
          </div>
        ) : (
          <MoodPicker
            mood={mood}
            onMood={setMood}
            onSkip={() => completeCheckIn()}
            onSubmit={() => completeCheckIn(mood)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function MoodPicker({
  mood,
  onMood,
  onSkip,
  onSubmit,
}: {
  mood: AttendanceMoodType
  onMood: (mood: AttendanceMoodType) => void
  onSkip: () => void
  onSubmit: () => void
}) {
  return (
    <div className="p-5">
      <DialogHeader>
        <DialogTitle className="text-center text-base font-black text-[#021333]">
          How are you feeling today?
        </DialogTitle>
      </DialogHeader>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {MOODS.map((item) => (
          <button
            className="group flex flex-col items-center gap-1 text-center"
            key={item.label}
            onClick={() => onMood(item.label)}
            type="button"
          >
            <motion.span
              animate={{ scale: mood === item.label ? 1.14 : 1 }}
              className={`grid size-12 place-items-center rounded-full text-3xl transition ${
                mood === item.label ? 'bg-[#eaf0ff] ring-2 ring-[#1e3fe3]/30' : 'bg-white'
              }`}
              whileHover={{ scale: mood === item.label ? 1.22 : 1.12 }}
            >
              {item.emoji}
            </motion.span>
            <span className={`text-[10px] font-semibold ${mood === item.label ? 'text-[#1e3fe3]' : 'text-[#5c6b8e]'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <button className="text-xs font-semibold text-[#5c6b8e] underline" onClick={onSkip} type="button">
          Skip
        </button>
        <Button className="min-h-9 rounded-full px-5" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}
