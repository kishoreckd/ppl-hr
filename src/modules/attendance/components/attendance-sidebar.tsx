import {
  Building2,
  CalendarDays,
  ChevronDown,
  ContactRound,
  Goal,
  LayoutDashboard,
  Mail,
  Medal,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  UserCheck2,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Badge } from '../../../shared/components/ui/badge'
import { canAccessPage, type ConsolePageType, type ConsoleRoleType } from '../types/console-types'

interface IAttendanceSidebarProps {
  activePage: ConsolePageType
  collapsed: boolean
  managerView: boolean
  onCollapse: () => void
  onPage: (page: ConsolePageType) => void
  role: ConsoleRoleType
}

export function AttendanceSidebar({
  activePage,
  collapsed,
  managerView,
  onCollapse,
  onPage,
  role,
}: IAttendanceSidebarProps) {
  const [openGroups, setOpenGroups] = useState({
    attendance: isAttendancePage(activePage),
    leave: isLeavePage(activePage),
  })

  function toggleGroup(group: 'attendance' | 'leave') {
    setOpenGroups((groups) => ({ ...groups, [group]: !groups[group] }))
  }

  function navigatePage(page: ConsolePageType) {
    onPage(page)
    setOpenGroups({
      attendance: isAttendancePage(page),
      leave: isLeavePage(page),
    })
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 78 : 244 }}
      className="sticky top-0 z-30 hidden h-screen shrink-0 overflow-hidden border-r border-[#dce3f1] bg-white lg:flex lg:flex-col"
      transition={{ damping: 28, stiffness: 260, type: 'spring' }}
    >
      <button
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-9 z-10 grid size-7 place-items-center rounded-full border border-[#d7deec] bg-white text-[#1e3fe3] shadow-md"
        onClick={onCollapse}
        type="button"
      >
        {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
      </button>

      <div className="flex h-[5rem] items-center gap-3 border-b border-[#dce3f1] px-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#1e3fe3] text-lg font-black text-white shadow-[0_16px_34px_rgba(30,63,227,0.18)]">T</span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#1e3fe3]">TeamPilot</p>
            <p className="truncate text-xl font-black tracking-[-0.03em] text-[#071126]">Workspace</p>
          </div>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Workspace">
        <NavSection>
          <SideItem collapsed={collapsed} icon={<UsersRound className="size-4" />} label="Community" onClick={() => navigatePage('dashboard')} selected={false} />
          <SideItem
            collapsed={collapsed}
            icon={<LayoutDashboard className="size-4" />}
            label="Dashboard"
            onClick={() => navigatePage('dashboard')}
            selected={activePage === 'dashboard'}
          />
          <SideItem collapsed={collapsed} icon={<Medal className="size-4" />} label="Insider Program" onClick={() => navigatePage('dashboard')} selected={false} />
          <SideItem collapsed={collapsed} icon={<Goal className="size-4" />} label="OKR" onClick={() => navigatePage('dashboard')} selected={false} />
        </NavSection>

        <NavSection>
          <MenuGroup
            collapsed={collapsed}
            icon={<UserCheck2 className="size-4" />}
            label="Attendance"
            onToggle={() => toggleGroup('attendance')}
            open={openGroups.attendance}
          >
            <SubItem active={activePage === 'attendance-info'} label="Attendance info" onClick={() => navigatePage('attendance-info')} />
            <SubItem active={activePage === 'attendance-calendar'} label="Calendar" onClick={() => navigatePage('attendance-calendar')} />
            <SubItem active={activePage === 'attendance-history'} label="History" onClick={() => navigatePage('attendance-history')} />
            <SubItem active={activePage === 'timesheet'} label="Timesheet" onClick={() => navigatePage('timesheet')} />
            <SubItem active={activePage === 'regularization'} label="Regularizations" onClick={() => navigatePage('regularization')} />
            {canAccessPage(role, 'team-attendance') && (
              <>
                <SubItem active={activePage === 'team-attendance'} label="Team attendance" onClick={() => navigatePage('team-attendance')} />
                <SubItem active={activePage === 'team-calendar'} label="Team calendar" onClick={() => navigatePage('team-calendar')} />
              </>
            )}
          </MenuGroup>
          <MenuGroup
            collapsed={collapsed}
            icon={<CalendarDays className="size-4" />}
            label="Leave"
            onToggle={() => toggleGroup('leave')}
            open={openGroups.leave}
          >
            <SubItem active={activePage === 'leave-balance'} label="Leave balance" onClick={() => navigatePage('leave-balance')} />
            <SubItem active={activePage === 'leave-application'} label={managerView ? 'Leave approvals' : 'Leave application'} onClick={() => navigatePage('leave-application')} />
            <SubItem active={activePage === 'leave-calendar'} label="Holiday calendar" onClick={() => navigatePage('leave-calendar')} />
            {canAccessPage(role, 'leave-admin') && <SubItem active={activePage === 'leave-admin'} label="Leave setup" onClick={() => navigatePage('leave-admin')} />}
          </MenuGroup>
          <SideItem collapsed={collapsed} icon={<Building2 className="size-4" />} label="Company" onClick={() => navigatePage('dashboard')} selected={false} />
        </NavSection>

        <NavSection last>
          {canAccessPage(role, 'team-attendance') && <SideItem collapsed={collapsed} icon={<ContactRound className="size-4" />} label="Team" onClick={() => navigatePage('team-attendance')} selected={false} />}
          <SideItem collapsed={collapsed} icon={<UserRoundPlus className="size-4" />} label="Recruitment" onClick={() => navigatePage('dashboard')} selected={false} />
          {canAccessPage(role, 'team-attendance') && <SideItem collapsed={collapsed} icon={<UsersRound className="size-4" />} label="Employees" onClick={() => navigatePage('team-attendance')} selected={false} />}
          <SideItem collapsed={collapsed} icon={<Mail className="size-4" />} label="Email Subscription" onClick={() => navigatePage('settings')} selected={false} />
          <SideItem collapsed={collapsed} icon={<Settings2 className="size-4" />} label="Settings" onClick={() => navigatePage('settings')} selected={activePage === 'settings'} />
        </NavSection>
      </nav>

      {!collapsed && (
        <div className="mt-auto border-t border-[#dce3f1] p-4">
          <Badge tone="brand">{role}</Badge>
        </div>
      )}
    </motion.aside>
  )
}

function NavSection({ children, last = false }: { children: ReactNode; last?: boolean }) {
  return <div className={`space-y-1.5 px-3 py-4 ${last ? '' : 'border-b border-[#dce3f1]'}`}>{children}</div>
}

function MenuGroup({
  children,
  collapsed,
  icon,
  label,
  onToggle,
  open,
}: {
  children: ReactNode
  collapsed: boolean
  icon: ReactNode
  label: string
  onToggle: () => void
  open: boolean
}) {
  return (
    <div>
      <button
        className={`flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-extrabold transition ${
          open ? 'bg-[#eef3ff] text-[#1e3fe3]' : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#1e3fe3]'
        }`}
        onClick={onToggle}
        title={label}
        type="button"
      >
        {icon}
        {!collapsed && (
          <>
            <span className="truncate">{label}</span>
            <ChevronDown className={`ml-auto size-4 text-[#5c6b8e] transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      {!collapsed && open && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className="ml-5 overflow-hidden border-l border-[#1e3fe3]/30 py-2 pl-3"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
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
  icon: ReactNode
  label: string
  onClick: () => void
  selected: boolean
}) {
  return (
    <button
      className={`flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-extrabold transition ${
        selected ? 'bg-[#eef3ff] text-[#1e3fe3]' : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#1e3fe3]'
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

function SubItem({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`block min-h-9 w-full truncate rounded-xl px-3 text-left text-sm font-extrabold transition ${
        active ? 'bg-[#eef3ff] text-[#1e3fe3]' : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#1e3fe3]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function isAttendancePage(page: ConsolePageType) {
  return [
    'attendance-info',
    'attendance-calendar',
    'attendance-history',
    'regularization',
    'timesheet',
    'team-attendance',
    'team-calendar',
  ].includes(page)
}

function isLeavePage(page: ConsolePageType) {
  return ['leave-balance', 'leave-application', 'leave-admin', 'leave-calendar'].includes(page)
}
