import {
  login,
  loginWithMicrosoft,
  loadSession,
  persistSession,
  requestReset,
  resetPassword,
  signup,
} from '../services/auth-service'

export const authApi = {
  loadSession,
  login,
  loginWithMicrosoft,
  persistSession,
  requestReset,
  resetPassword,
  signup,
}
