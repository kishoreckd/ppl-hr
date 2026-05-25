import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ISwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, className, onCheckedChange, ...props }: ISwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition',
        checked ? 'border-[#1e3fe3] bg-[#1e3fe3]' : 'border-[#cfd6e4] bg-[#eef3ff]',
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          'size-6 rounded-full bg-white shadow-[0_8px_18px_rgba(7,17,38,0.18)] transition-transform',
          checked ? 'translate-x-7' : 'translate-x-1',
        )}
      />
    </button>
  )
}
