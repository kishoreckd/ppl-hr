import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus2, CheckCircle2, PlaneTakeoff } from 'lucide-react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import type { AuthRoleType } from '../../auth/types/auth-types'
import { useLeaveCalendarStore } from '../store/use-leave-calendar-store'
import {
  holidaySchema,
  leaveRequestSchema,
  type HolidaySchemaType,
  type LeaveRequestSchemaType,
} from '../validations/leave-calendar-schema'

interface ILeaveCalendarPageProps {
  name: string
  role: AuthRoleType
}

const FIELD =
  'mt-1 h-10 w-full rounded-md border border-[#021333]/15 bg-white px-3 text-sm text-[#021333] outline-none focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15'

export function LeaveCalendarPage({ name, role }: ILeaveCalendarPageProps) {
  const manager = role === 'Manager' || role === 'Admin'
  const { approveLeave, holidays, leaveRequests } = useLeaveCalendarStore()
  const pendingLeaves = leaveRequests.filter((request) => request.status === 'Pending')
  const myLeaves = leaveRequests.filter((request) => request.employee === 'You' || request.employee === name)

  return (
    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#5c6b8e]">Calendar</p>
            <h2 className="text-2xl font-black text-[#021333]">Leave and holidays</h2>
          </div>
          <Badge tone="brand">{holidays.length} holidays</Badge>
        </div>
        <FullCalendar
          events={[
            ...holidays.map((holiday) => ({
              backgroundColor: '#155eef',
              borderColor: '#155eef',
              date: holiday.date,
              title: holiday.name,
            })),
            ...leaveRequests.map((request) => ({
              backgroundColor: request.status === 'Approved' ? '#087443' : '#d97706',
              borderColor: request.status === 'Approved' ? '#087443' : '#d97706',
              end: request.toDate,
              start: request.fromDate,
              title: `${request.employee} | ${request.leaveType}`,
            })),
          ]}
          headerToolbar={{ center: 'title', end: 'next', start: 'prev' }}
          height={620}
          initialDate="2026-05-22"
          plugins={[dayGridPlugin]}
        />
      </Card>
      <div className="space-y-4">
        {manager ? <HolidayForm /> : <LeaveForm name={name} />}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            {manager ? <CheckCircle2 className="size-5 text-[#1e3fe3]" /> : <PlaneTakeoff className="size-5 text-[#1e3fe3]" />}
            <h2 className="text-lg font-black text-[#021333]">
              {manager ? 'Leave approvals' : 'My leave requests'}
            </h2>
          </div>
          <div className="mt-4 space-y-2">
            {(manager ? pendingLeaves : myLeaves).map((request) => (
              <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3" key={request.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black text-[#021333]">{request.employee}</p>
                  <Badge tone={request.status === 'Approved' ? 'success' : 'warning'}>{request.status}</Badge>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#5c6b8e]">
                  {request.leaveType} | {request.fromDate} to {request.toDate}
                </p>
                {manager && (
                  <Button
                    className="mt-3 min-h-8 px-2.5 text-xs"
                    onClick={() => {
                      approveLeave(request.id)
                      toast.success('Leave approved successfully.')
                    }}
                    variant="outline"
                  >
                    Approve
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HolidayForm() {
  const addHoliday = useLeaveCalendarStore((state) => state.addHoliday)
  const form = useForm<HolidaySchemaType>({
    defaultValues: { date: '', location: 'Chennai', name: '' },
    resolver: zodResolver(holidaySchema),
  })

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <CalendarPlus2 className="size-5 text-[#1e3fe3]" />
        <h2 className="text-lg font-black text-[#021333]">Add holiday</h2>
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={form.handleSubmit((values) => {
          addHoliday(values)
          form.reset({ date: '', location: values.location, name: '' })
          toast.success('Holiday added successfully.')
        })}
      >
        <Field error={form.formState.errors.name?.message} label="Holiday" register={form.register('name')} />
        <Field error={form.formState.errors.date?.message} label="Date" register={form.register('date')} type="date" />
        <Field error={form.formState.errors.location?.message} label="Location" register={form.register('location')} />
        <Button className="w-full" type="submit">
          Add to calendar
        </Button>
      </form>
    </Card>
  )
}

function LeaveForm({ name }: { name: string }) {
  const submitLeave = useLeaveCalendarStore((state) => state.submitLeave)
  const form = useForm<LeaveRequestSchemaType>({
    defaultValues: { fromDate: '', leaveType: 'Casual leave', toDate: '' },
    resolver: zodResolver(leaveRequestSchema),
  })

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <PlaneTakeoff className="size-5 text-[#1e3fe3]" />
        <h2 className="text-lg font-black text-[#021333]">Apply leave</h2>
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={form.handleSubmit((values) => {
          submitLeave(name, values)
          form.reset({ fromDate: '', leaveType: values.leaveType, toDate: '' })
          toast.success('Leave request submitted successfully.')
        })}
      >
        <label className="block text-sm font-bold text-[#021333]">
          Leave type
          <select className={FIELD} {...form.register('leaveType')}>
            <option>Casual leave</option>
            <option>Sick leave</option>
            <option>Earned leave</option>
          </select>
        </label>
        <Field error={form.formState.errors.fromDate?.message} label="From" register={form.register('fromDate')} type="date" />
        <Field error={form.formState.errors.toDate?.message} label="To" register={form.register('toDate')} type="date" />
        <Button className="w-full" type="submit">
          Submit request
        </Button>
      </form>
    </Card>
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
    <label className="block text-sm font-bold text-[#021333]">
      {label}
      <input className={FIELD} type={type} {...register} />
      {error && <span className="mt-1 block text-xs text-rose-700">{error}</span>}
    </label>
  )
}
