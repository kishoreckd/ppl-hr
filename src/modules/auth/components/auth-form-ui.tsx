import { ShieldCheck } from 'lucide-react'
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'
import type { ReactNode } from 'react'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select'
import type { SignupSchemaType } from '../validations/auth-schema'

export function AuthFormFrame({
  children,
  description,
  icon,
  title,
}: {
  children: ReactNode
  description: string
  icon: ReactNode
  title: string
}) {
  return (
    <>
      <span className="grid size-11 place-items-center rounded-md bg-[#eaf0ff] text-[#1e3fe3]">{icon}</span>
      <h1 className="mt-4 text-3xl font-black text-[#021333]">{title}</h1>
      <p className="mb-5 mt-2 text-sm text-[#5c6b8e]">{description}</p>
      {children}
    </>
  )
}

export function AuthTextField({
  error,
  label,
  registration,
  type = 'text',
}: {
  error?: string
  label: string
  registration: UseFormRegisterReturn
  type?: string
}) {
  return (
    <Label>
      {label}
      <Input className="mt-1.5 h-11" type={type} {...registration} />
      {error && <span className="mt-1 block text-xs text-rose-700">{error}</span>}
    </Label>
  )
}

export function SignupRoleField({
  errors,
  onValueChange,
  value,
}: {
  errors: FieldErrors<SignupSchemaType>
  onValueChange: (value: 'Employee' | 'Manager' | 'Admin') => void
  value: 'Employee' | 'Manager' | 'Admin'
}) {
  return (
    <Label>
      Role
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="mt-1.5 h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Employee">Employee</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      {errors.role?.message && <span className="mt-1 block text-xs text-rose-700">{errors.role.message}</span>}
    </Label>
  )
}

export function AuthSwitch({ onForgot, onSignup }: { onForgot: () => void; onSignup: () => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
      <button className="text-[#1e3fe3]" onClick={onForgot} type="button">
        Forgot password
      </button>
      <button className="inline-flex items-center gap-1 text-[#021333]" onClick={onSignup} type="button">
        <ShieldCheck className="size-4 text-[#12734a]" />
        Signup
      </button>
    </div>
  )
}
