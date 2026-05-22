import {
  login,
  loadSession,
  persistSession,
  requestReset,
  resetPassword,
  signup,
} from '../services/auth-service'

export const authApi = {
  loadSession,
  login,
  persistSession,
  requestReset,
  resetPassword,
  signup,
}
