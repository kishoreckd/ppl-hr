import { create } from 'zustand'
import type { HolidaySchemaType, LeaveRequestSchemaType } from '../validations/leave-calendar-schema'
import type { IHoliday, ILeaveRequest, LeaveStatusType } from '../types/leave-calendar-types'

function calculateLeaveDays(fromDate: string, toDate: string) {
  const start = new Date(fromDate)
  const end = new Date(toDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1
  }

  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 1
}

interface ILeaveCalendarState {
  holidays: IHoliday[]
  leaveRequests: ILeaveRequest[]
  addHoliday: (holiday: HolidaySchemaType) => void
  addHolidays: (holidays: HolidaySchemaType[]) => void
  approveLeave: (id: string) => void
  updateLeaveStatus: (ids: string[], status: LeaveStatusType) => void
  submitLeave: (employee: string, request: LeaveRequestSchemaType) => void
}

export const useLeaveCalendarStore = create<ILeaveCalendarState>((set) => ({
  addHoliday: (holiday) =>
    set((state) => ({
      holidays: [
        ...state.holidays,
        {
          ...holiday,
          id: `holiday-${Date.now()}`,
        },
      ],
    })),
  addHolidays: (holidays) =>
    set((state) => ({
      holidays: [
        ...state.holidays,
        ...holidays.map((holiday, index) => ({
          ...holiday,
          id: `holiday-${Date.now()}-${index}`,
        })),
      ],
    })),
  approveLeave: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' } : request,
      ),
    })),
  holidays: [
    { date: '2026-05-28', id: 'holiday-1', location: 'Chennai', name: 'Office Holiday' },
    { date: '2026-06-05', id: 'holiday-2', location: 'US Shift', name: 'Regional Holiday' },
  ],
  leaveRequests: [
    {
      createdBy: 'Dev Shah',
      days: 2,
      employee: 'Dev Shah',
      emergencyContact: '+91 98765 43210',
      fromDate: '2026-05-27',
      id: 'leave-1',
      leaveType: 'Casual leave',
      reason: 'Family event',
      status: 'New Request',
      toDate: '2026-05-28',
    },
    {
      createdBy: 'Irina George',
      days: 1,
      employee: 'Irina George',
      emergencyContact: '+91 98765 43210',
      fromDate: '2026-06-02',
      id: 'leave-2',
      leaveType: 'Sick leave',
      reason: 'Medical appointment',
      status: 'On Hold',
      toDate: '2026-06-02',
    },
    {
      createdBy: 'You',
      days: 1,
      employee: 'You',
      emergencyContact: '+91 98765 43210',
      fromDate: '2026-05-16',
      id: 'leave-3',
      leaveType: 'Earned leave',
      reason: 'Personal work',
      status: 'Approved',
      toDate: '2026-05-16',
    },
    {
      createdBy: 'Kishore Kumar DCKAP',
      days: 2,
      employee: 'Kishore Kumar DCKAP',
      emergencyContact: '+91 98765 43210',
      fromDate: '2026-05-21',
      id: 'leave-4',
      leaveType: 'Casual leave',
      reason: 'Travel plan',
      status: 'Rejected',
      toDate: '2026-05-22',
    },
  ],
  submitLeave: (employee, request) =>
    set((state) => ({
      leaveRequests: [
        {
          ...request,
          createdBy: employee,
          days: calculateLeaveDays(request.fromDate, request.toDate),
          employee,
          id: `leave-${Date.now()}`,
          status: 'New Request',
        },
        ...state.leaveRequests,
      ],
    })),
  updateLeaveStatus: (ids, status) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((request) =>
        ids.includes(request.id) ? { ...request, status } : request,
      ),
    })),
}))
