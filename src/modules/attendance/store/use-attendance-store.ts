import { create } from 'zustand'
import type { AttendanceMoodType, IAttendanceRecord } from '../types/attendance-types'
import { getDateKey, getLateMark, getWorkedMinutes } from '../utils/time-utils'

interface IAttendanceState {
  today: IAttendanceRecord
  checkIn: (mood?: AttendanceMoodType) => void
  checkOut: () => void
}

function newToday(): IAttendanceRecord {
  return {
    date: getDateKey(),
    employeeName: 'You',
    late: false,
    punches: [],
    totalMinutes: 0,
  }
}

export const useAttendanceStore = create<IAttendanceState>((set) => ({
  checkIn: (mood) =>
    set((state) => {
      const occurredAt = new Date().toISOString()
      const punches = [...(state.today.punches ?? []), { action: 'Check In' as const, mood, occurredAt }]
      return {
        today: {
          ...state.today,
          late: state.today.swipeIn ? state.today.late : getLateMark(occurredAt),
          mood: mood ?? state.today.mood,
          punches,
          swipeIn: state.today.swipeIn ?? occurredAt,
        },
      }
    }),
  checkOut: () =>
    set((state) => {
      const occurredAt = new Date().toISOString()
      const completeRecord = {
        ...state.today,
        punches: [...(state.today.punches ?? []), { action: 'Check Out' as const, occurredAt }],
        swipeOut: occurredAt,
      }
      return {
        today: {
          ...completeRecord,
          totalMinutes: getWorkedMinutes(completeRecord, occurredAt),
        },
      }
    }),
  today: newToday(),
}))
