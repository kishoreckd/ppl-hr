import type { EventClickArg, EventInput } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import { CalendarDays, LogIn, LogOut, Timer } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog'
import type { IAttendanceRecord } from '../../attendance/types/attendance-types'
import {
  formatMinutes,
  getAttendanceStatus,
  getClockLabel,
  getWorkedMinutes,
} from '../../attendance/utils/time-utils'

interface IAttendanceCalendarProps {
  records: IAttendanceRecord[]
  title: string
}

const STATUS_COLORS = {
  Absent: '#d92d20',
  Holiday: '#475467',
  'Half Day': '#d97706',
  'In Progress': '#1e3fe3',
  Leave: '#155eef',
  Present: '#087443',
  Weekend: '#98a2b3',
} as const

export function AttendanceCalendar({ records, title }: IAttendanceCalendarProps) {
  const [selectedRecord, setSelectedRecord] = useState<IAttendanceRecord | null>(null)
  const events = useMemo<EventInput[]>(
    () =>
      records.map((record) => {
        const status = getAttendanceStatus(record)
        return {
          backgroundColor: STATUS_COLORS[status],
          borderColor: STATUS_COLORS[status],
          date: record.date,
          extendedProps: { record },
          title: `${status} | ${formatMinutes(getWorkedMinutes(record, record.swipeOut))}`,
        }
      }),
    [records],
  )

  function openEvent(arg: EventClickArg) {
    setSelectedRecord(arg.event.extendedProps.record as IAttendanceRecord)
  }

  function openDate(arg: DateClickArg) {
    const record = records.find((item) => item.date === arg.dateStr)
    setSelectedRecord(
      record ?? {
        date: arg.dateStr,
        employeeName: 'You',
        late: false,
        totalMinutes: 0,
      },
    )
  }

  return (
    <>
      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-[#1e3fe3]" />
            <h2 className="text-lg font-black text-[#021333]">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(STATUS_COLORS).slice(0, 6).map((status) => (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5c6b8e]" key={status}>
                <span
                  className="size-2 rounded-full"
                  style={{ background: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
                />
                {status}
              </span>
            ))}
          </div>
        </div>
        <FullCalendar
          dateClick={openDate}
          eventClick={openEvent}
          events={events}
          headerToolbar={{ center: 'title', end: 'next', start: 'prev' }}
          height={470}
          initialDate={records[0]?.date}
          plugins={[dayGridPlugin, interactionPlugin]}
        />
      </Card>
      <Dialog open={Boolean(selectedRecord)} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent>
          {selectedRecord && <AttendanceDetail record={selectedRecord} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

function AttendanceDetail({ record }: { record: IAttendanceRecord }) {
  const status = getAttendanceStatus(record)
  const workedMinutes = getWorkedMinutes(record, record.swipeOut)

  return (
    <>
      <div className="flex items-start justify-between gap-3 pr-9">
        <DialogHeader>
          <p className="text-xs font-black uppercase text-[#5c6b8e]">{record.date}</p>
          <DialogTitle>Attendance detail</DialogTitle>
        </DialogHeader>
        <Badge tone={status === 'Absent' ? 'danger' : status === 'Half Day' ? 'warning' : 'success'}>
          {status}
        </Badge>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Detail icon={<LogIn className="size-4" />} label="Check in" value={getClockLabel(record.swipeIn)} />
        <Detail icon={<LogOut className="size-4" />} label="Check out" value={getClockLabel(record.swipeOut)} />
        <Detail icon={<Timer className="size-4" />} label="Worked hours" value={formatMinutes(workedMinutes)} />
        <Detail icon={<Timer className="size-4" />} label="Late mark" value={record.late ? 'Late' : 'Clear'} />
      </div>
      <DialogClose asChild>
        <Button className="mt-4 w-full" variant="outline">
          Close
        </Button>
      </DialogClose>
    </>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#021333]/10 bg-white p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#5c6b8e]">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-black text-[#021333]">{value}</p>
    </div>
  )
}
