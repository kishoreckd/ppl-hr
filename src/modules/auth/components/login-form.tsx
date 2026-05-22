import { zodResolver } from '@hookform/resolvers/zod'
import { Fingerprint } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { useLogin, useMicrosoftLogin } from '../hooks/use-auth-actions'
import type { AuthModeType } from '../types/auth-types'
import { getAuthErrorMessage } from '../utils/auth-error'
import { loginSchema, type LoginSchemaType } from '../validations/auth-schema'
import { AuthFormFrame, AuthSwitch, AuthTextField } from './auth-form-ui'

export function LoginForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const mutation = useLogin()
  const microsoftMutation = useMicrosoftLogin()
  const form = useForm<LoginSchemaType>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  return (
    <AuthFormFrame description="Welcome back." icon={<Fingerprint className="size-5" />} title="Sign in">
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await mutation.mutateAsync(values)
            toast.success('Login successful.')
          } catch (error) {
            toast.error(getAuthErrorMessage(error))
          }
        })}
      >
        <AuthTextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
        <AuthTextField
          error={form.formState.errors.password?.message}
          label="Password"
          registration={form.register('password')}
          type="password"
        />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#021333]/10" />
        <span className="text-xs font-bold text-[#5c6b8e]">or</span>
        <span className="h-px flex-1 bg-[#021333]/10" />
      </div>
      <Button
        className="w-full"
        disabled={microsoftMutation.isPending}
        onClick={async () => {
          try {
            await microsoftMutation.mutateAsync()
            toast.success('Microsoft login successful.')
          } catch (error) {
            toast.error(getAuthErrorMessage(error))
          }
        }}
        variant="outline"
      >
        <MicrosoftMark />
        {microsoftMutation.isPending ? 'Connecting...' : 'Continue with Microsoft'}
      </Button>
      <AuthSwitch onForgot={() => setMode('forgot')} onSignup={() => setMode('signup')} />
    </AuthFormFrame>
  )
}

function MicrosoftMark() {
  return (
    <span className="grid grid-cols-2 gap-0.5">
      <span className="size-2 bg-[#f25022]" />
      <span className="size-2 bg-[#7fba00]" />
      <span className="size-2 bg-[#00a4ef]" />
      <span className="size-2 bg-[#ffb900]" />
    </span>
  )
}
