import { motion } from 'framer-motion'
import { CalendarDays, Clock3, Layers3 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../../shared/components/ui/badge'
import { Card } from '../../../shared/components/ui/card'
import { AuthForms } from '../components/auth-forms'
import type { AuthModeType } from '../types/auth-types'

export function AuthPage() {
  const [mode, setMode] = useState<AuthModeType>('login')

  return (
    <main className="teampilot-grid grid min-h-screen items-center bg-[#f4f7ff] p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-8"
        initial={{ opacity: 0, y: 12 }}
      >
        <Badge tone="brand">TeamPilot attendance platform</Badge>
        <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-[#021333] sm:text-6xl">
          Workday clarity for every team.
        </h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Clock3, text: 'Attendance' },
            { icon: CalendarDays, text: 'Leave calendar' },
            { icon: Layers3, text: 'Team approvals' },
          ].map(({ icon: Icon, text }) => (
            <Card className="p-4" key={text}>
              <Icon className="size-5 text-[#1e3fe3]" />
              <p className="mt-4 text-sm font-bold text-[#021333]">{text}</p>
            </Card>
          ))}
        </div>
      </motion.section>
      <Card className="mx-auto w-full max-w-lg p-5 sm:p-8">
        <AuthForms mode={mode} setMode={setMode} />
      </Card>
    </main>
  )
}
