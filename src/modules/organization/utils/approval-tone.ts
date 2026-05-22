import type { ApprovalStatusType } from '../types/organization-types'

export function getApprovalTone(status: ApprovalStatusType) {
  if (status === 'Escalating') {
    return 'danger' as const
  }

  if (status === 'Policy check') {
    return 'warning' as const
  }

  return 'brand' as const
}
