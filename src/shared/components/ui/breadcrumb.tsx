import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface IBreadcrumbItem {
  label: string
}

export function Breadcrumb({
  className,
  items,
  onHome,
}: {
  className?: string
  items: IBreadcrumbItem[]
  onHome?: () => void
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm font-semibold text-[#5c6b8e]', className)}>
      <button
        aria-label="Go to dashboard"
        className="grid size-6 place-items-center rounded text-[#2dbb45] transition hover:bg-[#eaf0ff]"
        onClick={onHome}
        type="button"
      >
        <Home className="size-4 shrink-0" />
      </button>
      {items.map((item) => (
        <span className="inline-flex min-w-0 items-center gap-2" key={item.label}>
          <ChevronRight className="size-4 shrink-0 text-[#5c6b8e]/70" />
          <span className="truncate">{item.label}</span>
        </span>
      ))}
    </nav>
  )
}
