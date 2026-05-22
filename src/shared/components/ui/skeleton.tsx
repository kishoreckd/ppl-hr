import { cn } from '../../lib/utils'

interface ISkeletonProps {
  className?: string
}

export function Skeleton({ className }: ISkeletonProps) {
  return <div className={cn('shimmer rounded-md bg-[#eaf0ff]', className)} />
}
