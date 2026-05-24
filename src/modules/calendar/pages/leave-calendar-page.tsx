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
  Upload,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Controller, useForm, useWatch, type Control, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Checkbox } from '../../../shared/components/ui/checkbox'
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
import type { ILeaveBalance, ILeaveTypePolicy, LeaveStatusType } from '../types/leave-calendar-types'
import {
  holidaySchema,
  leavePolicySchema,
  leaveRequestSchema,
  type HolidaySchemaType,
  type LeavePolicySchemaType,
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
  { annualQuota: '2', balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-1', status: 'Active', type: 'Restricted Holiday' },
  { annualQuota: '10', balanceLevel: 'Limited', cashable: 'No', gender: 'Married Male', id: 'leave-policy-2', status: 'Inactive', type: 'Paternity Leave' },
  { annualQuota: '180', balanceLevel: 'Limited', cashable: 'Yes', gender: 'Married Female', id: 'leave-policy-3', status: 'Active', type: 'Maternity Leave' },
  { annualQuota: '0', balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-4', status: 'Inactive', type: 'Loss Of Pay' },
  { annualQuota: '0', balanceLevel: 'Limited', cashable: 'Yes', gender: 'All', id: 'leave-policy-5', status: 'Active', type: 'Compensatory Off' },
  { annualQuota: '10', balanceLevel: 'Limited', cashable: 'No', gender: 'All', id: 'leave-policy-6', status: 'Inactive', type: 'Casual Leave' },
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
  const [applyMode, setApplyMode] = useState(false)

  function createLeave(values: LeaveRequestSchemaType) {
    submitLeave(name, values)
    setApplyMode(false)
    toast.success('Leave request submitted successfully.')
  }

  if (applyMode) {
    return <MyLeaveRequestsPage onCancel={() => setApplyMode(false)} onCreate={createLeave} />
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LeaveToolbar filters={['Employee', 'Year']} />
        <Button onClick={() => setApplyMode(true)}>
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
    return <MyLeaveRequestsPage onCreate={createLeave} />
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
  onCancel,
  onCreate,
}: {
  onCancel?: () => void
  onCreate: (values: LeaveRequestSchemaType) => void
}) {
  const holidays = useLeaveCalendarStore((state) => state.holidays)
  const form = useForm<LeaveRequestSchemaType>({
    defaultValues: {
      compOffHours: '',
      compOffWorkedDate: '',
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
  const leaveType = useWatch({ control: form.control, name: 'leaveType' })
  const compOffSelected = leaveType === 'Compensatory Off'
  const dateStartLabel = compOffSelected ? 'Comp Off from' : 'From'
  const dateEndLabel = compOffSelected ? 'Comp Off to' : 'To'

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
      compOffHours: '',
      compOffWorkedDate: '',
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
    if (onCancel) {
      onCancel()
      return
    }

    resetForm()
  }

  function cancelForm() {
    if (onCancel) {
      onCancel()
      return
    }

    resetForm()
  }

  const markers = holidays.map((holiday) => ({
    date: holiday.date,
    label: holiday.name,
    tone: 'brand' as const,
  }))

  return (
    <>
      <Card className="mx-auto max-w-5xl overflow-hidden">
        <div className="border-b border-[#021333]/10 bg-[#f6f8ff] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[#021333]">Create leave request</p>
              <p className="text-sm text-[#5c6b8e]">Choose request type, select dates, and submit for manager approval.</p>
            </div>
            <Button variant="outline" onClick={cancelForm} type="button">
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <RequestCalendarPanel
            helper="Select the leave date range you want to apply for."
            markers={markers}
            onSelectDate={selectDate}
            selectedDates={[fromDate, toDate].filter(Boolean)}
            title="Leave calendar"
          />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-black text-[#021333]">Request details</p>
              <p className="mt-1 text-xs font-semibold text-[#5c6b8e]">
                {compOffSelected
                  ? 'Use Comp Off when you are applying against extra hours already earned.'
                  : 'Select the leave type, date range, and time window.'}
              </p>
            </div>

            <form className="space-y-3" onSubmit={form.handleSubmit(submit)}>
              <LeaveTypeField formControl={form.control} />

              {compOffSelected && (
                <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3">
                  <p className="text-sm font-black text-[#021333]">Comp Off earned from extra work</p>
                  <p className="mt-1 text-xs font-semibold text-[#5c6b8e]">Tell HR which extra work day created this Comp Off balance.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field
                      error={form.formState.errors.compOffWorkedDate?.message}
                      label="Worked date"
                      register={form.register('compOffWorkedDate')}
                      type="date"
                    />
                    <Field
                      error={form.formState.errors.compOffHours?.message}
                      label="Earned hours"
                      register={form.register('compOffHours')}
                      type="number"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Field error={form.formState.errors.fromDate?.message} label={dateStartLabel} register={form.register('fromDate')} type="date" />
                <Field error={form.formState.errors.toDate?.message} label={dateEndLabel} register={form.register('toDate')} type="date" />
                {!compOffSelected && (
                  <>
                    <Field error={form.formState.errors.fromTime?.message} label="From time" register={form.register('fromTime')} type="time" />
                    <Field error={form.formState.errors.toTime?.message} label="To time" register={form.register('toTime')} type="time" />
                  </>
                )}
              </div>

              <Field error={form.formState.errors.emergencyContact?.message} label="Emergency contact" register={form.register('emergencyContact')} />

              <Label>
                Reason
                <textarea
                  aria-invalid={Boolean(form.formState.errors.reason)}
                  className="mt-1 min-h-24 w-full rounded-md border border-[#021333]/15 bg-white px-3 py-2 text-sm text-[#021333] outline-none transition focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15"
                  {...form.register('reason')}
                />
                {form.formState.errors.reason?.message && <span className="mt-1 block text-xs font-semibold text-rose-600">{form.formState.errors.reason?.message}</span>}
              </Label>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="outline" onClick={cancelForm} type="button">
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
  const [policies, setPolicies] = useState<ILeaveTypePolicy[]>(LEAVE_POLICIES)
  const [addMode, setAddMode] = useState(false)
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null)
  const form = useForm<LeavePolicySchemaType>({
    defaultValues: {
      annualQuota: '0',
      balanceLevel: 'Limited',
      cashable: 'No',
      gender: 'All',
      status: 'Active',
      type: '',
    },
    mode: 'onChange',
    resolver: zodResolver(leavePolicySchema),
  })

  function resetPolicyForm() {
    form.reset({
      annualQuota: '0',
      balanceLevel: 'Limited',
      cashable: 'No',
      gender: 'All',
      status: 'Active',
      type: '',
    })
    setAddMode(false)
    setEditingPolicyId(null)
  }

  function savePolicy(values: LeavePolicySchemaType) {
    if (editingPolicyId) {
      setPolicies((current) =>
        current.map((policy) => (policy.id === editingPolicyId ? { ...policy, ...values } : policy)),
      )
      toast.success('Leave policy updated successfully.')
      resetPolicyForm()
      return
    }

    setPolicies((current) => [{ ...values, id: `leave-policy-${Date.now()}` }, ...current])
    resetPolicyForm()
    toast.success('Leave policy added successfully.')
  }

  function editPolicy(policy: ILeaveTypePolicy) {
    setEditingPolicyId(policy.id)
    setAddMode(true)
    form.reset({
      annualQuota: policy.annualQuota,
      balanceLevel: policy.balanceLevel,
      cashable: policy.cashable,
      gender: policy.gender,
      status: policy.status,
      type: policy.type,
    })
  }

  function removePolicy(id: string) {
    setPolicies((current) => current.filter((policy) => policy.id !== id))
    toast.success('Leave policy removed successfully.')
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LeaveToolbar filters={['Status', 'Cashable', 'Leave For']} />
        <Button onClick={() => setAddMode(true)} type="button">
          <CalendarPlus2 className="size-4" />
          Add Leave
        </Button>
      </div>

      {addMode && (
        <div className="mt-4 rounded-lg border border-[#021333]/10 bg-[#f6f8ff] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[#021333]">{editingPolicyId ? 'Edit leave policy' : 'Add leave policy'}</p>
              <p className="text-sm font-semibold text-[#5c6b8e]">Set the annual quota to increase employee leave entitlement for this policy.</p>
            </div>
            <Button onClick={resetPolicyForm} type="button" variant="outline">
              Cancel
            </Button>
          </div>

          <form className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6" onSubmit={form.handleSubmit(savePolicy)}>
            <Field error={form.formState.errors.type?.message} label="Leave type" register={form.register('type')} />
            <Field error={form.formState.errors.annualQuota?.message} label="Annual quota" register={form.register('annualQuota')} type="number" />
            <PolicySelectField
              control={form.control}
              error={form.formState.errors.cashable?.message}
              label="Cashable"
              name="cashable"
              options={['No', 'Yes']}
            />
            <PolicySelectField
              control={form.control}
              error={form.formState.errors.gender?.message}
              label="Leave for"
              name="gender"
              options={['All', 'Married Male', 'Married Female', 'Women', 'Men']}
            />
            <PolicySelectField
              control={form.control}
              error={form.formState.errors.balanceLevel?.message}
              label="Balance level"
              name="balanceLevel"
              options={['Limited', 'Unlimited', 'Accrual based']}
            />
            <PolicySelectField
              control={form.control}
              error={form.formState.errors.status?.message}
              label="Status"
              name="status"
              options={['Active', 'Inactive']}
            />
            <div className="flex items-end gap-2 md:col-span-2 xl:col-span-6">
              <Button type="submit">{editingPolicyId ? 'Update leave policy' : 'Save leave policy'}</Button>
              <Button onClick={resetPolicyForm} type="button" variant="outline">
                Clear
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-[#021333]/10">
        <Table className="min-w-[760px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {['Type', 'Annual Quota', 'Cashable', 'Leave For', 'Balance Level', 'Status', 'Action'].map((heading) => (
                <TableHead className="border-b border-r border-[#021333]/10 bg-white last:border-r-0" key={heading}>
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="border-r border-[#021333]/10 font-semibold text-[#1e3fe3] underline decoration-[#1e3fe3]/30">{policy.type}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.annualQuota} days</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.cashable}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.gender}</TableCell>
                <TableCell className="border-r border-[#021333]/10">{policy.balanceLevel}</TableCell>
                <TableCell className="border-r border-[#021333]/10"><Badge tone={policy.status === 'Active' ? 'success' : 'danger'}>{policy.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[#5c6b8e]">
                    <button className="rounded-md p-1 transition hover:bg-[#eaf0ff] hover:text-[#021333]" onClick={() => editPolicy(policy)} type="button">
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      className="rounded-md p-1 text-rose-500 transition hover:bg-rose-50"
                      onClick={() => removePolicy(policy.id)}
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
  const { addHoliday, addHolidays, holidays } = useLeaveCalendarStore()
  const [addHolidayMode, setAddHolidayMode] = useState(false)
  const holidayForm = useForm<HolidaySchemaType>({
    defaultValues: {
      date: '',
      location: '',
      name: '',
    },
    mode: 'onChange',
    resolver: zodResolver(holidaySchema),
  })
  const additionalHolidays = holidays.map((holiday) => ({
    date: holiday.date,
    name: holiday.name,
    shift: holiday.location,
    type: 'Custom Holiday',
  }))
  const yearlyHolidays = [...YEARLY_HOLIDAYS, ...additionalHolidays]

  function submitHoliday(values: HolidaySchemaType) {
    addHoliday(values)
    holidayForm.reset({ date: '', location: '', name: '' })
    setAddHolidayMode(false)
    toast.success('Holiday added successfully.')
  }

  async function importHolidays(file?: File) {
    if (!file) {
      return
    }

    const text = await file.text()
    const imported = parseHolidayCsv(text)

    if (!imported.length) {
      toast.error('Import failed. Use CSV columns: date,name,location.')
      return
    }

    addHolidays(imported)
    toast.success(`${imported.length} holidays imported successfully.`)
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex flex-wrap items-center gap-2">
          <Button className="min-h-8 px-3 text-xs" onClick={() => setAddHolidayMode(true)} type="button">
            <CalendarPlus2 className="size-4" />
            Add holiday
          </Button>
          <Label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#021333]/15 bg-white px-3 py-2 text-xs font-bold text-[#021333] shadow-sm transition hover:bg-[#f6f8ff]">
            <Upload className="size-4 text-[#1e3fe3]" />
            Import
            <input
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => {
                void importHolidays(event.target.files?.[0])
                event.target.value = ''
              }}
              type="file"
            />
          </Label>
        </div>
      </div>

      {addHolidayMode && (
        <div className="mt-4 rounded-lg border border-[#021333]/10 bg-[#f6f8ff] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[#021333]">Add holiday manually</p>
              <p className="text-sm font-semibold text-[#5c6b8e]">Create location, shift, or business-unit holidays for the calendar.</p>
            </div>
            <Button onClick={() => setAddHolidayMode(false)} type="button" variant="outline">
              Cancel
            </Button>
          </div>
          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={holidayForm.handleSubmit(submitHoliday)}>
            <Field error={holidayForm.formState.errors.date?.message} label="Holiday date" register={holidayForm.register('date')} type="date" />
            <Field error={holidayForm.formState.errors.name?.message} label="Holiday name" register={holidayForm.register('name')} />
            <Field error={holidayForm.formState.errors.location?.message} label="Location or shift" register={holidayForm.register('location')} />
            <div className="flex items-end gap-2 md:col-span-3">
              <Button type="submit">Save holiday</Button>
              <Button
                onClick={() => holidayForm.reset({ date: '', location: '', name: '' })}
                type="button"
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </form>
        </div>
      )}

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

function parseHolidayCsv(csvText: string): HolidaySchemaType[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)

  const dataRows = rows[0]?.toLowerCase().startsWith('date,') ? rows.slice(1) : rows

  return dataRows.flatMap((row) => {
    const [date, name, location] = row.split(',').map((cell) => cell.trim())
    const parsed = holidaySchema.safeParse({ date, location, name })

    return parsed.success ? [parsed.data] : []
  })
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
              <SelectItem value="Compensatory Off">Comp Off</SelectItem>
              <SelectItem value="Loss Of Pay">Loss Of Pay</SelectItem>
            </SelectContent>
          </Select>
        </Label>
      )}
    />
  )
}

function PolicySelectField({
  control,
  error,
  label,
  name,
  options,
}: {
  control: Control<LeavePolicySchemaType>
  error?: string
  label: string
  name: keyof LeavePolicySchemaType
  options: string[]
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Label>
          {label}
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger aria-invalid={Boolean(error)} className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
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
