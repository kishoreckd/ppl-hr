export type AttendanceStatusType =
  | 'Present'
  | 'Half Day'
  | 'Absent'
  | 'Leave'
  | 'Holiday'
  | 'Weekend'
  | 'In Progress'

export type SwipeActionType = 'Swipe In' | 'Swipe Out'

export interface IAttendanceRecord {
  date: string
  employeeName: string
  late: boolean
  swipeIn?: string
  swipeOut?: string
  totalMinutes: number
  type?: 'Leave' | 'Holiday' | 'Weekend'
}

export interface ITeamAttendanceMember {
  correction: string
  employeeName: string
  status: AttendanceStatusType
  swipeIn: string
  totalMinutes: number
}
