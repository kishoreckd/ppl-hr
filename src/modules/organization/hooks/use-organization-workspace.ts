import { useQuery } from '@tanstack/react-query'
import { organizationApi } from '../api/organization-api'

export function useOrganizationWorkspace() {
  return useQuery({
    queryFn: organizationApi.getWorkspace,
    queryKey: ['organization-workspace'],
  })
}
