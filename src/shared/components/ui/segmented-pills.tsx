import { cn } from '../../lib/utils'

interface ISegmentedPillItem<TValue extends string> {
  label: string
  value: TValue
}

interface ISegmentedPillsProps<TValue extends string> {
  className?: string
  items: Array<ISegmentedPillItem<TValue>>
  onValueChange: (value: TValue) => void
  value: TValue
}

export function SegmentedPills<TValue extends string>({
  className,
  items,
  onValueChange,
  value,
}: ISegmentedPillsProps<TValue>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist">
      {items.map((item) => {
        const active = item.value === value

        return (
          <button
            aria-selected={active}
            className={cn(
              'min-h-12 rounded-full border px-6 text-base font-medium tracking-[-0.01em] transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3fe3]/20',
              active
                ? 'border-[#1e3fe3] bg-[#eef3ff] text-[#1e3fe3] shadow-[0_10px_24px_rgba(30,63,227,0.08)]'
                : 'border-[#d7deec] bg-white text-[#5c6b8e] hover:border-[#1e3fe3]/40 hover:text-[#1e3fe3]',
            )}
            key={item.value}
            onClick={() => onValueChange(item.value)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
