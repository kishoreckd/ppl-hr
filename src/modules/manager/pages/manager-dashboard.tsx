import { AlertCircle, ArrowUpRight, Clock3, Radio, UserMinus, UsersRound } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { useTeamAttendance } from '../../attendance/hooks/use-attendance-data'
import { SwipeConsole } from '../../attendance/components/swipe-console'
import { formatMinutes } from '../../attendance/utils/time-utils'

export function ManagerDashboard() {
  const teamQuery = useTeamAttendance()

  if (teamQuery.isLoading) {
    return <ManagerSkeleton />
  }

  const members = teamQuery.data ?? []
  const online = members.filter((member) => member.status === 'In Progress' || member.status === 'Present')
  const absent = members.filter((member) => member.status === 'Absent')
  const late = members.filter((member) => member.swipeIn > '09:30 AM')
  const pending = members.filter((member) => member.correction !== 'None')

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
