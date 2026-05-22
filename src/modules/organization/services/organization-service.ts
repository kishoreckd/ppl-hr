import { ORGANIZATION_WORKSPACE } from '../constants/workspace-data'
import type { IOrganizationWorkspace } from '../types/organization-types'

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

export async function fetchOrganizationWorkspace(): Promise<IOrganizationWorkspace> {
  await wait(820)
  return ORGANIZATION_WORKSPACE
}
