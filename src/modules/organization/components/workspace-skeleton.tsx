import { Skeleton } from '../../../shared/components/ui/skeleton'

export function WorkspaceSkeleton() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#f4f7ff] lg:grid-cols-[18rem_1fr]">
      <div className="hidden border-r border-[#021333]/10 bg-white p-6 lg:block">
        <Skeleton className="h-14 w-44" />
        <div className="mt-12 space-y-3">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton className="h-11 w-full" key={index} />
          ))}
        </div>
      </div>
      <main className="p-4 sm:p-6">
        <Skeleton className="h-20 w-full" />
        <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="h-[32rem]" />
          <Skeleton className="h-[32rem]" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-32" key={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
