import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'app-card rounded-2xl border border-[#dce3f1] bg-white shadow-[0_22px_70px_rgba(18,43,158,0.08)] transition-[border-color,box-shadow,transform] duration-300',
        className,
      )}
      {...props}
    />
  )
}
