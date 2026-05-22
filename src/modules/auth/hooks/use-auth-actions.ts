import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/use-auth-store'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: setSession,
  })
}

export function useSignup() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: setSession,
  })
}

export function usePasswordResetRequest() {
  return useMutation({ mutationFn: authApi.requestReset })
}

export function usePasswordReset() {
  return useMutation({ mutationFn: authApi.resetPassword })
}
