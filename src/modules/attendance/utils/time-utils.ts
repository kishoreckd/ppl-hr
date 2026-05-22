import { ATTENDANCE_POLICY } from '../constants/attendance-policy'
import type {
  AttendanceStatusType,
  IAttendancePunch,
  IAttendanceRecord,
} from '../types/attendance-types'

export function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getClockLabel(iso?: string) {
  if (!iso) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatMinutes(minutes: number) {
  const safeMinutes = Math.max(0, Math.floor(minutes))
  return `${Math.floor(safeMinutes / 60)}h ${String(safeMinutes % 60).padStart(2, '0')}m`
}

function minutesBetween(start?: string, end?: string) {
  if (!start || !end) {
    return 0
  }

  return Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60_000))
}

export function getWorkedMinutes(record: IAttendanceRecord, end = new Date().toISOString()) {
  if (record.type) {
    return record.totalMinutes
  }

  if (record.punches?.length) {
    return getPunchMinutes(record.punches, end)
  }

  const lastSwipe = record.swipeOut ?? end
  return minutesBetween(record.swipeIn, lastSwipe)
}

export function isCheckedIn(record: IAttendanceRecord) {
  if (record.punches?.length) {
    return record.punches.at(-1)?.action === 'Check In'
  }

  return Boolean(record.swipeIn && !record.swipeOut)
}

export function getLastPunch(record: IAttendanceRecord) {
  return record.punches?.at(-1)
}

export function getLateMark(iso?: string) {
  if (!iso) {
    return false
  }

  const swipeDate = new Date(iso)
  const [hour, minute] = ATTENDANCE_POLICY.lateAfter.split(':').map(Number)
  const cutoff = new Date(swipeDate)
  cutoff.setHours(hour, minute, 0, 0)
  return swipeDate.getTime() > cutoff.getTime()
}

export function getAttendanceStatus(record: IAttendanceRecord): AttendanceStatusType {
  if (record.type) {
    return record.type
  }

  if (isCheckedIn(record)) {
    return 'In Progress'
  }

  const minutes = record.swipeOut ? getWorkedMinutes(record, record.swipeOut) : record.totalMinutes

  if (minutes >= ATTENDANCE_POLICY.fullDayMinutes) {
    return 'Present'
  }

  if (minutes >= ATTENDANCE_POLICY.halfDayMinutes) {
    return 'Half Day'
  }

  return 'Absent'
}

export function getOvertimeMinutes(minutes: number) {
  return Math.max(0, minutes - ATTENDANCE_POLICY.overtimeMinutes)
}

function getPunchMinutes(punches: IAttendancePunch[], end: string) {
  let total = 0
  let openCheckIn: string | undefined

  punches.forEach((punch) => {
    if (punch.action === 'Check In') {
      openCheckIn = punch.occurredAt
    }

    if (punch.action === 'Check Out' && openCheckIn) {
      total += minutesBetween(openCheckIn, punch.occurredAt)
      openCheckIn = undefined
    }
  })

  return openCheckIn ? total + minutesBetween(openCheckIn, end) : total
}
