import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Radio,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import type { ConsolePageType, ConsoleRoleType } from '../types/console-types'
import type { ITeamAttendanceMember } from '../types/attendance-types'
import { RecentSwipesPanel, SwipeConsole } from '../components/swipe-console'
import { useAttendanceRecords, useTeamAttendance } from '../hooks/use-attendance-data'
import { useAttendanceStore } from '../store/use-attendance-store'
import { formatMinutes, getAttendanceStatus, getWorkedMinutes } from '../utils/time-utils'

interface IProductDashboardProps {
  onPage: (page: ConsolePageType) => void
  role: ConsoleRoleType
}

export function ProductDashboard({ onPage, role }: IProductDashboardProps) {
  const recordsQuery = useAttendanceRecords()
  const teamQuery = useTeamAttendance()
  const today = useAttendanceStore((state) => state.today)
  const isAdmin = role === 'Admin'
  const canViewTeam = role === 'Manager' || isAdmin

  if (recordsQuery.isLoading || (canViewTeam && teamQuery.isLoading)) {
    return <ProductDashboardSkeleton />
  }

  const records = [today, ...(recordsQuery.data ?? []).filter((record) => record.date !== today.date)]
  const team = teamQuery.data ?? []
  const presentDays = records.filter((record) => getAttendanceStatus(record) === 'Present').length
  const weeklyMinutes = records.slice(0, 5).reduce((total, record) => total + getWorkedMinutes(record, record.swipeOut), 0)
  const lateMarks = records.filter((record) => record.late).length
  const online = team.filter((member) => member.status === 'In Progress' || member.status === 'Present')
  const absent = team.filter((member) => member.status === 'Absent')
  const late = team.filter((member) => member.swipeIn > '09:30 AM')
  const pending = team.filter((member) => member.correction !== 'None')
  const coverage = team.length ? Math.round((online.length / team.length) * 100) : presentDays * 10

  const metrics = canViewTeam
    ? [
        { icon: <Radio className="size-5" />, label: 'Online now', value: `${online.length}` },
        { icon: <UsersRound className="size-5" />, label: 'In scope', value: `${team.length}` },
        { icon: <Clock3 className="size-5" />, label: 'Late logins', value: `${late.length}` },
        { icon: <AlertCircle className="size-5" />, label: 'Pending actions', value: `${pending.length}` },
      ]
    : [
        { icon: <CheckCircle2 className="size-5" />, label: 'Present days', value: `${presentDays}` },
        { icon: <Clock3 className="size-5" />, label: 'Weekly hours', value: formatMinutes(weeklyMinutes) },
        { icon: <AlertCircle className="size-5" />, label: 'Late marks', value: `${lateMarks}` },
        { icon: <CalendarDays className="size-5" />, label: 'Leave balance', value: '11 days' },
      ]

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <SwipeConsole />
        <Card className="overflow-hidden">
          <div className="grid gap-4 p-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone={isAdmin ? 'brand' : canViewTeam ? 'warning' : 'success'}>{role}</Badge>
                <span className="text-xs font-black uppercase text-[#5c6b8e]">Today</span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#021333]">{canViewTeam ? 'Team operations' : 'My workday'}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => onPage(canViewTeam ? 'team-attendance' : 'attendance-info')}>
                  <UsersRound className="size-4" />
                  Attendance
                </Button>
                <Button onClick={() => onPage('leave-application')} variant="outline">
                  <FileCheck2 className="size-4" />
                  Requests
                </Button>
              </div>
            </div>
            <div className="grid content-start gap-2">
              <OverviewRow label="Today coverage" value={`${coverage}%`} />
              <OverviewRow label="Exceptions" value={canViewTeam ? `${late.length + absent.length}` : `${lateMarks}`} />
              <OverviewRow label="Regularizations" value={canViewTeam ? `${pending.length} pending` : '1 draft'} />
              {isAdmin && <OverviewRow label="Policy setup" value="6 active rules" />}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard icon={metric.icon} key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#021333]/10 px-4 py-3">
            <div>
              <p className="text-xs font-black uppercase text-[#5c6b8e]">{canViewTeam ? 'Team muster' : 'My attendance'}</p>
              <h2 className="text-lg font-black text-[#021333]">{canViewTeam ? "Today's attendance" : 'Recent swipes'}</h2>
            </div>
            {isAdmin && (
              <Button onClick={() => onPage('team-attendance')} variant="outline">
                <Download className="size-4" />
                Export
              </Button>
            )}
          </div>
          {canViewTeam ? <TeamMusterRows absent={absent.length} pending={pending.length} team={team} /> : <RecentSwipesPanel />}
        </Card>

        <div className="space-y-4">
          <ActionQueue
            canViewTeam={canViewTeam}
            isAdmin={isAdmin}
            late={late.length}
            onPage={onPage}
            pending={pending.length}
          />
          {isAdmin && <PolicyPanel />}
        </div>
      </section>
    </div>
  )
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-[#f6f8ff] px-3 py-2.5">
      <span className="text-sm font-bold text-[#5c6b8e]">{label}</span>
      <span className="text-sm font-black text-[#021333]">{value}</span>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-[#1e3fe3]">{icon}</div>
      <p className="mt-4 text-sm font-bold text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#021333]">{value}</p>
    </Card>
  )
}

function TeamMusterRows({
  absent,
  pending,
  team,
}: {
  absent: number
  pending: number
  team: ITeamAttendanceMember[]
}) {
  return (
    <div className="divide-y divide-[#021333]/10">
      {team.map((member) => (
        <div className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center" key={member.employeeName}>
          <div>
            <p className="font-black text-[#021333]">{member.employeeName}</p>
            <p className="text-xs font-semibold text-[#5c6b8e]">{member.correction === 'None' ? 'No correction request' : member.correction}</p>
          </div>
          <Badge tone={member.status === 'Absent' ? 'danger' : member.status === 'Present' ? 'success' : 'warning'}>{member.status}</Badge>
          <span className="text-sm font-bold text-[#5c6b8e]">{member.swipeIn}</span>
          <span className="text-sm font-black text-[#021333]">{formatMinutes(member.totalMinutes)}</span>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-2 bg-[#fbfbfd] px-4 py-3 text-sm font-bold text-[#5c6b8e]">
        <span>Absent: {absent}</span>
        <span>Corrections: {pending}</span>
      </div>
    </div>
  )
}

function ActionQueue({
  canViewTeam,
  isAdmin,
  late,
  onPage,
  pending,
}: {
  canViewTeam: boolean
  isAdmin: boolean
  late: number
  onPage: (page: ConsolePageType) => void
  pending: number
}) {
  const rows = canViewTeam
    ? [
        { action: () => onPage('regularization'), label: 'Attendance corrections', value: `${pending} pending` },
        { action: () => onPage('team-attendance'), label: 'Late login review', value: `${late} cases` },
        { action: () => onPage('leave-application'), label: 'Leave requests', value: isAdmin ? 'HR override enabled' : 'Manager queue' },
        { action: () => onPage('timesheet'), label: 'Timesheet review', value: 'Daily, weekly, monthly' },
      ]
    : [
        { action: () => onPage('regularization'), label: 'Regularization', value: 'Create request' },
        { action: () => onPage('timesheet'), label: 'Timesheet', value: 'Add work hours' },
        { action: () => onPage('leave-balance'), label: 'Leave balance', value: 'View and apply' },
        { action: () => onPage('attendance-calendar'), label: 'Monthly calendar', value: 'Check status' },
      ]

  return (
    <Card className="p-4">
      <p className="text-xs font-black uppercase text-[#5c6b8e]">Needs attention</p>
      <div className="mt-3 grid gap-2">
        {rows.map((row) => (
          <button
            className="flex w-full items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3 text-left transition hover:border-[#1e3fe3]/30 hover:bg-[#eaf0ff]"
            key={row.label}
            onClick={row.action}
            type="button"
          >
            <span className="font-black text-[#021333]">{row.label}</span>
            <span className="text-sm font-bold text-[#5c6b8e]">{row.value}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}

function PolicyPanel() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-[#1e3fe3]" />
        <p className="text-xs font-black uppercase text-[#5c6b8e]">Policy controls</p>
      </div>
      <div className="mt-3 grid gap-2">
        {['Attendance policy', 'Late login rule', 'Leave approval flow', 'Holiday calendar'].map((item) => (
          <div className="flex items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-white p-3" key={item}>
            <span className="text-sm font-bold text-[#021333]">{item}</span>
            <Badge tone="success">Active</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ProductDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}
