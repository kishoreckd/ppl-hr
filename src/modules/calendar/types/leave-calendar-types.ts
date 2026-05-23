export type LeaveStatusType = 'New Request' | 'Pending' | 'Approved' | 'Rejected' | 'On Hold'

export interface ILeaveBalance {
  approvalPending: number
  balance: number
  consumed: number
  encashedCount: number
  granted: number
  leaveType: string
}

export interface ILeaveTypePolicy {
  balanceLevel: string
  cashable: string
  gender: string
  id: string
  status: 'Active' | 'Inactive'
  type: string
}

export interface IHoliday {
  date: string
  id: string
  location: string
  name: string
}

export interface ILeaveRequest {
  createdBy: string
  days: number
  employee: string
  emergencyContact?: string
  fromDate: string
  fromTime?: string
  id: string
  leaveType: string
  reason?: string
  status: LeaveStatusType
  toDate: string
  toTime?: string
}
