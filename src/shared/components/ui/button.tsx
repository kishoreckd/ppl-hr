import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'default' | 'ghost' | 'outline' | 'success'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-[#1e3fe3] text-white shadow-[0_18px_34px_rgba(30,63,227,0.22)] hover:bg-[#122b9e]',
  ghost: 'text-[#5c6b8e] hover:bg-[#eef3ff] hover:text-[#1e3fe3]',
  outline: 'border border-[#d7deec] bg-white text-[#071126] shadow-sm hover:border-[#1e3fe3]/40 hover:bg-[#eef3ff] hover:text-[#1e3fe3]',
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
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3fe3]/30 disabled:pointer-events-none disabled:opacity-50',
        BUTTON_VARIANTS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  )
}
