import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'default' | 'ghost' | 'outline' | 'success'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-[#1e3fe3] text-white shadow-lg shadow-blue-700/20 hover:bg-[#122b9e]',
  ghost: 'text-[#5c6b8e] hover:bg-[#eaf0ff] hover:text-[#021333]',
  outline: 'border border-[#021333]/12 bg-white text-[#021333] hover:border-[#1e3fe3]/35 hover:bg-[#f6f8ff]',
  success: 'bg-[#12734a] text-white shadow-lg shadow-emerald-900/15 hover:bg-[#0b5938]',
}

export function Button({
  className,
  type = 'button',
  variant = 'default',
  ...props
}: IButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3fe3]/45 disabled:pointer-events-none disabled:opacity-50',
        BUTTON_VARIANTS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  )
}
