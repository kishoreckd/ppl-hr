import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { canApprove } from '../../../shared/permissions/rbac'
import { getApprovalTone } from '../utils/approval-tone'
import type { IApprovalRequest, UserRoleType } from '../types/organization-types'

interface IApprovalTableProps {
  approvals: IApprovalRequest[]
  role: UserRoleType
}

const column = createColumnHelper<IApprovalRequest>()

export function ApprovalTable({ approvals, role }: IApprovalTableProps) {
  const columns = [
    column.accessor('request', {
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#021333]">{row.original.request}</p>
          <p className="text-xs text-[#5c6b8e]">
            {row.original.id} | {row.original.employee}
          </p>
        </div>
      ),
      header: 'Request',
    }),
    column.accessor('chain', {
      cell: (info) => <span className="text-sm text-[#5c6b8e]">{info.getValue()}</span>,
      header: 'Approval chain',
    }),
    column.accessor('policyImpact', {
      cell: (info) => <span className="text-sm text-[#5c6b8e]">{info.getValue()}</span>,
      header: 'Policy impact',
    }),
    column.accessor('sla', {
      header: 'SLA',
    }),
    column.accessor('status', {
      cell: (info) => <Badge tone={getApprovalTone(info.getValue())}>{info.getValue()}</Badge>,
      header: 'Status',
    }),
    column.display({
      cell: ({ row }) => (
        <Button
          className="min-h-8 px-2.5 text-xs"
          onClick={() => {
            if (!canApprove(role)) {
              toast.error('Insufficient permissions. A manager or HR admin must approve this request.')
              return
            }

            toast.success(`${row.original.request} routed successfully to ${row.original.chain}.`)
          }}
          variant="outline"
        >
          Route
        </Button>
      ),
      header: 'Action',
      id: 'action',
    }),
  ]

  // TanStack Table intentionally returns callable table APIs for row rendering.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: approvals,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="border-b border-[#021333]/10 bg-[#f6f8ff] px-3 py-3 text-xs font-black uppercase text-[#5c6b8e]"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="transition hover:bg-[#f6f8ff]" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="border-b border-[#021333]/8 px-3 py-3 align-top" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
