import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Globe2, Mail, ShieldCheck, UserRoundPlus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { useOrganizationStore } from '../../organization/store'
import { companySchema, type CompanySchemaType } from '../../organization/validations/company-schema'

interface IPreLoginSetupPageProps {
  onComplete: () => void
}

export function PreLoginSetupPage({ onComplete }: IPreLoginSetupPageProps) {
  const { company, setCompany } = useOrganizationStore()
  const form = useForm<CompanySchemaType>({
    defaultValues: company,
    mode: 'onChange',
    resolver: zodResolver(companySchema),
  })

  return (
    <main className="teampilot-grid min-h-screen bg-[#f4f7ff] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 sm:pt-6"
          initial={{ opacity: 0, y: 12 }}
        >
          <Badge tone="brand">Workspace setup</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight text-[#021333] sm:text-5xl">
            Set up the company before login.
          </h1>
          <div className="mt-7 grid gap-3">
            {[
              { icon: UserRoundPlus, text: 'Founder contact' },
              { icon: Globe2, text: 'Company domain and website' },
              { icon: ShieldCheck, text: 'Admin employee access' },
            ].map(({ icon: Icon, text }) => (
              <Card className="flex items-center gap-3 p-4" key={text}>
                <span className="grid size-10 place-items-center rounded-md bg-[#eaf0ff] text-[#1e3fe3]">
                  <Icon className="size-5" />
                </span>
                <p className="text-sm font-bold text-[#021333]">{text}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        <Card className="p-5 sm:p-7">
          <span className="grid size-11 place-items-center rounded-md bg-[#eaf0ff] text-[#1e3fe3]">
            <Building2 className="size-5" />
          </span>
          <h2 className="mt-4 text-3xl font-black text-[#021333]">Company details</h2>
          <p className="mb-5 mt-2 text-sm text-[#5c6b8e]">
            These details create the workspace foundation before any user signs in.
          </p>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={form.handleSubmit((values) => {
              setCompany(values)
              toast.success('Company setup saved. Continue to login.')
              onComplete()
            })}
          >
            <SetupField
              error={form.formState.errors.firstName?.message}
              label="First name"
              registration={form.register('firstName')}
            />
            <SetupField
              error={form.formState.errors.lastName?.message}
              label="Last name"
              registration={form.register('lastName')}
            />
            <SetupField
              error={form.formState.errors.email?.message}
              icon={<Mail className="size-4" />}
              label="Email"
              registration={form.register('email')}
              type="email"
            />
            <SetupField
              error={form.formState.errors.companyDomain?.message}
              label="Company domain"
              placeholder="cxontology.com"
              registration={form.register('companyDomain')}
            />
            <SetupField
              error={form.formState.errors.companyWebsite?.message}
              label="Company website"
              placeholder="https://cxontology.com"
              registration={form.register('companyWebsite')}
              type="url"
            />
            <SetupField
              error={form.formState.errors.companyName?.message}
              label="Company name"
              registration={form.register('companyName')}
            />
            <SetupField
              error={form.formState.errors.adminEmployees?.message}
              label="Admin employees"
              placeholder="Priya HR, Arun Admin"
              registration={form.register('adminEmployees')}
              wrapperClassName="sm:col-span-2"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#f6f8ff] p-3 sm:col-span-2">
              <p className="text-sm text-[#5c6b8e]">
                Admin employees will be available for setup ownership after login.
              </p>
              <Button type="submit">
                Continue to login
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
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
    <Label className={wrapperClassName}>
      {label}
      <div className="relative mt-1.5">
        {icon && <span className="pointer-events-none absolute left-3 top-3.5 text-[#5c6b8e]">{icon}</span>}
        <Input
          aria-invalid={Boolean(error)}
          className={`h-11 ${icon ? 'pl-9' : ''}`}
          placeholder={placeholder}
          type={type}
          {...registration}
        />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </Label>
  )
}
