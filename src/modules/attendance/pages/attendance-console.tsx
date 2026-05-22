import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  Search,
  SunMedium,
  UserCheck2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
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

type ConsolePageType =
  | 'dashboard'
  | 'attendance-info'
  | 'attendance-calendar'
  | 'attendance-history'
  | 'team-attendance'
  | 'team-calendar'
  | 'leave-calendar'

const PAGE_TITLES: Record<ConsolePageType, string> = {
  'attendance-calendar': 'Attendance calendar',
  'attendance-history': 'Attendance history',
  'attendance-info': 'Attendance info',
  dashboard: 'Dashboard',
  'leave-calendar': 'Leave and holidays',
  'team-attendance': 'Team attendance',
  'team-calendar': 'Team calendar',
}

export function AttendanceConsole() {
  const [activePage, setActivePage] = useState<ConsolePageType>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { session, setSession } = useAuthStore()
  const { dark, toggleTheme } = useUiStore()
  const role = session?.user.role ?? 'Employee'
  const managerView = role === 'Manager' || role === 'Admin'

  return (
    <div className={`teampilot-shell ${dark ? 'teampilot-dark' : ''} teampilot-grid flex min-h-screen`}>
      <Sidebar
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
              <label className="flex h-11 w-full max-w-xl items-center gap-2 rounded-md border border-[#021333]/10 bg-[#f6f8ff] px-3">
                <Search className="size-4 text-[#5c6b8e]" />
                <input
                  aria-label="Search"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#021333] outline-none"
                  placeholder="Search"
                />
              </label>
            </div>
            <div className="flex items-center gap-1.5">
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
              <span className="grid size-10 place-items-center rounded-full bg-[#eaf0ff] text-[#1e3fe3]">
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
          <div className="mb-4">
            <h1 className="text-3xl font-black text-[#021333]">{PAGE_TITLES[activePage]}</h1>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 12 }}
              key={`${role}-${activePage}`}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Page activePage={activePage} managerView={managerView} name={session?.user.name ?? 'You'} role={role} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function Page({
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

function Sidebar({
  activePage,
  collapsed,
  managerView,
  onCollapse,
  onPage,
  role,
}: {
  activePage: ConsolePageType
  collapsed: boolean
  managerView: boolean
  onCollapse: () => void
  onPage: (page: ConsolePageType) => void
  role: string
}) {
  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-[#021333]/10 bg-white p-4 transition-all lg:flex lg:flex-col ${
        collapsed ? 'w-[5.5rem]' : 'w-72'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1e3fe3] text-lg font-black text-white">T</span>
        {!collapsed && (
          <div>
            <p className="text-xs font-black uppercase text-[#1e3fe3]">TeamPilot</p>
            <p className="text-xl font-black text-[#021333]">Workspace</p>
          </div>
        )}
      </div>
      <nav className="mt-9 space-y-1" aria-label="Workspace">
        <SideItem
          collapsed={collapsed}
          icon={<LayoutDashboard className="size-5" />}
          label="Dashboard"
          onClick={() => onPage('dashboard')}
          selected={activePage === 'dashboard'}
        />
        <MenuGroup collapsed={collapsed} icon={<UserCheck2 className="size-5" />} label="Attendance">
          <SubItem active={activePage === 'attendance-info'} label="Attendance info" onClick={() => onPage('attendance-info')} />
          <SubItem active={activePage === 'attendance-calendar'} label="Calendar" onClick={() => onPage('attendance-calendar')} />
          <SubItem active={activePage === 'attendance-history'} label="History" onClick={() => onPage('attendance-history')} />
          {managerView && (
            <>
              <SubItem active={activePage === 'team-attendance'} label="Team attendance" onClick={() => onPage('team-attendance')} />
              <SubItem active={activePage === 'team-calendar'} label="Team calendar" onClick={() => onPage('team-calendar')} />
            </>
          )}
        </MenuGroup>
        <MenuGroup collapsed={collapsed} icon={<CalendarDays className="size-5" />} label="Leave">
          <SubItem active={activePage === 'leave-calendar'} label="Leave and holidays" onClick={() => onPage('leave-calendar')} />
        </MenuGroup>
      </nav>
      <Card className="mt-auto p-3">
        {!collapsed && (
          <>
            <Badge tone="brand">{role}</Badge>
            <p className="mt-2 text-sm font-black text-[#021333]">TeamPilot</p>
          </>
        )}
        <Button className="mt-3 w-full px-2" onClick={onCollapse} variant="outline">
          <Menu className="size-4" />
          {!collapsed && 'Collapse'}
        </Button>
      </Card>
    </aside>
  )
}

function MenuGroup({
  children,
  collapsed,
  icon,
  label,
}: {
  children: React.ReactNode
  collapsed: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <div>
      <div className="flex h-12 items-center gap-3 rounded-md px-3 text-sm font-black text-[#021333]">
        {icon}
        {!collapsed && (
          <>
            <span>{label}</span>
            <ChevronDown className="ml-auto size-4 text-[#5c6b8e]" />
          </>
        )}
      </div>
      {!collapsed && <div className="ml-5 border-l border-[#021333]/10 pl-4">{children}</div>}
    </div>
  )
}

function SideItem({
  collapsed,
  icon,
  label,
  onClick,
  selected,
}: {
  collapsed: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
  selected: boolean
}) {
  return (
    <button
      className={`flex h-12 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-bold transition ${
        selected ? 'bg-[#eaf0ff] text-[#021333]' : 'text-[#5c6b8e] hover:bg-[#f6f8ff]'
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {icon}
      {!collapsed && label}
    </button>
  )
}

function SubItem({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`block w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
        active ? 'bg-[#eaf0ff] text-[#021333]' : 'text-[#5c6b8e] hover:text-[#021333]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function getMobilePages(managerView: boolean): ConsolePageType[] {
  return managerView
    ? ['dashboard', 'team-attendance', 'team-calendar', 'leave-calendar']
    : ['dashboard', 'attendance-info', 'attendance-calendar', 'attendance-history', 'leave-calendar']
}
