export type RegularizationStatusType = 'New Request' | 'On Hold' | 'Approved' | 'Rejected'
export type RegularizationActionType = 'Approved' | 'Rejected' | 'On Hold'

export interface IRegularizationRequest {
  createdBy: 'self' | 'team'
  dates: string
  days: number
  employeeName: string
  from: string
  id: string
  manager: string
  reason: string
  requestTitle: string
  status: RegularizationStatusType
  to: string
}
