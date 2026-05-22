import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Fingerprint, KeyRound, Mail, ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useForm, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { getAuthErrorMessage } from '../utils/auth-error'
import {
  emailSchema,
  loginSchema,
  resetSchema,
  signupSchema,
  type EmailSchemaType,
  type LoginSchemaType,
  type ResetSchemaType,
  type SignupSchemaType,
} from '../validations/auth-schema'
import { useLogin, usePasswordReset, usePasswordResetRequest, useSignup } from '../hooks/use-auth-actions'
import type { AuthModeType } from '../types/auth-types'

interface IAuthFormsProps {
  mode: AuthModeType
  setMode: (mode: AuthModeType) => void
}

const INPUT_CLASS =
  'mt-1.5 h-11 w-full rounded-md border border-[#021333]/15 bg-white px-3 text-sm text-[#021333] outline-none transition focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15'

export function AuthForms({ mode, setMode }: IAuthFormsProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        initial={{ opacity: 0, y: 8 }}
        key={mode}
      >
        {mode === 'login' && <LoginForm setMode={setMode} />}
        {mode === 'signup' && <SignupForm setMode={setMode} />}
        {mode === 'forgot' && <ForgotForm setMode={setMode} />}
        {mode === 'reset' && <ResetForm setMode={setMode} />}
      </motion.div>
    </AnimatePresence>
  )
}

function LoginForm({ setMode }: Pick<IAuthFormsProps, 'setMode'>) {
  const mutation = useLogin()
  const form = useForm<LoginSchemaType>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  })

  return (
    <AuthFormFrame
      description="Welcome back."
      icon={<Fingerprint className="size-5" />}
      title="Sign in to attendance"
    >
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await mutation.mutateAsync(values)
            toast.success('Login successful. Attendance permissions are ready.')
          } catch (error) {
            toast.error(getAuthErrorMessage(error))
          }
        })}
      >
        <TextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
        <TextField
          error={form.formState.errors.password?.message}
          label="Password"
          registration={form.register('password')}
          type="password"
        />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? 'Securing session...' : 'Login'}
        </Button>
      </form>
      <AuthSwitch onForgot={() => setMode('forgot')} onSignup={() => setMode('signup')} />
    </AuthFormFrame>
  )
}

function SignupForm({ setMode }: Pick<IAuthFormsProps, 'setMode'>) {
  const mutation = useSignup()
  const form = useForm<SignupSchemaType>({
    defaultValues: { email: '', name: '', password: '', role: 'Employee' },
    resolver: zodResolver(signupSchema),
  })

  return (
    <AuthFormFrame
      description="Create a TeamPilot account."
      icon={<UserRoundPlus className="size-5" />}
      title="Create account"
    >
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          await mutation.mutateAsync(values)
          toast.success('Signup successful. Your attendance dashboard is protected and ready.')
        })}
      >
        <TextField error={form.formState.errors.name?.message} label="Employee name" registration={form.register('name')} />
        <TextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
        <TextField
          error={form.formState.errors.password?.message}
          label="Password"
          registration={form.register('password')}
          type="password"
        />
        <RoleField errors={form.formState.errors} registration={form.register('role')} />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          Create secure account
        </Button>
      </form>
      <button className="mt-4 text-sm font-bold text-[#1e3fe3]" onClick={() => setMode('login')} type="button">
        Return to login
      </button>
    </AuthFormFrame>
  )
}

function ForgotForm({ setMode }: Pick<IAuthFormsProps, 'setMode'>) {
  const mutation = usePasswordResetRequest()
  const form = useForm<EmailSchemaType>({ resolver: zodResolver(emailSchema) })

  return (
    <AuthFormFrame
      description="We will send a reset token to your work email."
      icon={<Mail className="size-5" />}
      title="Forgot password"
    >
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          await mutation.mutateAsync(values)
          toast.info(`Reset instructions sent to ${values.email}.`)
          setMode('reset')
        })}
      >
        <TextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          Send reset token
        </Button>
      </form>
      <button className="mt-4 text-sm font-bold text-[#1e3fe3]" onClick={() => setMode('login')} type="button">
        Back to login
      </button>
    </AuthFormFrame>
  )
}

function ResetForm({ setMode }: Pick<IAuthFormsProps, 'setMode'>) {
  const mutation = usePasswordReset()
  const form = useForm<ResetSchemaType>({ resolver: zodResolver(resetSchema) })

  return (
    <AuthFormFrame
      description="Choose a new password."
      icon={<KeyRound className="size-5" />}
      title="Reset password"
    >
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await mutation.mutateAsync(values)
            toast.success('Password reset successful. Login with the new password.')
            setMode('login')
          } catch (error) {
            toast.error(getAuthErrorMessage(error))
          }
        })}
      >
        <TextField error={form.formState.errors.token?.message} label="Reset token" registration={form.register('token')} />
        <TextField
          error={form.formState.errors.password?.message}
          label="New password"
          registration={form.register('password')}
          type="password"
        />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          Update password
        </Button>
      </form>
    </AuthFormFrame>
  )
}

function AuthFormFrame({
  children,
  description,
  icon,
  title,
}: {
  children: React.ReactNode
  description: string
  icon: React.ReactNode
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

function TextField({
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
    <label className="block text-sm font-bold text-[#021333]">
      {label}
      <input className={INPUT_CLASS} type={type} {...registration} />
      {error && <span className="mt-1 block text-xs text-rose-700">{error}</span>}
    </label>
  )
}

function RoleField({
  errors,
  registration,
}: {
  errors: FieldErrors<SignupSchemaType>
  registration: UseFormRegisterReturn
}) {
  return (
    <label className="block text-sm font-bold text-[#021333]">
      Role
      <select className={INPUT_CLASS} {...registration}>
        <option>Employee</option>
        <option>Manager</option>
        <option>Admin</option>
      </select>
      {errors.role?.message && <span className="mt-1 block text-xs text-rose-700">{errors.role.message}</span>}
    </label>
  )
}

function AuthSwitch({ onForgot, onSignup }: { onForgot: () => void; onSignup: () => void }) {
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
