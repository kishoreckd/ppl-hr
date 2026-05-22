import { zodResolver } from '@hookform/resolvers/zod'
import { UserRoundPlus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { useSignup } from '../hooks/use-auth-actions'
import type { AuthModeType } from '../types/auth-types'
import { signupSchema, type SignupSchemaType } from '../validations/auth-schema'
import { AuthFormFrame, AuthTextField, SignupRoleField } from './auth-form-ui'

export function SignupForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const mutation = useSignup()
  const form = useForm<SignupSchemaType>({
    defaultValues: { email: '', name: '', password: '', role: 'Employee' },
    resolver: zodResolver(signupSchema),
  })

  return (
    <AuthFormFrame description="Create a TeamPilot account." icon={<UserRoundPlus className="size-5" />} title="Create account">
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          await mutation.mutateAsync(values)
          toast.success('Signup successful.')
        })}
      >
        <AuthTextField error={form.formState.errors.name?.message} label="Name" registration={form.register('name')} />
        <AuthTextField error={form.formState.errors.email?.message} label="Work email" registration={form.register('email')} />
        <AuthTextField
          error={form.formState.errors.password?.message}
          label="Password"
          registration={form.register('password')}
          type="password"
        />
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <SignupRoleField
              errors={form.formState.errors}
              onValueChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          Create account
        </Button>
      </form>
      <button className="mt-4 text-sm font-bold text-[#1e3fe3]" onClick={() => setMode('login')} type="button">
        Return to login
      </button>
    </AuthFormFrame>
  )
}
