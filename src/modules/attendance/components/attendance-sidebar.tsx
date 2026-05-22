import {
  CalendarDays,
  Building2,
  ChevronDown,
  CircleHelp,
  ContactRound,
  Goal,
  Mail,
  Medal,
  Settings2,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  UserRoundPlus,
  UsersRound,
  UserCheck2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Badge } from '../../../shared/components/ui/badge'
import type { ConsolePageType } from '../types/console-types'

interface IAttendanceSidebarProps {
  activePage: ConsolePageType
  collapsed: boolean
  managerView: boolean
  onCollapse: () => void
  onPage: (page: ConsolePageType) => void
  role: string
}

export function AttendanceSidebar({
  activePage,
  collapsed,
  managerView,
  onCollapse,
  onPage,
  role,
}: IAttendanceSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 180 }}
      className="sticky top-0 z-30 hidden h-[calc(100vh-1.65rem)] shrink-0 border-r border-[#021333]/10 bg-white lg:flex lg:flex-col"
      transition={{ damping: 28, stiffness: 260, type: 'spring' }}
    >
      <button
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-9 z-10 grid size-6 place-items-center rounded-full border border-[#021333]/10 bg-white text-[#1e3fe3] shadow-md"
        onClick={onCollapse}
        type="button"
      >
        {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
      </button>
      <div className="flex h-[4.5rem] items-center gap-2 border-b border-[#021333]/10 px-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#1e3fe3] font-black text-white">T</span>
        {!collapsed && (
          <div>
            <p className="text-[11px] font-black uppercase text-[#1e3fe3]">TeamPilot</p>
            <p className="text-lg font-black text-[#021333]">Workspace</p>
          </div>
        )}
      </div>
      <nav className="space-y-1 p-2" aria-label="Workspace">
        <SideItem collapsed={collapsed} icon={<UsersRound className="size-3.5" />} label="Community" onClick={() => onPage('dashboard')} selected={false} />
        <SideItem
          collapsed={collapsed}
          icon={<LayoutDashboard className="size-3.5" />}
          label="Dashboard"
          onClick={() => onPage('dashboard')}
          selected={activePage === 'dashboard'}
        />
        <SideItem collapsed={collapsed} icon={<Medal className="size-3.5" />} label="Insider Program" onClick={() => onPage('dashboard')} selected={false} />
        <SideItem collapsed={collapsed} icon={<Goal className="size-3.5" />} label="OKR" onClick={() => onPage('dashboard')} selected={false} />
        <MenuGroup collapsed={collapsed} icon={<UserCheck2 className="size-3.5" />} label="Attendance">
          <SubItem active={activePage === 'attendance-info'} label="Attendance info" onClick={() => onPage('attendance-info')} />
          <SubItem active={activePage === 'attendance-calendar'} label="Calendar" onClick={() => onPage('attendance-calendar')} />
          <SubItem active={activePage === 'attendance-history'} label="History" onClick={() => onPage('attendance-history')} />
          <SubItem active={activePage === 'regularization'} label="Regularizations" onClick={() => onPage('regularization')} />
          {managerView && (
            <>
              <SubItem active={activePage === 'team-attendance'} label="Team attendance" onClick={() => onPage('team-attendance')} />
              <SubItem active={activePage === 'team-calendar'} label="Team calendar" onClick={() => onPage('team-calendar')} />
            </>
          )}
        </MenuGroup>
        <MenuGroup collapsed={collapsed} icon={<CalendarDays className="size-3.5" />} label="Leave">
          <SubItem active={activePage === 'leave-calendar'} label="Leave calendar" onClick={() => onPage('leave-calendar')} />
        </MenuGroup>
        <SideItem collapsed={collapsed} icon={<Building2 className="size-3.5" />} label="Company" onClick={() => onPage('dashboard')} selected={false} />
        <SideItem collapsed={collapsed} icon={<CircleHelp className="size-3.5" />} label="Help" onClick={() => undefined} selected={false} />
        <SideItem collapsed={collapsed} icon={<ContactRound className="size-3.5" />} label="Team" onClick={() => onPage('team-attendance')} selected={false} />
        <SideItem collapsed={collapsed} icon={<UserRoundPlus className="size-3.5" />} label="Recruitment" onClick={() => onPage('dashboard')} selected={false} />
        <SideItem collapsed={collapsed} icon={<UsersRound className="size-3.5" />} label="Employees" onClick={() => onPage('team-attendance')} selected={false} />
        <SideItem collapsed={collapsed} icon={<Mail className="size-3.5" />} label="Email Subscription" onClick={() => onPage('dashboard')} selected={false} />
      </nav>
      <div className="mt-auto border-t border-[#021333]/10 p-2">
        <SideItem collapsed={collapsed} icon={<Settings2 className="size-3.5" />} label="Settings" onClick={() => undefined} selected={false} />
        {!collapsed && (
          <div className="mt-2 px-2">
            <Badge tone="brand">{role}</Badge>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

function MenuGroup({
  children,
  collapsed,
  icon,
  label,
}: {
  children: ReactNode
  collapsed: boolean
  icon: ReactNode
  label: string
}) {
  return (
    <div>
      <div className="flex h-7 items-center gap-2 rounded px-2 text-[11.5px] font-semibold text-[#5c6b8e]">
        {icon}
        {!collapsed && (
          <>
            <span>{label}</span>
            <ChevronDown className="ml-auto size-3.5 text-[#5c6b8e]" />
          </>
        )}
      </div>
      {!collapsed && <div className="ml-3 border-l border-[#35b86b] py-1 pl-2">{children}</div>}
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
      className={`flex h-6 w-full items-center gap-2 rounded px-2 text-left text-[11.5px] font-medium transition ${
        selected ? 'bg-[#021333]/8 text-[#021333]' : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#021333]'
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
      className={`block min-h-7 w-full truncate rounded px-2 text-left text-[11.5px] font-semibold transition ${
        active ? 'text-[#12734a]' : 'text-[#5c6b8e] hover:text-[#021333]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
