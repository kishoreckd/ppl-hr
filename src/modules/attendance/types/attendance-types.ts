export type AttendanceStatusType =
  | 'Present'
  | 'Half Day'
  | 'Absent'
  | 'Leave'
  | 'Holiday'
  | 'Weekend'
  | 'In Progress'

export type SwipeActionType = 'Check In' | 'Check Out'
export type AttendanceMoodType = 'Energetic' | 'Focused' | 'Neutral' | 'Stressed' | 'Frustrated'

export interface IAttendancePunch {
  action: SwipeActionType
  mood?: AttendanceMoodType
  occurredAt: string
}

export interface IAttendanceRecord {
  date: string
  employeeName: string
  late: boolean
  mood?: AttendanceMoodType
  punches?: IAttendancePunch[]
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
