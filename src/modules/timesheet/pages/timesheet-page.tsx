import { CalendarClock, CheckCircle2, PencilLine, Plus, Trash2, XCircle } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { SegmentedPills } from '../../../shared/components/ui/segmented-pills'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table'
import { Textarea } from '../../../shared/components/ui/textarea'
import type { ConsoleRoleType } from '../../attendance/types/console-types'
import { useTimesheetStore } from '../store/use-timesheet-store'
import type { ITimesheetEntry, ITimesheetInput, TimesheetPeriodType } from '../types/timesheet-types'

interface ITimesheetPageProps {
  employeeName: string
  role: ConsoleRoleType
}

const PERIOD_OPTIONS: TimesheetPeriodType[] = ['Daily', 'Weekly', 'Monthly']

const EMPTY_FORM: ITimesheetInput = {
  date: new Date().toISOString().slice(0, 10),
  employeeName: '',
  hours: 8,
  manager: 'Mugesh Rajapandiyan',
  note: '',
  period: 'Daily',
  project: 'TeamPilot HRMS',
  task: '',
}

export function TimesheetPage({ employeeName, role }: ITimesheetPageProps) {
  const { addEntry, deleteEntry, entries, reviewEntry, updateEntry } = useTimesheetStore()
  const [period, setPeriod] = useState<TimesheetPeriodType>('Daily')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ITimesheetInput>({ ...EMPTY_FORM, employeeName, period })
  const canReview = role === 'Manager' || role === 'Admin'

  const visibleEntries = useMemo(() => {
    const scopedEntries = canReview ? entries : entries.filter((entry) => entry.employeeName === employeeName)
    return scopedEntries.filter((entry) => entry.period === period)
  }, [canReview, employeeName, entries, period])

  const totalHours = visibleEntries.reduce((total, entry) => total + entry.hours, 0)
  const pendingReview = visibleEntries.filter((entry) => entry.status === 'Submitted').length

  function syncForm(field: keyof ITimesheetInput, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function selectPeriod(nextPeriod: TimesheetPeriodType) {
    setPeriod(nextPeriod)
    setForm((current) => ({ ...current, period: nextPeriod }))
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, employeeName, period })
  }

  function submitTimesheet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.date || !form.project.trim() || !form.task.trim() || !form.note.trim()) {
      toast.error('Add the date, project, task, and work note before submitting.')
      return
    }

    if (form.hours <= 0) {
      toast.error('Worked hours must be greater than zero.')
      return
    }

    const payload = { ...form, employeeName: form.employeeName.trim() || employeeName }

    if (editingId) {
      updateEntry(editingId, payload)
      toast.success('Timesheet updated successfully.')
    } else {
      addEntry(payload)
      toast.success('Timesheet submitted successfully.')
    }

    resetForm()
  }

  function editEntry(entry: ITimesheetEntry) {
    setEditingId(entry.id)
    setPeriod(entry.period)
    setForm({
      date: entry.date,
      employeeName: entry.employeeName,
      hours: entry.hours,
      manager: entry.manager,
      note: entry.note,
      period: entry.period,
      project: entry.project,
      task: entry.task,
    })
  }

  function removeEntry(id: string) {
    deleteEntry(id)
    if (editingId === id) {
      resetForm()
    }
    toast.success('Timesheet deleted successfully.')
  }

  function review(id: string, status: 'Approved' | 'Rejected') {
    reviewEntry(id, status)
    toast.success(`Timesheet ${status.toLowerCase()} successfully.`)
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce3f1] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1e3fe3]">
              <CalendarClock className="size-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Timesheet</p>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#071126]">
                Add, update, and submit work hours
              </h2>
            </div>
          </div>
          <SegmentedPills
            items={PERIOD_OPTIONS.map((item) => ({ label: item, value: item }))}
            onValueChange={selectPeriod}
            value={period}
          />
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[0.92fr_1.08fr]">
          <form className="rounded-2xl border border-[#dce3f1] bg-[#f8f9fb] p-4" onSubmit={submitTimesheet}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">
                  {editingId ? 'Update entry' : 'New entry'}
                </p>
                <h3 className="text-xl font-black text-[#071126]">{period} timesheet</h3>
              </div>
              <Badge tone={editingId ? 'warning' : 'brand'}>{editingId ? 'Editing' : 'Ready'}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Label>
                Date
                <Input className="mt-2" onChange={(event) => syncForm('date', event.target.value)} type="date" value={form.date} />
              </Label>
              <Label>
                Hours
                <Input
                  className="mt-2"
                  min="0"
                  onChange={(event) => syncForm('hours', Number(event.target.value))}
                  step="0.5"
                  type="number"
                  value={form.hours}
                />
              </Label>
              {canReview && (
                <Label>
                  Employee
                  <Input className="mt-2" onChange={(event) => syncForm('employeeName', event.target.value)} value={form.employeeName} />
                </Label>
              )}
              <Label>
                Reporting manager
                <Input className="mt-2" onChange={(event) => syncForm('manager', event.target.value)} value={form.manager} />
              </Label>
              <Label>
                Project
                <Input className="mt-2" onChange={(event) => syncForm('project', event.target.value)} value={form.project} />
              </Label>
              <Label>
                Period
                <Select onValueChange={(value) => syncForm('period', value as TimesheetPeriodType)} value={form.period}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIOD_OPTIONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>

            <Label className="mt-3 block">
              Work item
              <Input className="mt-2" onChange={(event) => syncForm('task', event.target.value)} placeholder="What did you work on?" value={form.task} />
            </Label>

            <Label className="mt-3 block">
              Work note
              <Textarea className="mt-2" onChange={(event) => syncForm('note', event.target.value)} placeholder="Add a clear update for manager review." value={form.note} />
            </Label>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {editingId && (
                <Button onClick={resetForm} variant="outline">
                  Cancel edit
                </Button>
              )}
              <Button type="submit">
                <Plus className="size-4" />
                {editingId ? 'Update timesheet' : 'Submit timesheet'}
              </Button>
            </div>
          </form>

          <div className="rounded-2xl border border-[#dce3f1] bg-white">
            <div className="grid gap-3 border-b border-[#dce3f1] px-4 py-3 sm:grid-cols-3">
              <SummaryTile label={`${period} hours`} value={`${totalHours}h`} />
              <SummaryTile label="Entries" value={`${visibleEntries.length}`} />
              <SummaryTile label={canReview ? 'For review' : 'Submitted'} value={`${pendingReview}`} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <p className="font-black">{entry.employeeName}</p>
                      <p className="mt-1 text-xs font-semibold text-[#5c6b8e]">{entry.task}</p>
                    </TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.hours}h</TableCell>
                    <TableCell>
                      <Badge tone={getStatusTone(entry.status)}>{entry.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {canReview && entry.status === 'Submitted' && (
                          <>
                            <Button aria-label="Approve timesheet" onClick={() => review(entry.id, 'Approved')} variant="ghost">
                              <CheckCircle2 className="size-4 text-emerald-700" />
                            </Button>
                            <Button aria-label="Reject timesheet" onClick={() => review(entry.id, 'Rejected')} variant="ghost">
                              <XCircle className="size-4 text-rose-600" />
                            </Button>
                          </>
                        )}
                        <Button aria-label="Edit timesheet" onClick={() => editEntry(entry)} variant="ghost">
                          <PencilLine className="size-4" />
                        </Button>
                        <Button aria-label="Delete timesheet" onClick={() => removeEntry(entry.id)} variant="ghost">
                          <Trash2 className="size-4 text-rose-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {visibleEntries.length === 0 && (
              <div className="px-4 py-10 text-center text-sm font-bold text-[#5c6b8e]">
                No timesheet entries for this period.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#dce3f1] bg-[#f8f9fb] px-3 py-2">
      <p className="text-xs font-black uppercase tracking-[0.04em] text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#071126]">{value}</p>
    </div>
  )
}

function getStatusTone(status: ITimesheetEntry['status']) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Submitted') return 'brand'
  return 'neutral'
}
