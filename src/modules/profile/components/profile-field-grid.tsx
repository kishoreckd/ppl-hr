import { cn } from '../../../shared/lib/utils'

interface IProfileField {
  label: string
  value: string
}

export function ProfileFieldGrid({
  className,
  fields,
}: {
  className?: string
  fields: IProfileField[]
}) {
  return (
    <div className={cn('grid gap-2 sm:grid-cols-2', className)}>
      {fields.map((field) => (
        <div className="rounded-md border border-[#021333]/10 bg-[#fbfbfd] p-3" key={field.label}>
          <p className="text-[11px] font-bold uppercase text-[#5c6b8e]">{field.label}</p>
          <p className="mt-1 text-sm font-bold text-[#021333]">{field.value}</p>
        </div>
      ))}
    </div>
  )
}
