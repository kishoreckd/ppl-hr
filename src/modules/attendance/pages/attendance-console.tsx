import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CircleUserRound, LogOut, Menu, MoonStar, Search, SunMedium } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../../shared/components/ui/button'
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
import { AttendanceSidebar } from '../components/attendance-sidebar'
import { AttendancePunchAction } from '../components/attendance-punch-action'
import { RegularizationPage } from './regularization-page'
import { getMobilePages, PAGE_TITLES, type ConsolePageType } from '../types/console-types'

export function AttendanceConsole() {
  const [activePage, setActivePage] = useState<ConsolePageType>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { session, setSession } = useAuthStore()
  const { dark, toggleTheme } = useUiStore()
  const role = session?.user.role ?? 'Employee'
  const managerView = role === 'Manager' || role === 'Admin'

  return (
    <div className={`teampilot-shell ${dark ? 'teampilot-dark' : ''} teampilot-grid flex min-h-screen border-t-[1.65rem] border-t-[#235e65]`}>
      <AttendanceSidebar
        activePage={activePage}
        collapsed={collapsed}
        managerView={managerView}
        onCollapse={() => setCollapsed((value) => !value)}
        onPage={setActivePage}
        role={role}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-[#021333]/10 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Button className="lg:hidden" onClick={() => setMobileMenu((value) => !value)} variant="outline">
                <Menu className="size-4" />
              </Button>
              <label className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#5c6b8e]" />
                <Input
                  aria-label="Search"
                  className="h-10 rounded-full pl-9"
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
                <span className="block text-sm font-black text-[#021333]">{session?.user.name}</span>
                <span className="block text-xs text-[#5c6b8e]">{role}</span>
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-[#eaf0ff] text-[#1e3fe3]">
                <CircleUserRound className="size-6" />
              </span>
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
        <main className="p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#5c6b8e]">
            <span>{PAGE_TITLES[activePage]}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 12 }}
              key={`${role}-${activePage}`}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ConsolePage activePage={activePage} managerView={managerView} name={session?.user.name ?? 'You'} role={role} />
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
  role,
}: {
  activePage: ConsolePageType
  managerView: boolean
  name: string
  role: 'Employee' | 'Manager' | 'Admin'
}) {
  if (activePage === 'leave-calendar') {
    return <LeaveCalendarPage name={name} role={role} />
  }

  if (activePage === 'regularization') {
    return <RegularizationPage managerView={managerView} />
  }

  if (activePage === 'attendance-info') {
    return <EmployeeAttendancePage />
  }

  if (activePage === 'attendance-calendar') {
    return <EmployeeCalendarPage />
  }

  if (activePage === 'attendance-history') {
    return <EmployeeHistoryPage />
  }

  if (activePage === 'team-attendance') {
    return managerView ? <TeamAttendancePage /> : <EmployeeDashboard />
  }

  if (activePage === 'team-calendar') {
    return managerView ? <TeamCalendarPage /> : <EmployeeCalendarPage />
  }

  return managerView ? <ManagerDashboard /> : <EmployeeDashboard />
}
