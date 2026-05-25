import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-xl border border-[#cfd6e4] bg-white px-4 py-3 text-sm font-semibold text-[#071126] shadow-sm outline-none transition-all duration-200 placeholder:text-[#8b96ad] focus:border-[#1e3fe3] focus:ring-2 focus:ring-[#1e3fe3]/15 disabled:cursor-not-allowed disabled:bg-[#f3f5f9] disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}
