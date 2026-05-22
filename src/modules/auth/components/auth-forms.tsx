import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { KeyRound, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { usePasswordReset, usePasswordResetRequest } from '../hooks/use-auth-actions'
import type { AuthModeType } from '../types/auth-types'
import { getAuthErrorMessage } from '../utils/auth-error'
import {
  emailSchema,
  resetSchema,
  type EmailSchemaType,
  type ResetSchemaType,
} from '../validations/auth-schema'
import { AuthFormFrame, AuthTextField } from './auth-form-ui'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'

interface IAuthFormsProps {
  mode: AuthModeType
  setMode: (mode: AuthModeType) => void
}

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
        <AuthTextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
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
    <AuthFormFrame description="Choose a new password." icon={<KeyRound className="size-5" />} title="Reset password">
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await mutation.mutateAsync(values)
            toast.success('Password reset successful.')
            setMode('login')
          } catch (error) {
            toast.error(getAuthErrorMessage(error))
          }
        })}
      >
        <AuthTextField error={form.formState.errors.token?.message} label="Reset token" registration={form.register('token')} />
        <AuthTextField
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
