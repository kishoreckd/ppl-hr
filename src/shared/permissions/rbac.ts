import type { UserRoleType } from '../../modules/organization/types/organization-types'

export function canApprove(role: UserRoleType) {
  return role === 'HR Admin' || role === 'Manager'
}
