import { useEffect, useState } from 'react'
import type { IAttendanceRecord } from '../types/attendance-types'
import { getWorkedMinutes, isCheckedIn } from '../utils/time-utils'

export function useLiveWorkedMinutes(record: IAttendanceRecord) {
  const [now, setNow] = useState(() => new Date().toISOString())
  const checkedIn = isCheckedIn(record)

  useEffect(() => {
    if (!record.swipeIn || !checkedIn) {
      return
    }

    const timer = window.setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => window.clearInterval(timer)
  }, [checkedIn, record.swipeIn])

  return getWorkedMinutes(record, checkedIn ? now : record.swipeOut ?? now)
}
