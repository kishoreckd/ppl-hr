import type { IAttendanceRecord, ITeamAttendanceMember } from '../types/attendance-types'
import { getDateKey } from '../utils/time-utils'

const today = getDateKey()

function stamp(date: string, hours: number, minutes: number) {
  const value = new Date(`${date}T00:00:00`)
  value.setHours(hours, minutes, 0, 0)
  return value.toISOString()
}

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

export async function fetchAttendanceRecords(): Promise<IAttendanceRecord[]> {
  await wait(760)

  return [
    {
      date: '2026-05-21',
      employeeName: 'You',
      late: false,
      swipeIn: stamp('2026-05-21', 8, 58),
      swipeOut: stamp('2026-05-21', 18, 24),
      totalMinutes: 538,
    },
    {
      date: '2026-05-20',
      employeeName: 'You',
      late: true,
      swipeIn: stamp('2026-05-20', 9, 42),
      swipeOut: stamp('2026-05-20', 17, 9),
      totalMinutes: 412,
    },
    {
      date: '2026-05-19',
      employeeName: 'You',
      late: false,
      swipeIn: stamp('2026-05-19', 10, 8),
      swipeOut: stamp('2026-05-19', 13, 44),
      totalMinutes: 216,
    },
    {
      date: '2026-05-18',
      employeeName: 'You',
      late: false,
      totalMinutes: 0,
      type: 'Weekend',
    },
    {
      date: '2026-05-16',
      employeeName: 'You',
      late: false,
      totalMinutes: 0,
      type: 'Leave',
    },
    {
      date: '2026-05-15',
      employeeName: 'You',
      late: false,
      totalMinutes: 0,
      type: 'Holiday',
    },
    {
      date: today,
      employeeName: 'You',
      late: false,
      totalMinutes: 0,
    },
  ]
}

export async function fetchTeamAttendance(): Promise<ITeamAttendanceMember[]> {
  await wait(620)

  return [
    { correction: 'None', employeeName: 'Asha Menon', status: 'Present', swipeIn: '08:54 AM', totalMinutes: 502 },
    { correction: 'Late swipe review', employeeName: 'Dev Shah', status: 'In Progress', swipeIn: '09:41 AM', totalMinutes: 388 },
    { correction: 'Missing swipe out', employeeName: 'Irina George', status: 'Half Day', swipeIn: '09:12 AM', totalMinutes: 271 },
    { correction: 'Absent anomaly', employeeName: 'Nikhil Rao', status: 'Absent', swipeIn: '--', totalMinutes: 0 },
  ]
}
