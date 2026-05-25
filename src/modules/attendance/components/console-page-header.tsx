import { Breadcrumb } from '../../../shared/components/ui/breadcrumb'
import { getPageBreadcrumb, type ConsolePageType } from '../types/console-types'

interface IConsolePageHeaderProps {
  activePage: ConsolePageType
  onHome: () => void
}

export function ConsolePageHeader({ activePage, onHome }: IConsolePageHeaderProps) {
  return (
    <div className="mb-4 border-b border-[#dce3f1] bg-transparent pb-3">
      <Breadcrumb
        items={getPageBreadcrumb(activePage).map((label) => ({ label }))}
        onHome={onHome}
      />
    </div>
  )
}
