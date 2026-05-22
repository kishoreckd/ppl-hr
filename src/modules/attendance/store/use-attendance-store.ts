import { create } from 'zustand'
import type { IAttendanceRecord } from '../types/attendance-types'
import { getDateKey, getLateMark, getWorkedMinutes } from '../utils/time-utils'

interface IAttendanceState {
  today: IAttendanceRecord
  swipeIn: () => void
  swipeOut: () => void
}

function newToday(): IAttendanceRecord {
  return {
    date: getDateKey(),
    employeeName: 'You',
    late: false,
    totalMinutes: 0,
  }
}

export const useAttendanceStore = create<IAttendanceState>((set) => ({
  swipeIn: () =>
    set((state) => {
      const swipeIn = new Date().toISOString()
      return {
        today: {
          ...state.today,
          late: getLateMark(swipeIn),
          swipeIn,
        },
      }
    }),
  swipeOut: () =>
    set((state) => {
      const swipeOut = new Date().toISOString()
      const completeRecord = { ...state.today, swipeOut }
      return {
        today: {
          ...completeRecord,
          totalMinutes: getWorkedMinutes(completeRecord, swipeOut),
        },
      }
    }),
  today: newToday(),
}))
