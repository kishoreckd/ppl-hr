import { RefreshCcw } from 'lucide-react'
import { Card } from '../../../shared/components/ui/card'
import { Button } from '../../../shared/components/ui/button'
import { WorkforceDashboard } from '../components/workforce-dashboard'
import { WorkspaceSkeleton } from '../components/workspace-skeleton'
import { useOrganizationWorkspace } from '../hooks/use-organization-workspace'

export function WorkforceOsPage() {
  const workspaceQuery = useOrganizationWorkspace()

  if (workspaceQuery.isLoading) {
    return <WorkspaceSkeleton />
  }

  if (workspaceQuery.isError || !workspaceQuery.data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f7ff] p-6">
        <Card className="max-w-md p-6 text-center">
          <p className="text-xs font-black uppercase text-rose-700">Workspace error</p>
          <h1 className="mt-2 text-2xl font-black text-[#021333]">HRMS modules did not load.</h1>
          <p className="mt-2 text-sm text-[#5c6b8e]">
            Retry before taking hierarchy or approval actions so policy dependencies stay in sync.
          </p>
          <Button className="mt-5" onClick={() => workspaceQuery.refetch()}>
            <RefreshCcw className="size-4" />
            Reload workspace
          </Button>
        </Card>
      </main>
    )
  }

  return <WorkforceDashboard workspace={workspaceQuery.data} />
}
