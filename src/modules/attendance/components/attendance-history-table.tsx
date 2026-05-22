import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/components/ui/table'
import type { IAttendanceRecord } from '../types/attendance-types'
import {
  formatMinutes,
  getAttendanceStatus,
  getClockLabel,
  getWorkedMinutes,
} from '../utils/time-utils'

const column = createColumnHelper<IAttendanceRecord>()

export function AttendanceHistoryTable({ records }: { records: IAttendanceRecord[] }) {
  const columns = [
    column.accessor('date', { header: 'Date' }),
    column.display({
      cell: ({ row }) => {
        const status = getAttendanceStatus(row.original)
        return <Badge tone={status === 'Present' ? 'success' : status === 'Absent' ? 'danger' : 'warning'}>{status}</Badge>
      },
      header: 'Status',
      id: 'status',
    }),
    column.display({
      cell: ({ row }) => getClockLabel(row.original.swipeIn),
      header: 'Check in',
      id: 'swipeIn',
    }),
    column.display({
      cell: ({ row }) => getClockLabel(row.original.swipeOut),
      header: 'Check out',
      id: 'swipeOut',
    }),
    column.display({
      cell: ({ row }) => formatMinutes(getWorkedMinutes(row.original, row.original.swipeOut)),
      header: 'Worked',
      id: 'worked',
    }),
    column.accessor('late', {
      cell: (info) => (info.getValue() ? 'Late' : 'Clear'),
      header: 'Late mark',
    }),
  ]
  // TanStack Table exposes callable row APIs for render control.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ columns, data: records, getCoreRowModel: getCoreRowModel() })

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#021333]/10 p-4">
        <h2 className="text-lg font-black text-[#021333]">Attendance history</h2>
        <p className="text-sm text-[#5c6b8e]">Monthly check timings, status, late marks, and working hours.</p>
      </div>
      <Table className="min-w-[620px]">
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
    </Card>
  )
}
