import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, GitBranchPlus, Sparkles } from 'lucide-react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import type { ReactNode } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { SETUP_STEPS } from '../constants/workspace-data'
import { useOrganizationStore } from '../store'
import { companySchema, type CompanySchemaType } from '../validations/company-schema'

const FIELD_CLASS =
  'mt-1.5 h-11'

export function SetupJourney() {
  const { company, currentStep, setCompany, setStep } = useOrganizationStore()
  const form = useForm<CompanySchemaType>({
    defaultValues: company,
    resolver: zodResolver(companySchema),
  })

  function saveCompany(values: CompanySchemaType) {
    setCompany(values)
    setStep(1)
    toast.success('Company foundation saved. Add reporting layers and manager ownership next.')
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#021333]/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge tone="brand">Product setup journey</Badge>
            <h1 className="mt-3 text-2xl font-black text-[#021333] sm:text-3xl">
              Build the company before the workflows.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5c6b8e]">
              The first head owns the hierarchy root. Departments, employees, approvals,
              attendance policy, and AI visibility inherit from that structure.
            </p>
          </div>
          <div className="grid min-w-[11rem] grid-cols-3 gap-2">
            {SETUP_STEPS.map((step, index) => (
              <button
                aria-label={`Open ${step} step`}
                className="group text-left"
                key={step}
                onClick={() => setStep(index)}
                type="button"
              >
                <span
                  className={`block h-1.5 rounded-full ${
                    index <= currentStep ? 'bg-[#1e3fe3]' : 'bg-[#eaf0ff]'
                  }`}
                />
                <span className="mt-2 block text-[11px] font-bold text-[#5c6b8e] group-hover:text-[#021333]">
                  {step}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-5"
        initial={{ opacity: 0, y: 8 }}
        key={currentStep}
      >
        {currentStep === 0 && (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(saveCompany)}>
            <Field
              error={form.formState.errors.companyName?.message}
              label="Company name"
              placeholder="CXO People Cloud"
              registration={form.register('companyName')}
            />
            <Field
              error={form.formState.errors.headName?.message}
              label="First company head"
              placeholder="Chief People Officer"
              registration={form.register('headName')}
            />
            <Field
              error={form.formState.errors.location?.message}
              label="Primary location"
              placeholder="Chennai"
              registration={form.register('location')}
            />
            <label className="text-sm font-bold text-[#021333]">
              Employee band
              <select className={`${FIELD_CLASS} w-full rounded-md border border-[#021333]/15 bg-white px-3 text-sm text-[#021333] outline-none transition focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15`} {...form.register('employeeBand')}>
                <option>1-200 employees</option>
                <option>201-1000 employees</option>
                <option>1001-5000 employees</option>
                <option>5000+ employees</option>
              </select>
              {form.formState.errors.employeeBand?.message && (
                <span className="mt-1 block text-xs font-semibold text-rose-600">
                  {form.formState.errors.employeeBand.message}
                </span>
              )}
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#f6f8ff] p-3">
              <p className="text-sm text-[#5c6b8e]">
                Approval impact: the company head becomes the fallback escalation owner until
                HRBP and manager chains are assigned.
              </p>
              <Button type="submit">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        )}
        {currentStep === 1 && (
          <StepPanel
            actionLabel="Lock hierarchy"
            icon={<GitBranchPlus className="size-5" />}
            onAction={() => {
              setStep(2)
              toast.info('Hierarchy layers staged. Configure regional rules before activation.')
            }}
            title="Company > business unit > department > team"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Department owners inherit manager visibility',
                'Dotted-line managers require action permission',
                'Employees join with HRBP and location mapping',
              ].map((rule) => (
                <div className="rounded-md border border-[#021333]/10 bg-white p-3 text-sm text-[#5c6b8e]" key={rule}>
                  <CheckCircle2 className="mb-3 size-4 text-[#12734a]" />
                  {rule}
                </div>
              ))}
            </div>
          </StepPanel>
        )}
        {currentStep === 2 && (
          <StepPanel
            actionLabel="Activate workspace"
            icon={<Sparkles className="size-5" />}
            onAction={() =>
              toast.success(
                'Workspace activated. Attendance, leave, OKR, and approval modules follow the configured hierarchy.',
              )
            }
            title="Policy guardrails and AI assistance"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Policy label="Regional holiday calendar" value={`${company.location || 'Primary'} policies`} />
              <Policy label="Approval traceability" value="Manager > HRBP > SLA escalation" />
              <Policy label="AI visibility" value="Role, hierarchy, and action scoped" />
              <Policy label="Payroll dependency" value="Attendance and leave sync gated" />
            </div>
          </StepPanel>
        )}
      </motion.div>
    </Card>
  )
}

interface IFieldProps {
  error?: string
  label: string
  placeholder: string
  registration: UseFormRegisterReturn
}

function Field({ error, label, placeholder, registration }: IFieldProps) {
  return (
    <label className="text-sm font-bold text-[#021333]">
      {label}
      <Input aria-invalid={Boolean(error)} className={FIELD_CLASS} placeholder={placeholder} {...registration} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </label>
  )
}

interface IStepPanelProps {
  actionLabel: string
  children: ReactNode
  icon: ReactNode
  onAction: () => void
  title: string
}

function StepPanel({ actionLabel, children, icon, onAction, title }: IStepPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-[#eaf0ff] text-[#1e3fe3]">
            {icon}
          </span>
          <h2 className="text-lg font-black text-[#021333]">{title}</h2>
        </div>
        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
      {children}
    </div>
  )
}

function Policy({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3">
      <p className="text-xs font-black uppercase text-[#5c6b8e]">{label}</p>
      <p className="mt-1 font-bold text-[#021333]">{value}</p>
    </div>
  )
}
