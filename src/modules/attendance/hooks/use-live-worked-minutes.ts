import { useEffect, useState } from 'react'
import type { IAttendanceRecord } from '../types/attendance-types'
import { getWorkedMinutes } from '../utils/time-utils'

export function useLiveWorkedMinutes(record: IAttendanceRecord) {
  const [now, setNow] = useState(() => new Date().toISOString())

  useEffect(() => {
    if (!record.swipeIn || record.swipeOut) {
      return
    }

    const timer = window.setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => window.clearInterval(timer)
  }, [record.swipeIn, record.swipeOut])

  return getWorkedMinutes(record, record.swipeOut ?? now)
}
