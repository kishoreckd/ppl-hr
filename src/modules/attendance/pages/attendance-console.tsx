import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CircleUserRound, LogOut, Menu, MoonStar, Search, SunMedium } from 'lucide-react'
import { useState } from 'react'
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
  EmployeeDashboard,
  EmployeeHistoryPage,
} from '../../employee'
import { ManagerDashboard, TeamAttendancePage, TeamCalendarPage } from '../../manager'
import { ProfilePage } from '../../profile'
import { AttendanceSidebar } from '../components/attendance-sidebar'
import { AttendancePunchAction } from '../components/attendance-punch-action'
import { RegularizationPage } from './regularization-page'
import { getMobilePages, getPageBreadcrumb, PAGE_TITLES, type ConsolePageType } from '../types/console-types'

export function AttendanceConsole() {
  const [activePage, setActivePage] = useState<ConsolePageType>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { session, setSession } = useAuthStore()
  const { dark, toggleTheme } = useUiStore()
  const user = session?.user ?? { email: 'employee@cxontology.com', name: 'You', role: 'Employee' as const }
  const role = user.role
  const managerView = role === 'Manager' || role === 'Admin'

  return (
    <div className={`teampilot-shell ${dark ? 'teampilot-dark' : ''} teampilot-grid flex min-h-screen`}>
      <AttendanceSidebar
        activePage={activePage}
        collapsed={collapsed}
        managerView={managerView}
        onCollapse={() => setCollapsed((value) => !value)}
        onPage={setActivePage}
        role={role}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-[1.65rem] z-20 border-b border-[#021333]/10 bg-white/90 px-4 py-2 backdrop-blur sm:px-5">
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
                onClick={() => setActivePage('profile')}
                type="button"
              >
                <CircleUserRound className="size-6" />
              </button>
              <Button
                aria-label="Logout"
                onClick={() => {
                  setSession(null)
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
              {getMobilePages(managerView).map((page) => (
                <button
                  className={`rounded-md px-3 py-2 text-left text-sm font-bold ${
                    page === activePage ? 'bg-[#eaf0ff] text-[#021333]' : 'text-[#5c6b8e]'
                  }`}
                  key={page}
                  onClick={() => {
                    setActivePage(page)
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
          <Breadcrumb className="mb-3" items={getPageBreadcrumb(activePage).map((label) => ({ label }))} onHome={() => setActivePage('dashboard')} />
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 12 }}
              key={`${role}-${activePage}`}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ConsolePage activePage={activePage} managerView={managerView} name={user.name} onPage={setActivePage} role={role} user={user} />
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
    return managerView ? <TeamAttendancePage /> : <EmployeeDashboard onOpenLeaveApplication={() => onPage('leave-application')} />
  }

  if (activePage === 'team-calendar') {
    return managerView ? <TeamCalendarPage /> : <EmployeeCalendarPage />
  }

  return managerView ? <ManagerDashboard /> : <EmployeeDashboard onOpenLeaveApplication={() => onPage('leave-application')} />
}
