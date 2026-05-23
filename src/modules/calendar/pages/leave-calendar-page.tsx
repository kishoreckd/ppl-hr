import { zodResolver } from '@hookform/resolvers/zod'
import {
  Ban,
  CalendarDays,
  CalendarPlus2,
  CheckCircle2,
  Edit3,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Controller, useForm, useWatch, type Control, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { RequestCalendarPanel } from '../../../shared/components/ui/request-calendar-panel'
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
import { cn } from '../../../shared/lib/utils'
import type { AuthRoleType } from '../../auth/types/auth-types'
import { useLeaveCalendarStore } from '../store/use-leave-calendar-store'
import type { ILeaveBalance, ILeaveRequest, ILeaveTypePolicy, LeaveStatusType } from '../types/leave-calendar-types'
import {
  leaveRequestSchema,
  type LeaveRequestSchemaType,
} from '../validations/leave-calendar-schema'

interface ILeaveCalendarPageProps {
  name: string
  page?: 'balance' | 'application' | 'admin' | 'calendar'
  role: AuthRoleType
}

const LEAVE_BALANCES: ILeaveBalance[] = [
  { approvalPending: 0, balance: 10, consumed: 0.5, encashedCount: 0, granted: 10.5, leaveType: 'Casual Leave' },
  { approvalPending: 0, balance: 0, consumed: 0, encashedCount: 0, granted: 0, leaveType: 'Compensatory Off' },
  { approvalPending: 0, balance: 0, consumed: 0, encashedCount: 0, granted: -1, leaveType: 'Loss Of Pay' },
  { approvalPending: 0, balance: 0, consumed: 0, encashedCount: 0, granted: 0, leaveType: 'Maternity Leave' },
  { approvalPending: 0, balance: 10, consumed: 0, encashedCount: 0, granted: 10, leaveType: 'Paternity Leave' },
  { approvalPending: -2, balance: 0, consumed: 2, encashedCount: 0, granted: 2, leaveType: 'Restricted Leave' },
  { approvalPending: 0.5, balance: 0, consumed: 1, encashedCount: 0, granted: 1, leaveType: 'Personal Day(Birthday Or Anniversary)' },
]

const LEAVE_POLICIES: ILeaveTypePolicy[] = [
  { balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-1', status: 'Active', type: 'Restricted Holiday' },
  { balanceLevel: 'Limited', cashable: 'No', gender: 'Married Male', id: 'leave-policy-2', status: 'Inactive', type: 'Paternity Leave' },
  { balanceLevel: 'Limited', cashable: 'Yes', gender: 'Married Female', id: 'leave-policy-3', status: 'Active', type: 'Maternity Leave' },
  { balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-4', status: 'Inactive', type: 'Loss Of Pay' },
  { balanceLevel: 'Limited', cashable: 'Yes', gender: 'All', id: 'leave-policy-5', status: 'Active', type: 'Compensatory Off' },
  { balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-6', status: 'Inactive', type: 'Casual Leave' },
]

export function LeaveCalendarPage({ name, page = 'calendar', role }: ILeaveCalendarPageProps) {
  const manager = role === 'Manager' || role === 'Admin'

  if (page === 'balance') {
    return <LeaveBalancePage name={name} />
  }

  if (page === 'application') {
    return <LeaveApplicationPage managerView={manager} name={name} />
  }

  if (page === 'admin') {
    return <LeaveAdminPage />
  }

  return <HolidayCalendarPage />
}

function LeaveBalancePage({ name }: { name: string }) {
  const submitLeave = useLeaveCalendarStore((state) => state.submitLeave)
  const [applyOpen, setApplyOpen] = useState(false)

  function createLeave(values: LeaveRequestSchemaType) {
    submitLeave(name, values)
    setApplyOpen(false)
    toast.success('Leave request submitted successfully.')
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LeaveToolbar filters={['Employee', 'Year']} />
          <Button onClick={() => setApplyOpen(true)}>
            <CalendarPlus2 className="size-4" />
            Apply for Leave
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[#021333]/10">
          <Table className="min-w-[760px] border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {['Leave Type', 'Granted', 'Consumed', 'Approval Pending', 'Balance', 'Encashed Count'].map((heading) => (
                  <TableHead className="border-b border-r border-[#021333]/10 bg-white last:border-r-0" key={heading}>
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEAVE_BALANCES.map((leave) => (
                <TableRow key={leave.leaveType}>
                  <TableCell className="border-r border-[#021333]/10 font-semibold text-[#5c6b8e]">{leave.leaveType}</TableCell>
                  <TableCell className="border-r border-[#021333]/10">{leave.granted}</TableCell>
                  <TableCell className="border-r border-[#021333]/10">{leave.consumed}</TableCell>
                  <TableCell className="border-r border-[#021333]/10">{leave.approvalPending}</TableCell>
                  <TableCell className="border-r border-[#021333]/10">{leave.balance}</TableCell>
                  <TableCell>{leave.encashedCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <ApplyLeaveDialog onCreate={createLeave} onOpenChange={setApplyOpen} open={applyOpen} />
    </>
  )
}

function ApplyLeaveDialog({
  onCreate,
  onOpenChange,
  open,
}: {
  onCreate: (values: LeaveRequestSchemaType) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const form = useForm<LeaveRequestSchemaType>({
    defaultValues: {
      emergencyContact: '',
      fromDate: '',
      fromTime: '',
      leaveType: 'Casual leave',
      reason: '',
      toDate: '',
      toTime: '',
    },
    mode: 'onChange',
    resolver: zodResolver(leaveRequestSchema),
  })
  const fromDate = useWatch({ control: form.control, name: 'fromDate' })
  const toDate = useWatch({ control: form.control, name: 'toDate' })

  function submit(values: LeaveRequestSchemaType) {
    onCreate(values)
    form.reset({
      emergencyContact: '',
      fromDate: '',
      fromTime: '',
      leaveType: values.leaveType,
      reason: '',
      toDate: '',
      toTime: '',
    })
  }

  function selectDate(date: string) {
    if (!fromDate || (fromDate && toDate)) {
      form.setValue('fromDate', date, { shouldDirty: true, shouldValidate: true })
      form.setValue('toDate', '', { shouldDirty: true, shouldValidate: true })
      return
    }

    if (date < fromDate) {
      form.setValue('fromDate', date, { shouldDirty: true, shouldValidate: true })
      return
    }

    form.setValue('toDate', date, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="border-b border-[#021333]/10 bg-[#f6f8ff] px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CalendarPlus2 className="size-6 text-[#1e3fe3]" />
            Apply leave
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <RequestCalendarPanel
            helper="Select the start date first, then choose the return date."
            markers={[
              { date: '2026-05-28', label: 'Chennai office holiday', tone: 'brand' },
              { date: '2026-05-30', label: 'Weekend', tone: 'warning' },
              { date: '2026-06-05', label: 'Regional holiday', tone: 'brand' },
            ]}
            onSelectDate={selectDate}
            selectedDates={[fromDate, toDate].filter(Boolean)}
            title="My calendar"
          />
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <LeaveTypeField formControl={form.control} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field error={form.formState.errors.fromDate?.message} label="From" register={form.register('fromDate')} type="date" />
              <Field error={form.formState.errors.toDate?.message} label="To" register={form.register('toDate')} type="date" />
              <Field error={form.formState.errors.fromTime?.message} label="From time" register={form.register('fromTime')} type="time" />
              <Field error={form.formState.errors.toTime?.message} label="To time" register={form.register('toTime')} type="time" />
            </div>
            <Field error={form.formState.errors.emergencyContact?.message} label="Emergency contact" register={form.register('emergencyContact')} />
            <Label>
              Reason
              <textarea
                aria-invalid={Boolean(form.formState.errors.reason)}
                className="mt-1 min-h-32 w-full rounded-md border border-[#021333]/15 bg-white px-3 py-2 text-sm text-[#021333] outline-none transition focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15"
                {...form.register('reason')}
              />
              {form.formState.errors.reason?.message && <span className="mt-1 block text-xs font-semibold text-rose-600">{form.formState.errors.reason.message}</span>}
            </Label>
            <Button type="submit">
              Submit request
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LeaveApplicationPage({ managerView, name }: { managerView: boolean; name: string }) {
  const { leaveRequests, submitLeave, updateLeaveStatus } = useLeaveCalendarStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [status, setStatus] = useState<LeaveStatusType | 'All'>('All')
  const visibleRequests = leaveRequests.filter((request) => {
    const visibleByRole = managerView || request.employee === 'You' || request.employee === name
    return visibleByRole && (status === 'All' || request.status === status)
  })
  const allSelected = visibleRequests.length > 0 && visibleRequests.every((request) => selectedIds.includes(request.id))

  function toggleRow(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function applyStatus(nextStatus: LeaveStatusType) {
    if (!selectedIds.length) {
      toast.error('Select at least one leave request.')
      return
    }

    updateLeaveStatus(selectedIds, nextStatus)
    setSelectedIds([])
    toast.success(`Leave request marked as ${nextStatus}.`)
  }

  function createLeave(values: LeaveRequestSchemaType) {
    submitLeave(name, values)
    toast.success('Leave request submitted successfully.')
  }

  if (!managerView) {
    return <MyLeaveRequestsPage leaveRequests={visibleRequests} onCreate={createLeave} />
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LeaveToolbar filters={['Status', 'Leave Type', 'Created By', 'Reporting Manager']} onStatus={setStatus} />
        <div className="flex items-center gap-1 rounded-full border border-[#021333]/10 bg-white px-1.5 py-1">
          <ActionIcon disabled={!selectedIds.length} icon={<CheckCircle2 className="size-4" />} label="Approve" onClick={() => applyStatus('Approved')} tone="success" />
          <ActionIcon disabled={!selectedIds.length} icon={<Ban className="size-4" />} label="Reject" onClick={() => applyStatus('Rejected')} />
          <ActionIcon disabled={!selectedIds.length} icon={<CalendarDays className="size-4" />} label="On hold" onClick={() => applyStatus('On Hold')} />
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-[#021333]/10">
        <Table className="min-w-[880px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="border-b border-r border-[#021333]/10 bg-white">
                <Checkbox checked={allSelected} onCheckedChange={() => setSelectedIds(allSelected ? [] : visibleRequests.map((request) => request.id))} />
              </TableHead>
              {['Employee', 'Leave Type', 'Dates', 'Days', 'Status', 'Action'].map((heading) => (
                <TableHead className="border-b border-r border-[#021333]/10 bg-white last:border-r-0" key={heading}>
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRequests.map((request) => (
              <TableRow className={selectedIds.includes(request.id) ? 'bg-[#eaf0ff]/75' : undefined} key={request.id}>
                <TableCell className="border-r border-[#021333]/10">
                  <Checkbox checked={selectedIds.includes(request.id)} onCheckedChange={() => toggleRow(request.id)} />
                </TableCell>
                <TableCell className="border-r border-[#021333]/10 font-semibold text-[#1e3fe3] underline decoration-[#1e3fe3]/30">
                  {request.employee}
                </TableCell>
                <TableCell className="border-r border-[#021333]/10">{request.leaveType}</TableCell>
                <TableCell className="border-r border-[#021333]/10 text-[#5c6b8e]">
                  {request.fromDate} - {request.toDate}
                </TableCell>
                <TableCell className="border-r border-[#021333]/10">{String(request.days).padStart(2, '0')}</TableCell>
                <TableCell className="border-r border-[#021333]/10"><LeaveStatusBadge status={request.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[#5c6b8e]">
                    <Edit3 className="size-4" />
                    <Trash2 className="size-4 text-rose-500" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination />
    </Card>
  )
}

function MyLeaveRequestsPage({
  leaveRequests,
  onCreate,
}: {
  leaveRequests: ILeaveRequest[]
  onCreate: (values: LeaveRequestSchemaType) => void
}) {
  const holidays = useLeaveCalendarStore((state) => state.holidays)
  const form = useForm<LeaveRequestSchemaType>({
    defaultValues: {
      emergencyContact: '',
      fromDate: '',
      fromTime: '',
      leaveType: 'Casual leave',
      reason: '',
      toDate: '',
      toTime: '',
    },
    mode: 'onChange',
    resolver: zodResolver(leaveRequestSchema),
  })

  const fromDate = useWatch({ control: form.control, name: 'fromDate' })
  const toDate = useWatch({ control: form.control, name: 'toDate' })

  function selectDate(date: string) {
    if (!fromDate || (fromDate && toDate)) {
      form.setValue('fromDate', date, { shouldDirty: true, shouldValidate: true })
      form.setValue('toDate', '', { shouldDirty: true, shouldValidate: true })
      return
    }

    if (date < fromDate) {
      form.setValue('fromDate', date, { shouldDirty: true, shouldValidate: true })
      return
    }

    form.setValue('toDate', date, { shouldDirty: true, shouldValidate: true })
  }

  function resetForm() {
    form.reset({
      emergencyContact: '',
      fromDate: '',
      fromTime: '',
      leaveType: 'Casual leave',
      reason: '',
      toDate: '',
      toTime: '',
    })
  }

  function submit(values: LeaveRequestSchemaType) {
    onCreate(values)
    resetForm()
  }

  const markers = holidays.map((holiday) => ({
    date: holiday.date,
    label: holiday.name,
    tone: 'brand' as const,
  }))

  return (
    <>
      <Card className="overflow-hidden">
        <div className="border-b border-[#021333]/10 bg-[#f6f8ff] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[#021333]">Create leave request</p>
              <p className="mt-2 text-sm text-[#5c6b8e]">Pick the leave date range before submitting.</p>
            </div>
            <Button variant="outline" onClick={resetForm} type="button">
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <RequestCalendarPanel
            helper="Select the start date first, then choose the return date."
            markers={markers}
            onSelectDate={selectDate}
            selectedDates={[fromDate, toDate].filter(Boolean)}
            title="My attendance calendar"
          />

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#021333]/10 bg-white p-4 shadow-sm">
              <p className="text-sm font-bold uppercase text-[#5c6b8e]">Request type</p>
              <p className="mt-3 text-xl font-black text-[#021333]">{form.watch('leaveType') || 'Select leave type'}</p>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
              <LeaveTypeField formControl={form.control} />

              <div className="grid gap-3 sm:grid-cols-2">
                <Field error={form.formState.errors.fromDate?.message} label="From" register={form.register('fromDate')} type="date" />
                <Field error={form.formState.errors.toDate?.message} label="To" register={form.register('toDate')} type="date" />
                <Field error={form.formState.errors.fromTime?.message} label="From time" register={form.register('fromTime')} type="time" />
                <Field error={form.formState.errors.toTime?.message} label="To time" register={form.register('toTime')} type="time" />
              </div>

              <Field error={form.formState.errors.emergencyContact?.message} label="Emergency contact" register={form.register('emergencyContact')} />

              <Label>
                Reason
                <textarea
                  aria-invalid={Boolean(form.formState.errors.reason)}
                  className="mt-1 min-h-32 w-full rounded-md border border-[#021333]/15 bg-white px-3 py-2 text-sm text-[#021333] outline-none transition focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15"
                  {...form.register('reason')}
                />
                {form.formState.errors.reason?.message && <span className="mt-1 block text-xs font-semibold text-rose-600">{form.formState.errors.reason?.message}</span>}
              </Label>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="outline" onClick={resetForm} type="button">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </>
  )
}

function LeaveAdminPage() {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LeaveToolbar filters={['Status', 'Cashable', 'Leave For']} />
        <Button>
          <CalendarPlus2 className="size-4" />
          Add Leave
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-[#021333]/10">
        <Table className="min-w-[760px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {['Type', 'Cashable', 'Leave For', 'Balance Level', 'Status', 'Action'].map((heading) => (
                <TableHead className="border-b border-r border-[#021333]/10 bg-white last:border-r-0" key={heading}>
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEAVE_POLICIES.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="border-r border-[#021333]/10 font-semibold text-[#1e3fe3] underline decoration-[#1e3fe3]/30">{policy.type}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.cashable}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.gender}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.balanceLevel}</TableCell>
                <TableCell className="border-r border-[#021333]/10"><Badge tone={policy.status === 'Active' ? 'success' : 'danger'}>{policy.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[#5c6b8e]">
                    <Edit3 className="size-4" />
                    <Trash2 className="size-4 text-rose-500" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

const YEARLY_HOLIDAYS = [
  { date: '2024-01-01', name: "New Year's Day", shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-01-12', name: 'Monthly Second Friday', shift: 'India Day Shift, India US Shift, US Shift', type: 'Fixed Holiday' },
  { date: '2024-01-15', name: 'Pongal', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-01-16', name: 'Mattu Pongal', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-01-26', name: 'Republic Day', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-02-09', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-03-08', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-03-25', name: 'Holi', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-03-29', name: 'Good Friday', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-04-09', name: 'Ugadi', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-04-11', name: 'Ramzan', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-04-12', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-05-01', name: 'Labour Day', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-05-10', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-06-14', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-06-17', name: 'Bakrid', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-07-12', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-08-09', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-08-15', name: 'Independence Day', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-08-19', name: 'Raksha Bandhan', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-08-26', name: 'Krishna Jayanthi', shift: 'Restricted Holiday', type: 'Restricted Holiday' },
  { date: '2024-09-13', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-10-02', name: 'Gandhi Jayanthi', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-10-10', name: 'Durga Pooja', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-10-11', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-10-31', name: 'Diwali', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-11-08', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-12-13', name: 'Monthly Second Friday', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
  { date: '2024-12-25', name: 'Christmas', shift: 'Fixed Holiday', type: 'Fixed Holiday' },
]

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function HolidayCalendarPage() {
  const holidays = useLeaveCalendarStore((state) => state.holidays)
  const additionalHolidays = holidays.map((holiday) => ({
    date: holiday.date,
    name: holiday.name,
    shift: holiday.location,
    type: 'Custom Holiday',
  }))
  const yearlyHolidays = [...YEARLY_HOLIDAYS, ...additionalHolidays]

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select defaultValue="All">
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Holiday Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Holiday Type</SelectItem>
            <SelectItem value="Fixed Holiday">Fixed Holiday</SelectItem>
            <SelectItem value="Restricted Holiday">Restricted Holiday</SelectItem>
            <SelectItem value="Custom Holiday">Custom Holiday</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="All">
          <SelectTrigger className="h-8 w-32">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Shift</SelectItem>
            <SelectItem value="India Day Shift">India Day Shift</SelectItem>
            <SelectItem value="US Shift">US Shift</SelectItem>
          </SelectContent>
        </Select>
        <Button className="min-h-8 px-2.5 text-xs" variant="outline">
          Clear All
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {MONTH_NAMES.map((month, monthIndex) => {
          const monthHolidays = yearlyHolidays.filter((holiday) => new Date(holiday.date).getMonth() === monthIndex)

          return (
            <section className="min-h-64 rounded-md border border-[#021333]/10 bg-white" key={month}>
              <div className="border-b border-[#021333]/10 bg-[#f6f8ff] px-3 py-2 text-sm font-bold text-[#5c6b8e]">
                {month} 2024
              </div>
              <div className="space-y-3 p-3">
                {monthHolidays.length ? (
                  monthHolidays.map((holiday) => {
                    const date = new Date(holiday.date)
                    const day = String(date.getDate()).padStart(2, '0')
                    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

                    return (
                      <div className="flex items-start gap-3" key={`${holiday.date}-${holiday.name}`}>
                        <div className="w-9 shrink-0 rounded border border-[#021333]/10 bg-white text-center">
                          <div className="text-base font-black leading-5 text-[#021333]">{day}</div>
                          <div className="border-t border-[#021333]/10 text-[10px] font-bold text-[#5c6b8e]">{weekday}</div>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#021333]">{holiday.name}</p>
                          <p className="text-xs font-semibold text-[#5c6b8e]">{holiday.type}</p>
                          <p className="text-xs font-bold text-[#1e3fe3] underline decoration-[#1e3fe3]/25">{holiday.shift}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm font-semibold text-[#5c6b8e]">No holidays configured</p>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </Card>
  )
}

function LeaveToolbar({
  filters,
  onStatus,
}: {
  filters: string[]
  onStatus?: (status: LeaveStatusType | 'All') => void
}) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <span className="grid size-9 place-items-center rounded-full bg-[#1e3fe3] text-white">
        <SlidersHorizontal className="size-4" />
      </span>
      <label className="relative min-w-52 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#5c6b8e]" />
        <Input className="h-10 rounded-full pl-9" placeholder="Search by name" />
      </label>
      <div className="basis-full" />
      {filters.map((filter) => (
        <Select key={filter} onValueChange={(value) => filter === 'Status' && onStatus?.(value as LeaveStatusType | 'All')} defaultValue="All">
          <SelectTrigger className="h-8 w-36">
            <SelectValue placeholder={filter} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{filter}</SelectItem>
            {filter === 'Status' && (
              <>
                <SelectItem value="New Request">New Request</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      ))}
      <Button className="min-h-8 px-2.5 text-xs" variant="outline">
        Clear All
      </Button>
    </div>
  )
}
function LeaveTypeField({ formControl }: { formControl: Control<LeaveRequestSchemaType> }) {
  return (
    <Controller
      control={formControl}
      name="leaveType"
      render={({ field }) => (
        <Label>
          Leave type
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Casual leave">Casual leave</SelectItem>
              <SelectItem value="Sick leave">Sick leave</SelectItem>
              <SelectItem value="Earned leave">Earned leave</SelectItem>
              <SelectItem value="Compensatory Off">Compensatory Off</SelectItem>
              <SelectItem value="Loss Of Pay">Loss Of Pay</SelectItem>
            </SelectContent>
          </Select>
        </Label>
      )}
    />
  )
}

function ActionIcon({
  disabled,
  icon,
  label,
  onClick,
  tone = 'neutral',
}: {
  disabled: boolean
  icon: ReactNode
  label: string
  onClick: () => void
  tone?: 'neutral' | 'success'
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        'grid size-8 place-items-center rounded-full transition',
        tone === 'success' ? 'text-[#12734a] hover:bg-emerald-50' : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#021333]',
        disabled && 'pointer-events-none opacity-40',
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {icon}
    </button>
  )
}

function LeaveStatusBadge({ status }: { status: LeaveStatusType }) {
  if (status === 'Approved') {
    return <Badge tone="success">{status}</Badge>
  }

  if (status === 'Rejected') {
    return <Badge tone="danger">{status}</Badge>
  }

  if (status === 'On Hold') {
    return <Badge tone="warning">{status}</Badge>
  }

  return <Badge tone="brand">{status}</Badge>
}

function Pagination() {
  return (
    <div className="mt-4 flex justify-end gap-1 text-sm font-bold text-[#5c6b8e]">
      {['<', '1', '2', '3', '4', '5', '>'].map((page) => (
        <span className={`grid size-7 place-items-center rounded-full ${page === '2' ? 'bg-[#eaf0ff] text-[#1e3fe3]' : ''}`} key={page}>
          {page}
        </span>
      ))}
    </div>
  )
}

function Field({
  error,
  label,
  register,
  type = 'text',
}: {
  error?: string
  label: string
  register: UseFormRegisterReturn
  type?: string
}) {
  return (
    <Label>
      {label}
      <Input aria-invalid={Boolean(error)} className="mt-1" type={type} {...register} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </Label>
  )
}
