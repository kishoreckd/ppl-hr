import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Globe2, Mail, Plus, ShieldCheck, Trash2, UserRoundPlus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { SegmentedPills } from '../../../shared/components/ui/segmented-pills'
import { useOrganizationStore } from '../../organization/store'
import { companySchema, type CompanySchemaType } from '../../organization/validations/company-schema'

interface IPreLoginSetupPageProps {
  onComplete: () => void
}

const SETUP_STEPS = [
  {
    eyebrow: 'Owner profile',
    helper: 'Add the workspace owner details before anyone signs in.',
    icon: UserRoundPlus,
    title: 'Tell us about you',
  },
  {
    eyebrow: 'Company identity',
    helper: 'Connect TeamPilot to your company domain and public website.',
    icon: Globe2,
    title: 'Tell us about your company',
  },
  {
    eyebrow: 'Admin access',
    helper: 'Invite the people who can manage policies, holidays, and employee setup.',
    icon: ShieldCheck,
    title: 'Add admin employees',
  },
]
const SETUP_STEP_PILLS = SETUP_STEPS.map((item, index) => ({
  label: `${index + 1}. ${item.eyebrow}`,
  value: String(index),
}))

export function PreLoginSetupPage({ onComplete }: IPreLoginSetupPageProps) {
  const { company, setCompany } = useOrganizationStore()
  const [step, setStep] = useState(0)
  const [admins, setAdmins] = useState([{ email: '', name: '' }])
  const StepIcon = SETUP_STEPS[step].icon
  const form = useForm<CompanySchemaType>({
    defaultValues: company,
    mode: 'onChange',
    resolver: zodResolver(companySchema),
  })

  async function goNext() {
    const fieldsByStep: Array<Array<keyof CompanySchemaType>> = [
      ['firstName', 'lastName', 'email'],
      ['companyDomain', 'companyWebsite', 'companyName'],
      ['adminEmployees'],
    ]

    if (step === 2) {
      completeSetup()
      return
    }

    const valid = await form.trigger(fieldsByStep[step])
    if (valid) {
      setStep((current) => current + 1)
    }
  }

  function addAdminRow() {
    setAdmins((current) => [...current, { email: '', name: '' }])
  }

  function updateAdmin(index: number, key: 'email' | 'name', value: string) {
    setAdmins((current) => current.map((admin, adminIndex) => (adminIndex === index ? { ...admin, [key]: value } : admin)))
  }

  function removeAdmin(index: number) {
    setAdmins((current) => (current.length === 1 ? current : current.filter((_, adminIndex) => adminIndex !== index)))
  }

  async function completeSetup() {
    const validAdmins = admins.filter((admin) => admin.name.trim() && admin.email.trim())

    if (!validAdmins.length) {
      form.setError('adminEmployees', { message: 'Add at least one admin employee.' })
      return
    }

    const invalidEmail = validAdmins.some((admin) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email))
    if (invalidEmail) {
      form.setError('adminEmployees', { message: 'Enter valid admin email addresses.' })
      return
    }

    form.setValue(
      'adminEmployees',
      validAdmins.map((admin) => `${admin.name.trim()} <${admin.email.trim()}>`).join(', '),
      { shouldDirty: true, shouldValidate: true },
    )

    const valid = await form.trigger()
    if (!valid) {
      return
    }

    setCompany(form.getValues())
    toast.success('Company setup saved. Continue to login.')
    onComplete()
  }

  return (
    <main className="h-screen overflow-hidden bg-white text-[#071126]">
      <div className="grid h-full lg:grid-cols-[0.54fr_0.46fr]">
        <section className="flex h-full min-h-0 flex-col px-6 py-4 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#1e3fe3] text-lg font-black text-white shadow-[0_18px_40px_rgba(30,63,227,0.24)]">
              T
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1e3fe3]">TeamPilot</p>
              <p className="text-xl font-black tracking-tight text-[#071126]">Workspace</p>
            </div>
          </div>

          <div className="my-auto w-full max-w-2xl py-4">
            <SegmentedPills
              className="mb-5"
              items={SETUP_STEP_PILLS}
              onValueChange={(value) => setStep(Number(value))}
              value={String(step)}
            />

            <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} key={step} transition={{ duration: 0.24 }}>
              <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1e3fe3]">
                <StepIcon className="size-6" />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#65708a]">{SETUP_STEPS[step].eyebrow}</p>
              <h1 className="mt-1 max-w-xl text-4xl font-black leading-tight tracking-tight text-[#071126]">
                {SETUP_STEPS[step].title}
              </h1>
              <p className="mt-3 max-w-xl text-base font-medium leading-7 text-[#65708a]">{SETUP_STEPS[step].helper}</p>

              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                {step === 0 && (
                  <>
                    <SetupField error={form.formState.errors.firstName?.message} label="First name" registration={form.register('firstName')} />
                    <SetupField error={form.formState.errors.lastName?.message} label="Last name" registration={form.register('lastName')} />
                    <SetupField
                      error={form.formState.errors.email?.message}
                      icon={<Mail className="size-5" />}
                      label="Email"
                      placeholder="john@company.com"
                      registration={form.register('email')}
                      type="email"
                      wrapperClassName="sm:col-span-2"
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <SetupField
                      error={form.formState.errors.companyWebsite?.message}
                      label="Company website"
                      placeholder="https://example.com"
                      registration={form.register('companyWebsite')}
                      type="url"
                      wrapperClassName="sm:col-span-2"
                    />
                    <SetupField
                      error={form.formState.errors.companyName?.message}
                      label="Company name"
                      placeholder="Example"
                      registration={form.register('companyName')}
                    />
                    <SetupField
                      error={form.formState.errors.companyDomain?.message}
                      label="Company domain"
                      placeholder="example.com"
                      registration={form.register('companyDomain')}
                    />
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-3 sm:col-span-2">
                    {admins.map((admin, index) => (
                      <div className="grid gap-3 rounded-2xl border border-[#d8deea] bg-[#fbfcff] p-3 sm:grid-cols-[1fr_1fr_auto]" key={`admin-${index}`}>
                        <Label>
                          Admin name
                          <Input
                            className="mt-2 h-13 rounded-xl text-base"
                            onChange={(event) => updateAdmin(index, 'name', event.target.value)}
                            placeholder="Priya HR"
                            value={admin.name}
                          />
                        </Label>
                        <Label>
                          Admin email
                          <Input
                            className="mt-2 h-13 rounded-xl text-base"
                            onChange={(event) => updateAdmin(index, 'email', event.target.value)}
                            placeholder="priya@company.com"
                            type="email"
                            value={admin.email}
                          />
                        </Label>
                        <Button className="self-end" onClick={() => removeAdmin(index)} type="button" variant="outline">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {form.formState.errors.adminEmployees?.message && (
                      <span className="block text-sm font-bold text-rose-600">{form.formState.errors.adminEmployees.message}</span>
                    )}
                    <Button className="border-[#1e3fe3]/40 text-[#1e3fe3] hover:bg-[#eaf0ff]" onClick={addAdminRow} type="button" variant="outline">
                      <Plus className="size-4" />
                      Add email
                    </Button>
                  </div>
                )}

                <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf4] pt-4 sm:col-span-2">
                  <p className="text-sm font-extrabold text-[#65708a]">Step {step + 1} of 3</p>
                  <div className="flex items-center gap-3">
                    {step > 0 && (
                      <Button className="min-w-32" onClick={() => setStep((current) => current - 1)} type="button" variant="outline">
                        <ArrowLeft className="size-4" />
                        Back
                      </Button>
                    )}
                    <Button className="min-w-40 bg-[#1e3fe3] text-white hover:bg-[#122b9e]" onClick={() => void goNext()} type="button">
                      {step === 2 ? 'Continue' : 'Continue'}
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <SetupIllustration step={step} />
      </div>
    </main>
  )
}

function SetupIllustration({ step }: { step: number }) {
  return (
    <aside className="relative hidden h-full min-h-0 overflow-hidden bg-[#a9daf8] lg:block">
      <div className="absolute inset-x-0 top-0 h-20 bg-white/20" />
      <div className="absolute right-14 top-16 rounded-full bg-white px-5 py-2 text-sm font-black text-[#071126] shadow-sm">
        {step === 0 ? 'Welcome aboard' : step === 1 ? 'Build your company space' : 'Secure admin access'}
      </div>
      <div className="absolute right-24 top-36 size-20 rounded-full bg-[#fff51f] shadow-[0_0_0_20px_rgba(255,245,31,0.18)]" />
      <Cloud className="left-24 top-32" />
      <Cloud className="right-28 top-56 scale-75" />
      <Cloud className="left-44 top-72 scale-90" />
      <div className="absolute bottom-10 left-20 right-20 h-2 rounded-full bg-white/70" />
      <div className="absolute bottom-14 left-24 flex items-end gap-3">
        <Building className="h-60 w-28 bg-[#2d8cff]" windows="bg-[#155eef]" />
        <Building className="h-80 w-32 bg-[#364958]" windows="bg-[#182631]" />
        <Building className="h-68 w-48 bg-[#1e3fe3]" windows="bg-[#8fb3ff]" />
        <Building className="h-56 w-24 bg-[#3e5562]" windows="bg-[#1f303a]" />
      </div>
      <div className="absolute bottom-8 left-24 h-12 w-28 rounded-t-full bg-[#3e5562]" />
      <div className="absolute bottom-8 right-28 h-14 w-32 rounded-t-full bg-[#3e5562]" />
    </aside>
  )
}

function Cloud({ className }: { className: string }) {
  return (
    <div className={`absolute h-10 w-28 ${className}`}>
      <span className="absolute bottom-0 left-0 h-8 w-16 rounded-t-full bg-white" />
      <span className="absolute bottom-0 left-10 h-12 w-14 rounded-t-full bg-white" />
      <span className="absolute bottom-0 left-20 h-6 w-10 rounded-t-full bg-white" />
    </div>
  )
}

function Building({ className, windows }: { className: string; windows: string }) {
  return (
    <div className={`relative rounded-t-sm ${className}`}>
      <div className="grid grid-cols-3 gap-3 p-5">
        {Array.from({ length: 18 }, (_, index) => (
          <span className={`h-7 rounded-sm opacity-70 ${windows}`} key={index} />
        ))}
      </div>
    </div>
  )
}

function SetupField({
  error,
  icon,
  label,
  placeholder,
  registration,
  type = 'text',
  wrapperClassName = '',
}: {
  error?: string
  icon?: ReactNode
  label: string
  placeholder?: string
  registration: UseFormRegisterReturn
  type?: string
  wrapperClassName?: string
}) {
  return (
    <Label className={`text-base font-extrabold text-[#071126] ${wrapperClassName}`}>
      {label}
      <div className="relative mt-2">
        {icon && <span className="pointer-events-none absolute left-4 top-4 text-[#65708a]">{icon}</span>}
        <Input
          aria-invalid={Boolean(error)}
          className={`h-13 rounded-xl border-[#cfd6e4] bg-white text-base shadow-none placeholder:text-[#65708a]/75 focus-visible:border-[#1e3fe3] focus-visible:ring-[#1e3fe3]/15 ${icon ? 'pl-12' : ''}`}
          placeholder={placeholder}
          type={type}
          {...registration}
        />
      </div>
      {error && <span className="mt-2 block text-sm font-bold text-rose-600">{error}</span>}
    </Label>
  )
}
