import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LogIn,
  LogOut,
  UsersRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import heroImage from '../../../assets/hero.png'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { AttendancePunchAction } from '../components/attendance-punch-action'
import { useAttendanceRecords, useTeamAttendance } from '../hooks/use-attendance-data'
import { useLiveWorkedMinutes } from '../hooks/use-live-worked-minutes'
import { useAttendanceStore } from '../store/use-attendance-store'
import type { IAttendanceRecord } from '../types/attendance-types'
import type { ConsolePageType, ConsoleRoleType } from '../types/console-types'
import { formatMinutes, getAttendanceStatus, getClockLabel, getWorkedMinutes } from '../utils/time-utils'

interface IProductDashboardProps {
  name: string
  onPage: (page: ConsolePageType) => void
  role: ConsoleRoleType
}

export function ProductDashboard({ name, onPage, role }: IProductDashboardProps) {
  const recordsQuery = useAttendanceRecords()
  const teamQuery = useTeamAttendance()
  const today = useAttendanceStore((state) => state.today)
  const workedMinutes = useLiveWorkedMinutes(today)
  const isAdmin = role === 'Admin'
  const canViewTeam = role === 'Manager' || isAdmin

  if (recordsQuery.isLoading || (canViewTeam && teamQuery.isLoading)) {
    return <ProductDashboardSkeleton />
  }

  const records = [today, ...(recordsQuery.data ?? []).filter((record) => record.date !== today.date)]
  const team = teamQuery.data ?? []
  const attendanceBuckets = summarizeAttendance(records)
  const recentPunches = [...(today.punches ?? [])].slice(-4).reverse()
  const weeklyMinutes = records.slice(0, 5).reduce((total, record) => total + getWorkedMinutes(record, record.swipeOut), 0)
  const lateMarks = records.filter((record) => record.late).length
  const teamMetrics = {
    absent: team.filter((member) => member.status === 'Absent').length,
    online: team.filter((member) => member.status === 'Present' || member.status === 'In Progress').length,
    pending: team.filter((member) => member.correction !== 'None').length,
  }

  const reviewRows = canViewTeam
    ? [
        { action: () => onPage('regularization'), label: 'Attendance corrections', value: `${teamMetrics.pending} pending` },
        { action: () => onPage('team-attendance'), label: 'Team attendance', value: `${teamMetrics.online} online` },
        {
          action: () => onPage('leave-application'),
          label: 'Leave approvals',
          value: role === 'Admin' ? 'HR override' : 'Manager queue',
        },
      ]
    : [
        { action: () => onPage('regularization'), label: 'Regularization', value: 'Create request' },
        { action: () => onPage('leave-application'), label: 'Leave request', value: 'Apply leave' },
        { action: () => onPage('timesheet'), label: 'Timesheet', value: 'Add work hours' },
      ]

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden border-[#dce3f1] shadow-[0_18px_48px_rgba(7,17,38,0.08)]">
          <div className="relative min-h-[17rem] overflow-hidden">
            <img alt="Dashboard backdrop" className="absolute inset-0 h-full w-full object-cover opacity-45" src={heroImage} />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.9),rgba(241,246,255,0.72))]" />
            <div className="relative z-10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-4xl font-black tracking-[-0.03em] text-[#021333]">Hello {name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#5c6b8e]">Log hours</p>
                </div>
                <AttendancePunchAction />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.05em] text-[#5c6b8e]">Hours today</p>
                  <p className="mt-1 text-3xl font-black text-[#021333]">{formatMinutes(workedMinutes)}</p>
                  <p className="mt-2 text-sm font-semibold text-[#5c6b8e]">Recent swipes</p>
                </div>
                <div className="grid size-40 place-items-center rounded-[2rem] border-[4px] border-[#021333]/35 bg-white/90 text-5xl font-black text-[#021333] shadow-[0_14px_30px_rgba(7,17,38,0.16)]">
                  {getClockLabel(new Date().toISOString())}
                </div>
              </div>

              <div className="mt-4 max-h-[12.5rem] space-y-2 overflow-y-auto pr-1">
                {recentPunches.length ? (
                  recentPunches.map((punch, index) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#dce3f1] bg-white/90 px-3 py-2"
                      key={`${punch.occurredAt}-${index}`}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[#021333]">
                        {punch.action === 'Check In' ? (
                          <LogIn className="size-4 text-emerald-600" />
                        ) : (
                          <LogOut className="size-4 text-rose-600" />
                        )}
                        {punch.action}
                      </span>
                      <span className="text-sm font-semibold text-[#5c6b8e]">
                        {punch.mood ? `Mood: ${punch.mood}` : 'System swipe'} - {getClockLabel(punch.occurredAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#c9d4ee] bg-white/80 px-3 py-3 text-sm font-semibold text-[#5c6b8e]">
                    No swipe activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-[#dce3f1] p-4 shadow-[0_14px_34px_rgba(7,17,38,0.06)]">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Leave balance</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-[#dce3f1] bg-[#f8faff] px-3 py-2">
                <span className="text-sm font-bold text-[#021333]">Casual leave left</span>
                <span className="text-xl font-black text-emerald-700">15</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#dce3f1] bg-[#f8faff] px-3 py-2">
                <span className="text-sm font-bold text-[#021333]">Comp Off left</span>
                <span className="text-xl font-black text-[#1e3fe3]">0</span>
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={() => onPage('leave-application')} variant="outline">
              <CalendarDays className="size-4" />
              Apply leave
            </Button>
          </Card>

          <Card className="border-[#dce3f1] p-4 shadow-[0_14px_34px_rgba(7,17,38,0.06)]">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Things to review</p>
            <div className="mt-3 grid gap-2">
              {reviewRows.map((item) => (
                <button
                  className="flex w-full items-center justify-between rounded-lg border border-[#dce3f1] bg-white px-3 py-2 text-left transition hover:bg-[#f5f8ff]"
                  key={item.label}
                  onClick={item.action}
                  type="button"
                >
                  <span className="text-sm font-black text-[#021333]">{item.label}</span>
                  <span className="text-xs font-semibold text-[#5c6b8e]">{item.value}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-[#dce3f1] p-4 shadow-[0_14px_34px_rgba(7,17,38,0.06)]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Attendance analysis</p>
              <h3 className="text-lg font-black text-[#021333]">Last 3 months</h3>
            </div>
            <Badge tone="neutral">{records.length} records</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <AttendanceDonut buckets={attendanceBuckets} />
            <div className="space-y-2">
              <LegendItem color="#12a36d" label="Present" value={attendanceBuckets.present} />
              <LegendItem color="#e2a022" label="Half Day" value={attendanceBuckets.halfDay} />
              <LegendItem color="#e1525f" label="Absent" value={attendanceBuckets.absent} />
              <LegendItem color="#4f69dd" label="Leave/Holiday" value={attendanceBuckets.leaveHoliday} />
            </div>
          </div>
        </Card>

        <Card className="border-[#dce3f1] p-4 shadow-[0_14px_34px_rgba(7,17,38,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Today snapshot</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SnapshotItem
              icon={<CheckCircle2 className="size-5 text-emerald-600" />}
              label="Status"
              value={getAttendanceStatus({ ...today, totalMinutes: workedMinutes })}
            />
            <SnapshotItem icon={<Clock3 className="size-5 text-[#1e3fe3]" />} label="Weekly hours" value={formatMinutes(weeklyMinutes)} />
            <SnapshotItem icon={<AlertCircle className="size-5 text-amber-600" />} label="Late marks" value={`${lateMarks}`} />
            <SnapshotItem
              icon={<FileCheck2 className="size-5 text-[#1e3fe3]" />}
              label="Open items"
              value={canViewTeam ? `${teamMetrics.pending + teamMetrics.absent}` : '1'}
            />
          </div>
          {canViewTeam && (
            <div className="mt-3 rounded-lg border border-[#dce3f1] bg-[#f8faff] p-3">
              <p className="text-xs font-black uppercase tracking-[0.06em] text-[#5c6b8e]">Team pulse</p>
              <p className="mt-1 text-sm font-semibold text-[#021333]">
                <UsersRound className="mr-1 inline size-4 text-[#1e3fe3]" />
                {teamMetrics.online} online, {teamMetrics.absent} absent, {teamMetrics.pending} pending corrections.
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

function summarizeAttendance(records: IAttendanceRecord[]) {
  return records.reduce(
    (acc, record) => {
      const status = getAttendanceStatus(record)
      if (status === 'Present' || status === 'In Progress') acc.present += 1
      else if (status === 'Half Day') acc.halfDay += 1
      else if (status === 'Absent') acc.absent += 1
      else acc.leaveHoliday += 1
      return acc
    },
    { absent: 0, halfDay: 0, leaveHoliday: 0, present: 0 },
  )
}

function AttendanceDonut({
  buckets,
}: {
  buckets: { absent: number; halfDay: number; leaveHoliday: number; present: number }
}) {
  const total = Math.max(1, buckets.present + buckets.halfDay + buckets.absent + buckets.leaveHoliday)
  const present = Math.round((buckets.present / total) * 100)
  const halfDay = Math.round((buckets.halfDay / total) * 100)
  const absent = Math.round((buckets.absent / total) * 100)
  const leaveHoliday = Math.max(0, 100 - present - halfDay - absent)
  const gradient = `conic-gradient(#12a36d 0% ${present}%, #e2a022 ${present}% ${present + halfDay}%, #e1525f ${present + halfDay}% ${present + halfDay + absent}%, #4f69dd ${present + halfDay + absent}% ${present + halfDay + absent + leaveHoliday}%)`

  return (
    <div className="relative grid size-44 place-items-center rounded-full" style={{ background: gradient }}>
      <div className="grid size-28 place-items-center rounded-full bg-white">
        <p className="text-2xl font-black text-[#021333]">{total}</p>
        <p className="text-[11px] font-bold uppercase text-[#5c6b8e]">Days</p>
      </div>
    </div>
  )
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[#dce3f1] bg-[#f9fbff] px-3 py-2">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#021333]">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="text-sm font-black text-[#021333]">{value}</span>
    </div>
  )
}

function SnapshotItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-[#dce3f1] bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase tracking-[0.06em] text-[#5c6b8e]">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-xl font-black text-[#021333]">{value}</p>
    </div>
  )
}

function ProductDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Skeleton className="h-72" />
        <div className="space-y-4">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}
