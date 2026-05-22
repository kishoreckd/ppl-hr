import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CalendarDays, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { Input } from '../../../shared/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/components/ui/table'
import { REGULARIZATION_REQUESTS } from '../constants/regularization-data'
import type {
  IRegularizationRequest,
  RegularizationStatusType,
} from '../types/regularization-types'

const column = createColumnHelper<IRegularizationRequest>()
const STATUS_FILTERS: Array<RegularizationStatusType | 'All'> = [
  'All',
  'New Request',
  'On Hold',
  'Approved',
  'Rejected',
]

export function RegularizationPage({ managerView }: { managerView: boolean }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<RegularizationStatusType | 'All'>('All')
  const rows = useMemo(
    () =>
      REGULARIZATION_REQUESTS.filter(
        (request) =>
          (status === 'All' || request.status === status) &&
          request.employeeName.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status],
  )
  const columns = [
    column.display({
      cell: () => <Checkbox aria-label="Select request" />,
      header: () => <Checkbox aria-label="Select all requests" />,
      id: 'select',
    }),
    column.accessor('employeeName', {
      cell: (info) => <span className="font-bold underline decoration-[#5c6b8e]/50">{info.getValue()}</span>,
      header: managerView ? 'Employee name' : 'Request',
    }),
    column.accessor('days', { header: 'Days' }),
    column.accessor('dates', {
      cell: (info) => (
        <span className="inline-flex items-center gap-2 text-[#5c6b8e]">
          {info.getValue()}
          <CalendarDays className="size-3.5" />
        </span>
      ),
      header: 'Dates',
    }),
    column.accessor('time', { header: 'Time' }),
    column.accessor('status', {
      cell: (info) => <StatusBadge status={info.getValue()} />,
      header: 'Status',
    }),
  ]
  // TanStack Table returns callable render APIs used by this table.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ columns, data: rows, getCoreRowModel: getCoreRowModel() })

  return (
    <Card className="overflow-hidden p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-[#1e3fe3] text-white">
            <SlidersHorizontal className="size-4" />
          </span>
          <label className="relative min-w-56 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#5c6b8e]" />
            <Input
              aria-label="Search regularizations"
              className="h-10 rounded-full pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              value={query}
            />
          </label>
        </div>
        <Button onClick={() => toast.success('Regularization request created successfully.')}>
          New request
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            className={`inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-bold transition ${
              filter === status
                ? 'border-[#1e3fe3]/25 bg-[#eaf0ff] text-[#1e3fe3]'
                : 'border-[#021333]/10 bg-white text-[#5c6b8e]'
            }`}
            key={filter}
            onClick={() => setStatus(filter)}
            type="button"
          >
            {filter === 'All' && <Filter className="size-3" />}
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-[#021333]/10">
        <Table className="min-w-[720px] border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="border-b border-r border-[#021333]/10 bg-white px-3 py-3 text-xs font-black uppercase text-[#5c6b8e] last:border-r-0"
                    key={header.id}
                  >
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
                  <TableCell className="border-r border-[#021333]/10 py-2.5 last:border-r-0" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-1 text-sm font-bold text-[#5c6b8e]">
        {['<', '1', '2', '3', '4', '>'].map((page) => (
          <span className={`grid size-7 place-items-center rounded-full ${page === '2' ? 'bg-[#eaf0ff] text-[#1e3fe3]' : ''}`} key={page}>
            {page}
          </span>
        ))}
      </div>
    </Card>
  )
}

function StatusBadge({ status }: { status: RegularizationStatusType }) {
  if (status === 'Approved') {
    return <Badge tone="success">{status}</Badge>
  }

  if (status === 'Rejected') {
    return <Badge tone="danger">{status}</Badge>
  }

  return <Badge tone={status === 'On Hold' ? 'warning' : 'brand'}>{status}</Badge>
}
