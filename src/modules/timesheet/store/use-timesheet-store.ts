import { create } from 'zustand'
import type { ITimesheetEntry, ITimesheetInput, TimesheetStatusType } from '../types/timesheet-types'

interface ITimesheetStore {
  entries: ITimesheetEntry[]
  addEntry: (input: ITimesheetInput) => void
  deleteEntry: (id: string) => void
  reviewEntry: (id: string, status: Extract<TimesheetStatusType, 'Approved' | 'Rejected'>) => void
  updateEntry: (id: string, input: ITimesheetInput) => void
}

const INITIAL_TIMESHEETS: ITimesheetEntry[] = [
  {
    date: '2026-05-22',
    employeeName: 'Kishorekumardckap',
    hours: 8,
    id: 'ts-101',
    manager: 'Mugesh Rajapandiyan',
    note: 'Attendance module QA and leave workflow fixes.',
    period: 'Daily',
    project: 'TeamPilot HRMS',
    status: 'Submitted',
    task: 'Attendance and leave workflow',
    updatedAt: '2026-05-22 06:30 PM',
  },
  {
    date: '2026-05-19',
    employeeName: 'Irina George',
    hours: 36,
    id: 'ts-102',
    manager: 'Mugesh Rajapandiyan',
    note: 'Weekly sprint execution.',
    period: 'Weekly',
    project: 'People operations',
    status: 'Approved',
    task: 'Workflow support',
    updatedAt: '2026-05-23 10:10 AM',
  },
  {
    date: '2026-05-01',
    employeeName: 'Asha Menon',
    hours: 154,
    id: 'ts-103',
    manager: 'Mugesh Rajapandiyan',
    note: 'Monthly HRMS stabilization work.',
    period: 'Monthly',
    project: 'TeamPilot HRMS',
    status: 'Draft',
    task: 'Product operations',
    updatedAt: '2026-05-24 04:20 PM',
  },
]

export const useTimesheetStore = create<ITimesheetStore>((set) => ({
  entries: INITIAL_TIMESHEETS,
  addEntry: (input) =>
    set((state) => ({
      entries: [
        {
          ...input,
          id: `ts-${Date.now()}`,
          status: 'Submitted',
          updatedAt: new Date().toLocaleString([], {
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        },
        ...state.entries,
      ],
    })),
  deleteEntry: (id) => set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
  reviewEntry: (id, status) =>
    set((state) => ({
      entries: state.entries.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
    })),
  updateEntry: (id, input) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              ...input,
              status: 'Submitted',
              updatedAt: new Date().toLocaleString([], {
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          : entry,
      ),
    })),
}))
