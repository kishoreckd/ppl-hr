import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import type { ITeamAttendanceMember } from '../../attendance/types/attendance-types'
import { formatMinutes } from '../../attendance/utils/time-utils'

const column = createColumnHelper<ITeamAttendanceMember>()

export function TeamAttendanceTable({ members }: { members: ITeamAttendanceMember[] }) {
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
    column.accessor('swipeIn', { header: 'Swipe in' }),
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
          onClick={() => toast.success(`Attendance correction approved for ${row.original.employeeName}.`)}
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
  const table = useReactTable({ columns, data: members, getCoreRowModel: getCoreRowModel() })

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#021333]/10 p-4">
        <h2 className="text-lg font-black text-[#021333]">Team attendance monitoring</h2>
        <p className="text-sm text-[#5c6b8e]">Manager visibility includes hours, anomalies, and correction approvals.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="bg-[#f6f8ff] px-3 py-3 text-xs font-black uppercase text-[#5c6b8e]" key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="border-t border-[#021333]/8 transition hover:bg-[#f6f8ff]" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="px-3 py-3" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
