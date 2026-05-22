import {
  BarChart3,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Goal,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../../shared/components/ui/button'
import { cn } from '../../../shared/lib/utils'

interface IProductSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const ITEMS = [
  { icon: BarChart3, label: 'Command center' },
  { icon: Building2, label: 'Company hierarchy' },
  { icon: UsersRound, label: 'Employees' },
  { icon: ClipboardCheck, label: 'Approvals' },
  { icon: CalendarClock, label: 'Attendance and leave' },
  { icon: Goal, label: 'OKRs and reviews' },
  { icon: ShieldCheck, label: 'RBAC and audit' },
]

export function ProductSidebar({ collapsed, onToggle }: IProductSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 88 : 288 }}
      className="sticky top-0 z-20 hidden h-screen shrink-0 overflow-hidden border-r border-[#021333]/10 bg-white lg:block"
    >
      <div className="flex h-full flex-col px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1e3fe3] font-black text-white shadow-xl shadow-blue-700/25">
            P
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-[#1e3fe3]">TeamPilot</p>
              <p className="truncate text-xl font-black text-[#021333]">Workforce OS</p>
            </div>
          )}
        </div>
        <nav className="mt-9 space-y-1" aria-label="Product modules">
          {ITEMS.map(({ icon: Icon, label }, index) => (
            <button
              className={cn(
                'flex h-12 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition',
                index === 0
                  ? 'bg-[#eaf0ff] text-[#021333]'
                  : 'text-[#5c6b8e] hover:bg-[#f6f8ff] hover:text-[#021333]',
              )}
              key={label}
              title={label}
              type="button"
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          {!collapsed && (
            <div className="mb-3 rounded-lg border border-[#021333]/10 bg-[#f6f8ff] p-3 text-sm">
              <p className="font-bold text-[#021333]">Audit ready</p>
              <p className="mt-1 text-[#5c6b8e]">Policy versions travel with every approval.</p>
            </div>
          )}
          <Button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full px-0"
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            variant="outline"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && 'Collapse'}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
