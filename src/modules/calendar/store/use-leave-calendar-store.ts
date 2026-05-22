import { create } from 'zustand'
import type { HolidaySchemaType, LeaveRequestSchemaType } from '../validations/leave-calendar-schema'
import type { IHoliday, ILeaveRequest } from '../types/leave-calendar-types'

interface ILeaveCalendarState {
  holidays: IHoliday[]
  leaveRequests: ILeaveRequest[]
  addHoliday: (holiday: HolidaySchemaType) => void
  approveLeave: (id: string) => void
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
      employee: 'Dev Shah',
      fromDate: '2026-05-27',
      id: 'leave-1',
      leaveType: 'Casual leave',
      status: 'Pending',
      toDate: '2026-05-28',
    },
    {
      employee: 'Irina George',
      fromDate: '2026-06-02',
      id: 'leave-2',
      leaveType: 'Sick leave',
      status: 'Pending',
      toDate: '2026-06-02',
    },
    {
      employee: 'You',
      fromDate: '2026-05-16',
      id: 'leave-3',
      leaveType: 'Earned leave',
      status: 'Approved',
      toDate: '2026-05-16',
    },
  ],
  submitLeave: (employee, request) =>
    set((state) => ({
      leaveRequests: [
        {
          ...request,
          employee,
          id: `leave-${Date.now()}`,
          status: 'Pending',
        },
        ...state.leaveRequests,
      ],
    })),
}))
