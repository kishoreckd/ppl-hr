import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Bot,
  CalendarDays,
  CircleUserRound,
  Command,
  Menu,
  Play,
  Search,
  ShieldAlert,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { USER_ROLES } from '../constants/workspace-data'
import { useOrganizationStore } from '../store'
import type { IOrganizationWorkspace } from '../types/organization-types'
import { ApprovalTable } from './approval-table'
import { ProductSidebar } from './product-sidebar'
import { SetupJourney } from './setup-journey'

interface IWorkforceDashboardProps {
  workspace: IOrganizationWorkspace
}

export function WorkforceDashboard({ workspace }: IWorkforceDashboardProps) {
  const [aiOpen, setAiOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { company, role, setRole } = useOrganizationStore()

  return (
    <div className="teampilot-grid flex min-h-screen bg-[#f4f7ff]">
      <ProductSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-[#021333]/10 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Button className="lg:hidden" title="Modules" variant="outline">
                <Menu className="size-4" />
              </Button>
              <label className="flex h-11 w-full max-w-xl items-center gap-2 rounded-md border border-[#021333]/12 bg-[#f6f8ff] px-3 text-[#5c6b8e]">
                <Search className="size-4 shrink-0" />
                <input
                  aria-label="Global search"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#021333] outline-none"
                  placeholder="Search employees, policies, approvals, OKRs"
                />
                <Command className="hidden size-4 sm:block" />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => toast.success('Checked in successfully. General shift rules are now tracking attendance.')}
                variant="success"
              >
                <Play className="size-4 fill-current" />
                Check in
              </Button>
              <Button
                aria-label="Notifications"
                onClick={() => toast.warning('3 workflow alerts need approval-chain attention.')}
                variant="ghost"
              >
                <Bell className="size-5" />
              </Button>
              <span className="relative grid size-10 place-items-center rounded-full bg-[#eaf0ff] text-[#1e3fe3]">
                <CircleUserRound className="size-6" />
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
            </div>
          </div>
        </header>
        <main className="space-y-4 p-4 sm:p-6">
          <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="space-y-4">
              <RoleBar companyName={company.companyName} role={role} setRole={setRole} />
              <SetupJourney />
            </div>
            <AnimatePresence>
              {aiOpen && <AiPanel onClose={() => setAiOpen(false)} />}
            </AnimatePresence>
            {!aiOpen && (
              <Button className="justify-self-end 2xl:self-start" onClick={() => setAiOpen(true)} variant="outline">
                <Bot className="size-4" />
                Open AI assistant
              </Button>
            )}
          </section>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {workspace.metrics.map((metric) => (
              <Card className="p-4 transition hover:-translate-y-0.5" key={metric.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#5c6b8e]">{metric.label}</p>
                    <p className="mt-4 text-3xl font-black text-[#021333]">{metric.value}</p>
                  </div>
                  <TrendingUp className="size-5 text-[#12734a]" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#12734a]">{metric.trend}</p>
              </Card>
            ))}
          </section>
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#021333]/10 p-4">
                <div>
                  <Badge tone="warning">Workflow queue</Badge>
                  <h2 className="mt-2 text-xl font-black text-[#021333]">Approval engine cockpit</h2>
                  <p className="mt-1 text-sm text-[#5c6b8e]">
                    Role visibility and policy checks stay attached to every route.
                  </p>
                </div>
                <Button
                  onClick={() => toast.info('Approval SLA view filtered to your reporting hierarchy.')}
                  variant="outline"
                >
                  <ShieldAlert className="size-4" />
                  SLA filters
                </Button>
              </div>
              <ApprovalTable approvals={workspace.approvals} role={role} />
            </Card>
            <div className="space-y-4">
              <HierarchyMap workspace={workspace} />
              <Card className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#1e3fe3]" />
                  <h2 className="font-black text-[#021333]">Regional calendar</h2>
                </div>
                <FullCalendar
                  events={workspace.holidays}
                  headerToolbar={{ center: 'title', end: 'next', start: 'prev' }}
                  height={325}
                  initialDate="2026-05-22"
                  plugins={[dayGridPlugin]}
                />
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

interface IRoleBarProps {
  companyName: string
  role: ReturnType<typeof useOrganizationStore.getState>['role']
  setRole: ReturnType<typeof useOrganizationStore.getState>['setRole']
}

function RoleBar({ companyName, role, setRole }: IRoleBarProps) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <p className="text-xs font-black uppercase text-[#1e3fe3]">Organization workspace</p>
        <p className="mt-1 text-xl font-black text-[#021333]">
          {companyName || 'New company'} hierarchy command center
        </p>
      </div>
      <div className="flex flex-wrap rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-1">
        {USER_ROLES.map((item) => (
          <button
            className={`h-9 rounded px-3 text-sm font-bold transition ${
              item === role ? 'bg-white text-[#021333] shadow-sm' : 'text-[#5c6b8e]'
            }`}
            key={item}
            onClick={() => setRole(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </Card>
  )
}

function AiPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-[#1e3fe3]/15 bg-[#021333] p-4 text-white shadow-[0_24px_80px_rgba(2,19,51,0.24)]"
      exit={{ opacity: 0, x: 18 }}
      initial={{ opacity: 0, x: 18 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-100">
            <Bot className="size-4" />
            AI workforce operator
          </div>
          <h2 className="mt-3 text-xl font-black">Reporting-aware insights</h2>
        </div>
        <Button className="min-h-8 border-white/15 bg-white/10 px-2 text-white hover:bg-white/20" onClick={onClose} variant="outline">
          Hide
        </Button>
      </div>
      <div className="mt-5 space-y-3">
        {[
          '12 attendance anomalies cross payroll cut-off tomorrow.',
          'Engineering Q3 OKRs have 3 unassigned key results.',
          'Chennai optional holidays need shift-dependent eligibility.',
        ].map((insight) => (
          <button
            className="w-full rounded-md border border-white/12 bg-white/8 p-3 text-left text-sm text-blue-50 transition hover:bg-white/15"
            key={insight}
            onClick={() => toast.info(`AI insight queued: ${insight}`)}
            type="button"
          >
            {insight}
          </button>
        ))}
      </div>
    </motion.aside>
  )
}

function HierarchyMap({ workspace }: { workspace: IOrganizationWorkspace }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <UsersRound className="size-4 text-[#1e3fe3]" />
        <h2 className="font-black text-[#021333]">Company inheritance</h2>
      </div>
      <div className="mt-4 space-y-2">
        {workspace.hierarchy.map((node, index) => (
          <div
            className="flex items-center justify-between gap-3 rounded-md border border-[#021333]/10 bg-[#f6f8ff] p-3"
            key={node.label}
            style={{ marginLeft: `${index * 10}px` }}
          >
            <div>
              <p className="text-sm font-black text-[#021333]">{node.label}</p>
              <p className="text-xs text-[#5c6b8e]">{node.owner}</p>
            </div>
            <Badge tone="brand">{node.count}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
