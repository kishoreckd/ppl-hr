import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-[#021333]/15 bg-white px-3 py-2 text-sm text-[#021333] shadow-sm outline-none transition-all duration-200 placeholder:text-[#5c6b8e]/70 focus-visible:border-[#1e3fe3] focus-visible:ring-2 focus-visible:ring-[#1e3fe3]/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-rose-500 aria-[invalid=true]:text-rose-700 aria-[invalid=true]:focus-visible:border-rose-500 aria-[invalid=true]:focus-visible:ring-rose-500/15',
        className,
      )}
      type={type}
      {...props}
    />
  )
}
