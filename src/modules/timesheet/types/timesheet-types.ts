export type TimesheetPeriodType = 'Daily' | 'Weekly' | 'Monthly'

export type TimesheetStatusType = 'Draft' | 'Submitted' | 'Approved' | 'Rejected'

export interface ITimesheetEntry {
  date: string
  employeeName: string
  hours: number
  id: string
  manager: string
  note: string
  period: TimesheetPeriodType
  project: string
  status: TimesheetStatusType
  task: string
  updatedAt: string
}

export interface ITimesheetInput {
  date: string
  employeeName: string
  hours: number
  manager: string
  note: string
  period: TimesheetPeriodType
  project: string
  task: string
}
