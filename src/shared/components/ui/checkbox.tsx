import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer grid size-4 shrink-0 place-items-center rounded border border-[#021333]/20 bg-white shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1e3fe3]/30 data-[state=checked]:border-[#1e3fe3] data-[state=checked]:bg-[#1e3fe3] data-[state=checked]:text-white',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
