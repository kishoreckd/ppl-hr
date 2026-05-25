import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

interface IBadgeProps extends PropsWithChildren {
  className?: string
  tone?: BadgeTone
}

const BADGE_TONES: Record<BadgeTone, string> = {
  brand: 'border-blue-700/15 bg-blue-700/10 text-[#1e3fe3]',
  danger: 'border-rose-700/15 bg-rose-600/10 text-rose-700',
  neutral: 'border-slate-700/10 bg-slate-100 text-slate-600',
  success: 'border-emerald-700/15 bg-emerald-600/10 text-emerald-700',
  warning: 'border-amber-700/15 bg-amber-500/15 text-amber-800',
}

export function Badge({ children, className, tone = 'neutral' }: IBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-extrabold tracking-[-0.01em]',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
