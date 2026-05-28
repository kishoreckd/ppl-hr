import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../../../shared/components/ui/card'
import { cn } from '../../../shared/lib/utils'

interface IProfileSectionCardProps extends PropsWithChildren {
  action?: ReactNode
  className?: string
  eyebrow?: string
  title: string
}

export function ProfileSectionCard({
  action,
  children,
  className,
  eyebrow,
  title,
}: IProfileSectionCardProps) {
  return (
    <Card className={cn('border-[#dce3f1] p-5', className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.06em] text-[#5c6b8e]">{eyebrow}</p>}
          <h3 className="text-lg leading-tight font-black text-[#021333]">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
