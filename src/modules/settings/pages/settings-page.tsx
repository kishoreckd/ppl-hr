import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { Switch } from '../../../shared/components/ui/switch'
import type { ConsoleRoleType } from '../../attendance/types/console-types'

interface ISettingsPageProps {
  role: ConsoleRoleType
}

const DEFAULT_ROLES = [
  'CEO - Chief Executive Officer',
  'CTO - Chief Technology Officer',
  'CIO - Chief Innovation Officer',
  'CDO - Chief Digital Officer',
  'VP Of Product Management',
  'Head Of Product',
  'Product Manager',
  'VP Of Marketing',
]

const NOTIFICATION_SETTINGS = [
  { key: 'emailSubscription', label: 'Email subscription', note: 'Receive workspace digest emails.' },
  { key: 'swipeEmail', label: 'Swipe in email', note: 'Send email confirmations for check-in and check-out.' },
  { key: 'pushNotifications', label: 'Notifications', note: 'Enable in-app and push alerts.' },
  { key: 'regularizationNotifications', label: 'Regularization notification', note: 'Notify when correction requests change status.' },
  { key: 'leaveNotifications', label: 'Leave notification', note: 'Notify for leave request updates.' },
] as const

type NotificationKeyType = (typeof NOTIFICATION_SETTINGS)[number]['key']

export function SettingsPage({ role }: ISettingsPageProps) {
  const [roles, setRoles] = useState(DEFAULT_ROLES)
  const [roleName, setRoleName] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_ROLES.map((item) => [item, true])),
  )
  const [notifications, setNotifications] = useState<Record<NotificationKeyType, boolean>>({
    emailSubscription: true,
    leaveNotifications: true,
    pushNotifications: true,
    regularizationNotifications: true,
    swipeEmail: false,
  })
  const isAdmin = role === 'Admin'

  function addRole() {
    const nextRole = roleName.trim()
    if (!nextRole) {
      toast.error('Enter a role name.')
      return
    }

    if (roles.includes(nextRole)) {
      toast.error('Role already exists.')
      return
    }

    setRoles((current) => [...current, nextRole])
    setSelectedRoles((current) => ({ ...current, [nextRole]: true }))
    setRoleName('')
    toast.success('Role added successfully.')
  }

  function removeRole(roleToRemove: string) {
    setRoles((current) => current.filter((item) => item !== roleToRemove))
    setSelectedRoles((current) => {
      const next = { ...current }
      delete next[roleToRemove]
      return next
    })
    toast.success('Role removed successfully.')
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce3f1] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Roles</p>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-[#071126]">Organization roles</h2>
          </div>
          <Badge tone={isAdmin ? 'brand' : 'neutral'}>{isAdmin ? 'Admin editable' : 'View only'}</Badge>
        </div>

        {isAdmin && (
          <div className="grid gap-3 border-b border-[#dce3f1] bg-[#fbfcff] px-5 py-4 md:grid-cols-[1fr_auto]">
            <Label>
              Add role
              <Input
                className="mt-2"
                onChange={(event) => setRoleName(event.target.value)}
                placeholder="VP Of Marketing"
                value={roleName}
              />
            </Label>
            <Button className="self-end" onClick={addRole} type="button">
              <Plus className="size-4" />
              Add role
            </Button>
          </div>
        )}

        <div className="max-h-[32rem] overflow-y-auto p-4">
          <div className="grid gap-2">
            {roles.map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#dce3f1] bg-white px-4 py-3" key={item}>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-[#071126]">{item}</p>
                  <p className="text-xs font-bold text-[#5c6b8e]">{selectedRoles[item] ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={Boolean(selectedRoles[item])}
                    onCheckedChange={(checked) => setSelectedRoles((current) => ({ ...current, [item]: checked }))}
                  />
                  {isAdmin && (
                    <Button aria-label={`Remove ${item}`} onClick={() => removeRole(item)} type="button" variant="ghost">
                      <Trash2 className="size-4 text-rose-600" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1e3fe3]">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Preferences</p>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#071126]">Notifications</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#dce3f1] bg-[#fbfcff] p-4" key={setting.key}>
                <div>
                  <p className="text-sm font-extrabold text-[#071126]">{setting.label}</p>
                  <p className="mt-1 text-xs font-semibold text-[#5c6b8e]">{setting.note}</p>
                </div>
                <Switch
                  checked={notifications[setting.key]}
                  onCheckedChange={(checked) => {
                    setNotifications((current) => ({ ...current, [setting.key]: checked }))
                    toast.info(`${setting.label} ${checked ? 'enabled' : 'disabled'}.`)
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        {isAdmin && (
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Admin switches</p>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-[#071126]">Policy notifications</h2>
            <div className="mt-4 grid gap-3">
              {['Admin leave alerts', 'Admin regularization alerts', 'Admin policy change emails'].map((label) => (
                <div className="flex items-center justify-between rounded-2xl border border-[#dce3f1] bg-white p-4" key={label}>
                  <span className="text-sm font-extrabold text-[#071126]">{label}</span>
                  <Switch checked onCheckedChange={() => toast.info(`${label} setting updated.`)} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
