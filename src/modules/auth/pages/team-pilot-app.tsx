import { AttendanceConsole } from '../../attendance'
import { useAuthStore } from '../store/use-auth-store'
import { AuthPage } from './auth-page'

export function TeamPilotApp() {
  const session = useAuthStore((state) => state.session)

  return session ? <AttendanceConsole /> : <AuthPage />
}
