import { create } from 'zustand'
import { authApi } from '../api/auth-api'
import type { IAuthSession } from '../types/auth-types'

interface IAuthState {
  session: IAuthSession | null
  setSession: (session: IAuthSession | null) => void
}

export const useAuthStore = create<IAuthState>((set) => ({
  session: authApi.loadSession(),
  setSession: (session) => {
    authApi.persistSession(session)
    set({ session })
  },
}))
