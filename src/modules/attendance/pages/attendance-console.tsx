import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CircleUserRound, LogOut, Menu, MoonStar, Search, SunMedium } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
import { Breadcrumb } from '../../../shared/components/ui/breadcrumb'
import { Input } from '../../../shared/components/ui/input'
import { useUiStore } from '../../../shared/store/use-ui-store'
import { useAuthStore } from '../../auth/store/use-auth-store'
import { LeaveCalendarPage } from '../../calendar'
import {
  EmployeeAttendancePage,
  EmployeeCalendarPage,
  EmployeeHistoryPage,
} from '../../employee'
import { TeamAttendancePage, TeamCalendarPage } from '../../manager'
import { ProfilePage } from '../../profile'
import { AttendanceSidebar } from '../components/attendance-sidebar'
import { AttendancePunchAction } from '../components/attendance-punch-action'
import { RegularizationPage } from './regularization-page'
import { ProductDashboard } from './product-dashboard'
import { canAccessPage, getMobilePages, getPageBreadcrumb, PAGE_TITLES, type ConsolePageType } from '../types/console-types'

interface IAttendanceConsoleProps {
  activePage: ConsolePageType
  onPage: (page: ConsolePageType) => void
  onLogout: () => void
}

export function AttendanceConsole({ activePage, onLogout, onPage }: IAttendanceConsoleProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { session, setSession } = useAuthStore()
  const { dark, toggleTheme } = useUiStore()
  const user = session?.user ?? { email: 'employee@cxontology.com', name: 'You', role: 'Employee' as const }
  const role = user.role
  const managerView = role === 'Manager' || role === 'Admin'

  useEffect(() => {
    if (!canAccessPage(role, activePage)) {
      onPage('dashboard')
      toast.info('That page is not available for this role.')
    }
  }, [activePage, onPage, role])

  return (
    <div className={`teampilot-shell ${dark ? 'teampilot-dark' : ''} teampilot-grid flex min-h-screen`}>
      <AttendanceSidebar
        activePage={activePage}
        collapsed={collapsed}
        managerView={managerView}
        onCollapse={() => setCollapsed((value) => !value)}
        onPage={onPage}
        role={role}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-[#021333]/10 bg-white/90 px-4 py-2 backdrop-blur sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Button className="lg:hidden" onClick={() => setMobileMenu((value) => !value)} variant="outline">
                <Menu className="size-4" />
              </Button>
              <label className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#5c6b8e]" />
                <Input
                  aria-label="Search"
                  className="h-9 rounded-full pl-9"
                  placeholder="Search"
                />
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <AttendancePunchAction className="hidden sm:inline-flex" />
              <Button
                aria-label="Toggle theme"
                onClick={() => {
                  toggleTheme()
                  toast.info(dark ? 'Light mode enabled.' : 'Dark mode enabled.')
                }}
                variant="ghost"
              >
                {dark ? <SunMedium className="size-5" /> : <MoonStar className="size-5" />}
              </Button>
              <Button aria-label="Notifications" onClick={() => toast.info('Notifications opened.')} variant="ghost">
                <Bell className="size-5" />
              </Button>
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-black text-[#021333]">{user.name}</span>
                <span className="block text-xs text-[#5c6b8e]">{role}</span>
              </span>
              <button
                aria-label="Open profile"
                className="grid size-9 place-items-center rounded-full bg-[#eaf0ff] text-[#1e3fe3] transition hover:ring-2 hover:ring-[#1e3fe3]/20"
                onClick={() => onPage('profile')}
                type="button"
              >
                <CircleUserRound className="size-6" />
              </button>
              <Button
                aria-label="Logout"
                onClick={() => {
                  setSession(null)
                  onLogout()
                  toast.info('Logged out.')
                }}
                variant="ghost"
              >
                <LogOut className="size-5" />
              </Button>
            </div>
          </div>
          {mobileMenu && (
            <div className="mt-3 grid gap-1 rounded-lg border border-[#021333]/10 bg-white p-2 lg:hidden">
              {getMobilePages(role).map((page) => (
                <button
                  className={`rounded-md px-3 py-2 text-left text-sm font-bold ${
                    page === activePage ? 'bg-[#eaf0ff] text-[#021333]' : 'text-[#5c6b8e]'
                  }`}
                  key={page}
                  onClick={() => {
                    onPage(page)
                    setMobileMenu(false)
                  }}
                  type="button"
                >
                  {PAGE_TITLES[page]}
                </button>
              ))}
            </div>
          )}
        </header>
        <main className="p-3 sm:p-4">
          <Breadcrumb className="mb-3" items={getPageBreadcrumb(activePage).map((label) => ({ label }))} onHome={() => onPage('dashboard')} />
          <div className="mb-3">
            <h1 className="text-xl font-black text-[#021333]">{getConsoleTitle(activePage)}</h1>
            <p className="text-sm font-semibold text-[#5c6b8e]">{getConsoleSubtitle(activePage, role)}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 12 }}
              key={`${role}-${activePage}`}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ConsolePage activePage={activePage} managerView={managerView} name={user.name} onPage={onPage} role={role} user={user} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function ConsolePage({
  activePage,
  managerView,
  name,
  onPage,
  role,
  user,
}: {
  activePage: ConsolePageType
  managerView: boolean
  name: string
  onPage: (page: ConsolePageType) => void
  role: 'Employee' | 'Manager' | 'Admin'
  user: {
    email: string
    name: string
    role: 'Employee' | 'Manager' | 'Admin'
  }
}) {
  if (activePage === 'profile') {
    return <ProfilePage user={user} />
  }

  if (activePage === 'leave-calendar') {
    return <LeaveCalendarPage name={name} page="calendar" role={role} />
  }

  if (activePage === 'leave-balance') {
    return <LeaveCalendarPage name={name} page="balance" role={role} />
  }

  if (activePage === 'leave-application') {
    return <LeaveCalendarPage name={name} page="application" role={role} />
  }

  if (activePage === 'leave-admin') {
    return <LeaveCalendarPage name={name} page="admin" role={role} />
  }

  if (activePage === 'regularization') {
    return <RegularizationPage managerView={managerView} user={user} />
  }

  if (activePage === 'attendance-info') {
    return <EmployeeAttendancePage />
  }

  if (activePage === 'attendance-calendar') {
    return <EmployeeCalendarPage onRegularize={() => onPage('regularization')} />
  }

  if (activePage === 'attendance-history') {
    return <EmployeeHistoryPage />
  }

  if (activePage === 'team-attendance') {
    return managerView ? <TeamAttendancePage /> : <ProductDashboard onPage={onPage} role={role} />
  }

  if (activePage === 'team-calendar') {
    return managerView ? <TeamCalendarPage /> : <EmployeeCalendarPage />
  }

  return <ProductDashboard onPage={onPage} role={role} />
}

function getConsoleTitle(page: ConsolePageType) {
  return PAGE_TITLES[page]
}

function getConsoleSubtitle(page: ConsolePageType, role: 'Employee' | 'Manager' | 'Admin') {
  if (page === 'dashboard') {
    return role === 'Employee'
      ? 'Track check-ins, leave, history, and requests from one workspace.'
      : 'Track team attendance, exceptions, leave, and approvals from one workspace.'
  }

  if (page.startsWith('leave')) {
    return 'Manage leave balances, applications, holidays, and policy setup.'
  }

  if (page === 'regularization') {
    return 'Create, review, and approve attendance correction requests.'
  }

  if (page.startsWith('attendance')) {
    return 'Review attendance, swipes, calendar status, and work-hour history.'
  }

  return 'Keep employee and workforce information organized.'
}
