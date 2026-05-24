import { CalendarDays } from 'lucide-react'
import { Button } from './button'

interface IRequestCalendarPanelProps {
  helper?: string
  markers?: Array<{ date: string; label: string; tone: 'brand' | 'danger' | 'success' | 'warning' }>
  onSelectDate: (date: string) => void
  selectedDates?: string[]
  title: string
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TODAY = new Date()

export function RequestCalendarPanel({
  helper,
  markers = [],
  onSelectDate,
  selectedDates = [],
  title,
}: IRequestCalendarPanelProps) {
  const year = TODAY.getFullYear()
  const month = TODAY.getMonth()
  const monthLabel = TODAY.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const cells = [
    ...Array.from({ length: firstDay }, (_, index) => ({ day: 0, key: `empty-${index}` })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({ day: index + 1, key: `day-${index + 1}` })),
  ]

  return (
    <div className="rounded-lg border border-[#021333]/10 bg-[#f6f8ff] p-3">
      <div className="flex items-start gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-[#1e3fe3] shadow-sm">
          <CalendarDays className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-black text-[#021333]">{title}</h3>
          {helper && <p className="mt-1 text-[11px] font-semibold text-[#5c6b8e]">{helper}</p>}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-[#021333]/10 bg-white p-2">
        <div className="mb-2 text-center text-sm font-black text-[#021333]">{monthLabel}</div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-black text-[#5c6b8e]">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            if (!cell.day) {
              return <span className="h-7" key={cell.key} />
            }

            const date = toIsoDate(year, month, cell.day)
            const selected = selectedDates.includes(date)
            const marker = markers.find((item) => item.date === date)

            return (
              <button
                className={`relative grid h-7 place-items-center rounded-md text-xs font-bold transition ${
                  selected
                    ? 'bg-[#1e3fe3] text-white shadow-md shadow-[#1e3fe3]/20'
                    : 'text-[#021333] hover:bg-[#eaf0ff] hover:text-[#1e3fe3]'
                }`}
                key={cell.key}
                onClick={() => onSelectDate(date)}
                type="button"
              >
                {cell.day}
                {marker && (
                  <span
                    className={`absolute bottom-1 size-1.5 rounded-full ${
                      marker.tone === 'success'
                        ? 'bg-emerald-500'
                        : marker.tone === 'warning'
                          ? 'bg-amber-500'
                          : marker.tone === 'danger'
                            ? 'bg-rose-500'
                            : 'bg-[#1e3fe3]'
                    }`}
                    title={marker.label}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {markers.slice(0, 4).map((marker) => (
          <div className="flex items-center justify-between rounded-md border border-[#021333]/10 bg-white px-2.5 py-1.5" key={`${marker.date}-${marker.label}`}>
            <span className="text-xs font-black text-[#021333]">{marker.label}</span>
            <span className="text-xs font-semibold text-[#5c6b8e]">{formatShortDate(marker.date)}</span>
          </div>
        ))}
      </div>

      <Button className="mt-3 min-h-9 w-full" onClick={() => onSelectDate(toIsoDate(year, month, TODAY.getDate()))} type="button" variant="outline">
        Select today
      </Button>
    </div>
  )
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}
