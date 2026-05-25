import { useEffect, useState } from 'react'
import { AttendanceConsole } from '../../attendance'
import {
  CONSOLE_PAGE_PATHS,
  getConsolePageFromPath,
  type ConsolePageType,
} from '../../attendance/types/console-types'
import { useAuthStore } from '../store/use-auth-store'
import type { AuthModeType } from '../types/auth-types'
import { AuthPage } from './auth-page'
import { PreLoginSetupPage } from './pre-login-setup-page'

const AUTH_MODE_PATHS: Record<AuthModeType, string> = {
  forgot: '/forgot-password',
  login: '/login',
  reset: '/reset-password',
  signup: '/signup',
}

function getAuthModeFromPath(pathname: string): AuthModeType {
  const match = Object.entries(AUTH_MODE_PATHS).find(([, path]) => path === pathname)
  return match ? (match[0] as AuthModeType) : 'login'
}

function navigateTo(path: string, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function TeamPilotApp() {
  const session = useAuthStore((state) => state.session)
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    function syncPathname() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', syncPathname)
    return () => window.removeEventListener('popstate', syncPathname)
  }, [])

  useEffect(() => {
    const isConsoleRoute = Boolean(getConsolePageFromPath(pathname))
    const isAuthRoute = Object.values(AUTH_MODE_PATHS).includes(pathname)

    if (session && (isAuthRoute || pathname === '/' || pathname === '/setup')) {
      navigateTo('/dashboard', true)
      return
    }

    if (!session && isConsoleRoute) {
      navigateTo('/login', true)
      return
    }

    if (pathname === '/') {
      navigateTo(session ? '/dashboard' : '/setup', true)
    }
  }, [pathname, session])

  if (!session && pathname === '/setup') {
    return <PreLoginSetupPage onComplete={() => navigateTo('/login')} />
  }

  if (!session) {
    return (
      <AuthPage
        mode={getAuthModeFromPath(pathname)}
        setMode={(mode) => navigateTo(AUTH_MODE_PATHS[mode])}
      />
    )
  }

  return (
    <AttendanceConsole
      activePage={getConsolePageFromPath(pathname) ?? 'dashboard'}
      onLogout={() => navigateTo('/login', true)}
      onPage={(page: ConsolePageType) => navigateTo(CONSOLE_PAGE_PATHS[page])}
    />
  )
}
