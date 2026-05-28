import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/components/ui/table'
import type { ITeamAttendanceMember } from '../../attendance/types/attendance-types'
import { formatMinutes } from '../../attendance/utils/time-utils'

const column = createColumnHelper<ITeamAttendanceMember>()

export function TeamAttendanceTable({ members }: { members: ITeamAttendanceMember[] }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [focusFilter, setFocusFilter] = useState('All')

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const matchesQuery = member.employeeName.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = statusFilter === 'All' || member.status === statusFilter
        const matchesFocus =
          focusFilter === 'All' ||
          (focusFilter === 'Late logins' && isLate(member.swipeIn)) ||
          (focusFilter === 'Pending actions' && member.correction !== 'None') ||
          (focusFilter === 'Exceptions' && (member.status === 'Absent' || member.status === 'Half Day'))

        return matchesQuery && matchesStatus && matchesFocus
      }),
    [focusFilter, members, query, statusFilter],
  )

  const summary = useMemo(() => {
    const online = members.filter((member) => member.status === 'Present' || member.status === 'In Progress').length
    const absent = members.filter((member) => member.status === 'Absent').length
    const late = members.filter((member) => isLate(member.swipeIn)).length
    const pendingActions = members.filter((member) => member.correction !== 'None').length
    return { absent, late, online, pendingActions }
  }, [members])

  function approveCorrection(employeeName: string, correction: string) {
    if (correction === 'None') {
      toast.info(`No pending correction for ${employeeName}.`)
      return
    }

    toast.success(`Attendance correction approved for ${employeeName}.`)
  }

  const columns = [
    column.accessor('employeeName', {
      cell: (info) => <span className="font-black text-[#021333]">{info.getValue()}</span>,
      header: 'Employee',
    }),
    column.accessor('status', {
      cell: (info) => (
        <Badge tone={info.getValue() === 'Present' ? 'success' : info.getValue() === 'Absent' ? 'danger' : 'warning'}>
          {info.getValue()}
        </Badge>
      ),
      header: 'Status',
    }),
    column.accessor('swipeIn', { header: 'Check in' }),
    column.accessor('totalMinutes', {
      cell: (info) => formatMinutes(info.getValue()),
      header: 'Hours',
    }),
    column.accessor('correction', {
      cell: (info) => <span className="text-[#5c6b8e]">{info.getValue()}</span>,
      header: 'Correction',
    }),
    column.display({
      cell: ({ row }) => (
        <Button
          className="min-h-8 px-2 text-xs"
          disabled={row.original.correction === 'None'}
          onClick={() => approveCorrection(row.original.employeeName, row.original.correction)}
          variant="outline"
        >
          Approve
        </Button>
      ),
      header: 'Action',
      id: 'action',
    }),
  ]
  // TanStack Table exposes callable row APIs for render control.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ columns, data: filteredMembers, getCoreRowModel: getCoreRowModel() })

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#021333]/10 p-4">
        <h2 className="text-lg font-black text-[#021333]">Team attendance monitoring</h2>
        <p className="text-sm text-[#5c6b8e]">Track exceptions, late logins, and pending attendance actions.</p>
      </div>

      <div className="grid gap-3 border-b border-[#dce3f1] bg-[#fbfcff] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryPill label="Online" value={summary.online} />
        <SummaryPill label="Absent" value={summary.absent} />
        <SummaryPill label="Late logins" value={summary.late} />
        <SummaryPill label="Pending actions" value={summary.pendingActions} />
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4">
        <label className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#5c6b8e]" />
          <Input
            aria-label="Search team attendance"
            className="h-10 rounded-full pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team member"
            value={query}
          />
        </label>
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="h-10 min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All status</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Half Day">Half Day</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFocusFilter} value={focusFilter}>
          <SelectTrigger className="h-10 min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All focus</SelectItem>
            <SelectItem value="Late logins">Late logins</SelectItem>
            <SelectItem value="Pending actions">Pending actions</SelectItem>
            <SelectItem value="Exceptions">Exceptions</SelectItem>
          </SelectContent>
        </Select>
        {(query || statusFilter !== 'All' || focusFilter !== 'All') && (
          <Button
            className="min-h-10 px-3 text-xs"
            onClick={() => {
              setQuery('')
              setStatusFilter('All')
              setFocusFilter('All')
            }}
            variant="outline"
          >
            Clear all
          </Button>
        )}
      </div>

      <Table className="min-w-[680px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-[#f6f8ff] hover:bg-[#f6f8ff]" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="px-3 py-3" key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredMembers.length === 0 && (
        <div className="border-t border-[#dce3f1] px-4 py-8 text-center text-sm font-semibold text-[#5c6b8e]">
          No team members match the current attendance filters.
        </div>
      )}
    </Card>
  )
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#dce3f1] bg-white px-3 py-2.5">
      <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#021333]">{value}</p>
    </div>
  )
}

function isLate(swipeIn: string) {
  if (!swipeIn || swipeIn === '--') {
    return false
  }

  const [time, meridian] = swipeIn.split(' ')
  if (!time || !meridian) {
    return false
  }

  const [hourRaw, minuteRaw] = time.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return false
  }

  const normalizedHour = meridian.toUpperCase() === 'PM' && hour !== 12 ? hour + 12 : meridian.toUpperCase() === 'AM' && hour === 12 ? 0 : hour
  const totalMinutes = normalizedHour * 60 + minute
  return totalMinutes > 9 * 60 + 30
}
