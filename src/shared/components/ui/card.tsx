import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'app-card rounded-lg border border-[#021333]/10 bg-white shadow-[0_20px_70px_rgba(18,43,158,0.09)]',
        className,
      )}
      {...props}
    />
  )
}
