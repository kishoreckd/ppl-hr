import { AlertCircle, ArrowUpRight, Clock3, Radio, Settings2, ShieldCheck, UserCheck2, UserMinus, UsersRound } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { useTeamAttendance } from '../../attendance/hooks/use-attendance-data'
import { SwipeConsole } from '../../attendance/components/swipe-console'
import { formatMinutes } from '../../attendance/utils/time-utils'

export function ManagerDashboard({ role = 'Manager' }: { role?: 'Manager' | 'Admin' }) {
  const teamQuery = useTeamAttendance()

  if (teamQuery.isLoading) {
    return <ManagerSkeleton />
  }

  const members = teamQuery.data ?? []
  const online = members.filter((member) => member.status === 'In Progress' || member.status === 'Present')
  const absent = members.filter((member) => member.status === 'Absent')
  const late = members.filter((member) => member.swipeIn > '09:30 AM')
  const pending = members.filter((member) => member.correction !== 'None')

  if (role === 'Admin') {
    return <AdminDashboard absent={absent.length} late={late.length} online={online.length} pending={pending.length} total={members.length} />
  }

  return (
    <div className="space-y-4">
      <SwipeConsole />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TeamMetric icon={<Radio className="size-5" />} label="Online" value={`${online.length}`} />
        <TeamMetric icon={<UserMinus className="size-5" />} label="Absent" value={`${absent.length}`} />
        <TeamMetric icon={<Clock3 className="size-5" />} label="Late" value={`${late.length}`} />
        <TeamMetric icon={<AlertCircle className="size-5" />} label="Approvals" value={`${pending.length}`} />
      </section>
      <section className="grid items-start gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-[#021333]/10 p-4">
            <div>
              <p className="text-sm font-bold text-[#5c6b8e]">Team attendance</p>
              <h2 className="text-xl font-black text-[#021333]">Today&apos;s attendance</h2>
            </div>
            <UsersRound className="size-5 text-[#1e3fe3]" />
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2">
            {members.map((member) => (
              <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3" key={member.employeeName}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black text-[#021333]">{member.employeeName}</p>
                  <Badge tone={member.status === 'Absent' ? 'danger' : member.status === 'Present' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm font-bold text-[#5c6b8e]">
                  <span>{member.swipeIn}</span>
                  <span>{formatMinutes(member.totalMinutes)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#5c6b8e]">Queue</p>
              <h2 className="text-xl font-black text-[#021333]">Needs attention</h2>
            </div>
            <ArrowUpRight className="size-5 text-[#1e3fe3]" />
          </div>
          <div className="mt-4 space-y-2">
            {pending.map((member) => (
              <div className="rounded-md border border-[#021333]/10 bg-white p-3 shadow-sm" key={member.employeeName}>
                <p className="font-black text-[#021333]">{member.employeeName}</p>
                <p className="mt-1 text-sm text-[#5c6b8e]">{member.correction}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

function AdminDashboard({
  absent,
  late,
  online,
  pending,
  total,
}: {
  absent: number
  late: number
  online: number
  pending: number
  total: number
}) {
  const configuredPolicies = [
    ['Attendance policy', '8h full day, 4h half day'],
    ['Late login rule', 'After 09:30 AM'],
    ['Leave approval flow', 'Manager plus HR override'],
    ['Holiday calendar', 'Location based'],
  ]
  const coverage = total ? Math.round((online / total) * 100) : 0

  return (
    <div className="space-y-4">
      <SwipeConsole />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TeamMetric icon={<UserCheck2 className="size-5" />} label="Attendance coverage" value={`${coverage}%`} />
        <TeamMetric icon={<Clock3 className="size-5" />} label="Late login cases" value={`${late}`} />
        <TeamMetric icon={<AlertCircle className="size-5" />} label="Pending approvals" value={`${pending}`} />
        <TeamMetric icon={<ShieldCheck className="size-5" />} label="Active policies" value="6" />
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3 border-b border-[#021333]/10 p-4">
            <div>
              <p className="text-sm font-bold text-[#5c6b8e]">Admin operations</p>
              <h2 className="text-xl font-black text-[#021333]">Privacy-safe overview</h2>
            </div>
            <Settings2 className="size-5 text-[#1e3fe3]" />
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {[
              ['Total employees in scope', `${total}`],
              ['Check-in coverage', `${coverage}%`],
              ['Late login exceptions', `${late}`],
              ['Absence exceptions', `${absent}`],
            ].map(([label, value]) => (
              <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3" key={label}>
                <p className="text-xs font-black uppercase text-[#5c6b8e]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#021333]">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#5c6b8e]">Approval queue</p>
                <h2 className="text-xl font-black text-[#021333]">Needs action</h2>
              </div>
              <ArrowUpRight className="size-5 text-[#1e3fe3]" />
            </div>
            <div className="mt-4 grid gap-2">
              {[
                ['Late login review', `${late} case${late === 1 ? '' : 's'} after 09:30 AM`],
                ['Attendance corrections', `${pending} requests pending`],
                ['Absence review', `${absent} exception${absent === 1 ? '' : 's'} need follow-up`],
              ].map(([title, value]) => (
                <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3" key={title}>
                  <p className="font-black text-[#021333]">{title}</p>
                  <p className="mt-1 text-sm font-semibold text-[#5c6b8e]">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-bold text-[#5c6b8e]">Access and setup</p>
            <h2 className="text-xl font-black text-[#021333]">Admin controls</h2>
            <div className="mt-4 grid gap-2">
              {configuredPolicies.map(([item, description]) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-white p-3" key={item}>
                  <span>
                    <span className="block text-sm font-bold text-[#021333]">{item}</span>
                    <span className="block text-xs font-semibold text-[#5c6b8e]">{description}</span>
                  </span>
                  <Badge tone="success">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

function TeamMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4 transition hover:-translate-y-0.5">
      <div className="text-[#1e3fe3]">{icon}</div>
      <p className="mt-4 text-sm font-bold text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-3xl font-black text-[#021333]">{value}</p>
    </Card>
  )
}

function ManagerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-32" key={index} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[30rem]" />
        <Skeleton className="h-[30rem]" />
      </div>
    </div>
  )
}
