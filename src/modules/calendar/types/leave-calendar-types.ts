export type LeaveStatusType = 'Pending' | 'Approved'

export interface IHoliday {
  date: string
  id: string
  location: string
  name: string
}

export interface ILeaveRequest {
  employee: string
  fromDate: string
  id: string
  leaveType: string
  status: LeaveStatusType
  toDate: string
}
